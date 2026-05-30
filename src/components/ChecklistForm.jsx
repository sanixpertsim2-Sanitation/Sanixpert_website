import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  supabase,
  getChecklist,
  getAssignments,
  updateAssignment,
  submitChecklistResponse,
  logActivity,
  getCurrentUser
} from '@/lib/supabase.js'
import { compressPhoto, fileToBase64 } from '@/utils/photoCompression.js'
import {
  ArrowLeft,
  ArrowRight,
  SkipForward,
  Camera,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save
} from 'lucide-react'

/**
 * ChecklistForm.jsx
 * -----------------
 * Route: /line/:lineId/area/:areaId/checklist/:phase
 *
 * Step-by-step checklist with validation, photo upload, and count matching.
 *
 * BUSINESS LOGIC:
 * - Fetches checklist items for the area + phase
 * - Shows one item at a time with progress bar
 * - Response types: yes_no, photo, count
 * - 4 items have has_count=true (equipment_covered + bags_retrieved)
 * - Post-cleaning compares counts with pre-cleaning — mismatch blocks submission
 * - Photos are compressed, stored as base64, uploaded on final submission
 * - All responses submitted at once via submitChecklistResponse
 * - Updates assignment status to completed
 * - Logs activity on success
 * - Offline support: queues in localStorage, syncs when back online
 */
export default function ChecklistForm() {
  const { lineId, areaId, phase } = useParams()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [preCleaningCounts, setPreCleaningCounts] = useState(null)
  const [offlineQueue, setOfflineQueue] = useState(false)

  const isPreCleaning = phase === 'pre-cleaning'
  const isPostCleaning = phase === 'post-cleaning'

  /**
   * Fetch current user
   */
  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {})
  }, [])

  /**
   * Load any saved progress from localStorage (offline support)
   */
  useEffect(() => {
    const saved = localStorage.getItem(`checklist-${lineId}-${areaId}-${phase}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.responses && Object.keys(parsed.responses).length > 0) {
          setResponses(parsed.responses)
          setCurrentIndex(parsed.currentIndex || 0)
        }
      } catch {
        // ignore corrupt local data
      }
    }
  }, [lineId, areaId, phase])

  /**
   * Persist responses to localStorage for offline resilience
   */
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem(
        `checklist-${lineId}-${areaId}-${phase}`,
        JSON.stringify({ responses, currentIndex, savedAt: new Date().toISOString() })
      )
    }
  }, [responses, currentIndex, lineId, areaId, phase])

  /**
   * Fetch checklist items and (for post-cleaning) pre-cleaning counts
   */
  const fetchData = useCallback(async () => {
    if (!areaId || !phase) return
    setError('')
    try {
      // Fetch checklist items
      const { data: itemsData, error: itemsError } = await getChecklist(areaId, phase)
      if (itemsError) throw itemsError
      setItems(itemsData || [])

      // If post-cleaning, fetch pre-cleaning responses for count comparison
      if (isPostCleaning) {
        const { data: preResponses } = await supabase
          .from('checklist_responses')
          .select('*, checklist_templates(item_key, item_text)')
          .eq('area_id', areaId)
          .eq('phase', 'pre-cleaning')
          .order('created_at', { ascending: false })
          .limit(100)

        if (preResponses && preResponses.length > 0) {
          // Build a map of pre-cleaning counts
          const counts = {}
          preResponses.forEach((resp) => {
            if (resp.count_value != null && resp.checklist_templates?.item_key) {
              counts[resp.checklist_templates.item_key] = resp.count_value
            }
          })
          setPreCleaningCounts(counts)
        }
      }
    } catch (err) {
      console.error('Error fetching checklist:', err)
      setError('Failed to load checklist. Please try again.')
    }
  }, [areaId, phase, isPostCleaning])

  /**
   * Initial load
   */
  useEffect(() => {
    let mounted = true
    const load = async () => {
      await fetchData()
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [fetchData])

  /**
   * Listen for online/offline events
   */
  useEffect(() => {
    const handleOnline = () => setOfflineQueue(false)
    const handleOffline = () => setOfflineQueue(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setOfflineQueue(!navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  /**
   * Get count of completed items
   */
  const getCompletedCount = () => {
    return items.filter((item) => {
      const resp = responses[item.id]
      if (!resp) return false
      // Must have an answer value
      if (resp.answer == null || resp.answer === '') return false
      // Photo items must have a photo
      if (item.item_type === 'photo' && !resp.photoBase64) return false
      // Count items must have a count
      if (item.has_count && resp.count == null) return false
      return true
    }).length
  }

  const completedCount = getCompletedCount()
  const totalItems = items.length
  const currentItem = items[currentIndex]
  const currentResponse = currentItem ? responses[currentItem.id] : null
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  /**
   * Check if current item is complete
   */
  const isCurrentItemComplete = () => {
    if (!currentItem || !currentResponse) return false
    if (currentResponse.answer == null || currentResponse.answer === '') return false
    if (currentItem.item_type === 'photo' && !currentResponse.photoBase64) return false
    if (currentItem.has_count && currentResponse.count == null) return false
    return true
  }

  /**
   * Set response for current item
   */
  const setResponse = (updates) => {
    if (!currentItem) return
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: {
        ...prev[currentItem.id],
        ...updates,
        itemId: currentItem.id
      }
    }))
  }

  /**
   * Navigate to next item
   */
  const goNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  /**
   * Navigate to previous item
   */
  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  /**
   * Skip current item (mark as skipped)
   */
  const handleSkip = () => {
    setResponse({ answer: 'skipped', skipped: true })
    goNext()
  }

  /**
   * Handle YES / NO / N-A button click
   */
  const handleAnswer = (value) => {
    setResponse({ answer: value, skipped: false })
  }

  /**
   * Handle photo capture/upload
   */
  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Compress photo
      const compressed = await compressPhoto(file, 1920, 0.85)
      // Convert to base64 for preview
      const base64 = await fileToBase64(compressed)
      setResponse({ photoBase64: base64, photoFile: compressed })
    } catch (err) {
      console.error('Photo processing error:', err)
      setError('Failed to process photo. Please try again.')
      setTimeout(() => setError(''), 3000)
    }
  }

  /**
   * Retake photo
   */
  const handleRetake = () => {
    setResponse({ photoBase64: null, photoFile: null })
  }

  /**
   * Handle count input change
   */
  const handleCountChange = (value) => {
    const num = value === '' ? null : parseInt(value, 10)
    setResponse({ count: num })
  }

  /**
   * Validate covering counts for post-cleaning
   * Returns { valid: boolean, message: string }
   */
  const validateCoveringCounts = () => {
    if (!isPostCleaning || !preCleaningCounts) return { valid: true }

    // Find count items in post-cleaning responses
    const mismatches = []
    items.forEach((item) => {
      if (!item.has_count || !item.item_key) return
      const resp = responses[item.id]
      if (resp?.count == null) return

      const preCount = preCleaningCounts[item.item_key]
      if (preCount != null && resp.count !== preCount) {
        mismatches.push({
          item: item.item_text,
          pre: preCount,
          post: resp.count
        })
      }
    })

    if (mismatches.length > 0) {
      const m = mismatches[0]
      return {
        valid: false,
        message: `Count mismatch! Pre: ${m.pre}, Post: ${m.post}. Please verify.`
      }
    }

    return { valid: true }
  }

  /**
   * Validate all items have responses before submission
   */
  const validateAllAnswered = () => {
    const unanswered = items.filter((item) => {
      const resp = responses[item.id]
      if (!resp) return true
      if (resp.answer == null || resp.answer === '') return true
      if (item.item_type === 'photo' && !resp.photoBase64) return true
      if (item.has_count && resp.count == null) return true
      return false
    })

    if (unanswered.length > 0) {
      return {
        valid: false,
        message: `${unanswered.length} item(s) still need a response.`
      }
    }
    return { valid: true }
  }

  /**
   * Submit all checklist responses
   */
  const handleSubmit = async () => {
    if (!user?.id) {
      setError('You must be signed in to submit.')
      return
    }

    // Validate all answered
    const answeredCheck = validateAllAnswered()
    if (!answeredCheck.valid) {
      setError(answeredCheck.message)
      return
    }

    // Validate covering counts for post-cleaning
    const countCheck = validateCoveringCounts()
    if (!countCheck.valid) {
      setError(countCheck.message)
      return
    }

    setSubmitting(true)
    setError('')

    // Build response records
    const responseRecords = items.map((item) => ({
      checklist_item_id: item.id,
      area_id: areaId,
      line_id: lineId,
      user_id: user.id,
      phase,
      answer: responses[item.id]?.answer,
      photo_url: responses[item.id]?.photoBase64 || null,
      count_value: item.has_count ? responses[item.id]?.count : null,
      notes: responses[item.id]?.notes || null,
      created_at: new Date().toISOString()
    }))

    try {
      if (offlineQueue) {
        // Offline: queue in localStorage
        const queueKey = 'offline-checklist-queue'
        const existing = JSON.parse(localStorage.getItem(queueKey) || '[]')
        existing.push({
          lineId,
          areaId,
          phase,
          responses: responseRecords,
          timestamp: new Date().toISOString()
        })
        localStorage.setItem(queueKey, JSON.stringify(existing))
        setError('You are offline. Responses saved and will sync when back online.')
        setTimeout(() => navigate(`/line/${lineId}/areas`), 2000)
        return
      }

      // Submit all responses
      const { error: submitError } = await submitChecklistResponse(responseRecords)
      if (submitError) throw submitError

      // Find and update assignment to completed
      const today = new Date().toISOString().split('T')[0]
      const { data: assignments } = await getAssignments(lineId, detectShift())
      const myAssignment = (assignments || []).find(
        (a) => a.area_id === areaId && a.user_id === user.id && a.date?.startsWith(today)
      )

      if (myAssignment) {
        // If pre-cleaning, move to post-cleaning phase
        // If post-cleaning, mark as completed
        const update = isPreCleaning
          ? { phase: 'post-cleaning', status: 'in_progress' }
          : { phase: 'completed', status: 'completed' }

        await updateAssignment(myAssignment.id, update)
      }

      // Log activity
      await logActivity({
        line_id: lineId,
        area_id: areaId,
        user_id: user.id,
        action: isPreCleaning ? 'completed_pre_cleaning' : 'completed_post_cleaning',
        details: { shift: detectShift(), items_count: items.length },
        created_at: new Date().toISOString()
      }).catch(() => {}) // non-critical

      // Clear saved localStorage progress
      localStorage.removeItem(`checklist-${lineId}-${areaId}-${phase}`)

      // Navigate back to areas
      navigate(`/line/${lineId}/areas`)
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to submit checklist. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Sync offline queue when back online
   */
  const syncOfflineQueue = useCallback(async () => {
    const queueKey = 'offline-checklist-queue'
    const queue = JSON.parse(localStorage.getItem(queueKey) || '[]')
    if (queue.length === 0) return

    for (const entry of queue) {
      try {
        await submitChecklistResponse(entry.responses)
      } catch (err) {
        console.error('Failed to sync offline entry:', err)
      }
    }
    localStorage.removeItem(queueKey)
    setOfflineQueue(false)
  }, [])

  // Attempt sync when coming back online
  useEffect(() => {
    if (navigator.onLine) {
      syncOfflineQueue()
    }
  }, [syncOfflineQueue])

  /**
   * Detect current shift helper
   */
  const detectShift = () => {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    if (day === 0) return 'sunday'
    if (hour >= 19 || hour < 7) return 'night'
    if (hour >= 11 && hour < 19) return 'afternoon'
    return 'morning'
  }

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="page">
        <div style={{ height: '20px', width: '60%', background: '#e0e0e0', borderRadius: '8px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '12px', width: '40%', background: '#e0e0e0', borderRadius: '8px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        <div className="card" style={{ height: '300px', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
      </div>
    )
  }

  // ─── Empty state ──────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="page">
        <button
          onClick={() => navigate(`/line/${lineId}/areas`)}
          className="navbar-btn mb-2"
          style={{ padding: '8px 0', display: 'inline-flex' }}
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Areas</span>
        </button>
        <h1 className="page-title">Checklist</h1>
        <div className="card text-center" style={{ padding: '48px 24px' }}>
          <AlertTriangle size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
          <h3 className="card-title">No Checklist Items</h3>
          <p className="card-desc">No checklist items found for this area and phase.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Back button */}
      <button
        onClick={() => navigate(`/line/${lineId}/areas`)}
        className="navbar-btn mb-2"
        style={{ padding: '8px 0', display: 'inline-flex' }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <h1 className="page-title">
        {isPreCleaning ? 'Pre-Cleaning' : 'Post-Cleaning'} Checklist
      </h1>
      <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>
        {areaId?.replace(/-/g, ' ')} — {items.length} items
      </p>

      {/* Offline warning */}
      {offlineQueue && (
        <div className="toast toast-error mb-3 flex items-center gap-2">
          <AlertTriangle size={16} />
          You are offline. Responses will be queued and synced when back online.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="toast toast-error mb-3 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Progress bar */}
      <div className="card mb-3" style={{ padding: '12px 16px' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted">Progress</span>
          <span className="text-sm font-medium">{completedCount} / {totalItems}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'var(--color-primary)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Current checklist item card */}
      {currentItem && (
        <div className="checklist-item card" style={{ marginBottom: '16px' }}>
          {/* Item counter */}
          <div className="text-sm text-muted mb-2">
            Question {currentIndex + 1} of {totalItems}
          </div>

          {/* Question */}
          <p className="checklist-question">
            {currentItem.item_text || currentItem.question}
          </p>

          {/* Help text if available */}
          {currentItem.help_text && (
            <p className="text-sm text-muted mb-3">{currentItem.help_text}</p>
          )}

          {/* Pre-cleaning count reference (visible during post-cleaning) */}
          {isPostCleaning && currentItem.has_count && currentItem.item_key && preCleaningCounts?.[currentItem.item_key] != null && (
            <div
              className="mb-3"
              style={{
                padding: '8px 12px',
                background: 'var(--color-primary-light)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--color-primary)'
              }}
            >
              <strong>Pre-cleaning count:</strong> {preCleaningCounts[currentItem.item_key]}
            </div>
          )}

          {/* ── YES / NO buttons for yes_no items ── */}
          {currentItem.item_type === 'yes_no' && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleAnswer('yes')}
                  className="btn flex-1"
                  style={{
                    background: currentResponse?.answer === 'yes' ? '#1a5f2a' : '#e8f5e9',
                    color: currentResponse?.answer === 'yes' ? '#fff' : '#1a5f2a',
                    border: '2px solid #1a5f2a',
                    minHeight: '48px',
                    fontSize: '1rem'
                  }}
                >
                  <CheckCircle size={18} />
                  YES
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  className="btn flex-1"
                  style={{
                    background: currentResponse?.answer === 'no' ? '#e74c3c' : '#fdecea',
                    color: currentResponse?.answer === 'no' ? '#fff' : '#e74c3c',
                    border: '2px solid #e74c3c',
                    minHeight: '48px',
                    fontSize: '1rem'
                  }}
                >
                  <AlertTriangle size={18} />
                  NO
                </button>
              </div>
              <button
                onClick={() => handleAnswer('n/a')}
                className="btn"
                style={{
                  background: currentResponse?.answer === 'n/a' ? '#95a5a6' : '#f5f6fa',
                  color: currentResponse?.answer === 'n/a' ? '#fff' : '#7f8c8d',
                  border: '2px solid #ddd',
                  minHeight: '44px'
                }}
              >
                N/A — Not Applicable
              </button>
            </div>
          )}

          {/* ── Photo upload for photo items ── */}
          {currentItem.item_type === 'photo' && (
            <div className="photo-upload">
              {currentResponse?.photoBase64 ? (
                <div>
                  <img
                    src={currentResponse.photoBase64}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: '250px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '8px'
                    }}
                  />
                  <button
                    onClick={handleRetake}
                    className="btn btn-outline flex items-center justify-center gap-1"
                    style={{ width: '100%' }}
                  >
                    <RotateCcw size={16} />
                    Retake Photo
                  </button>
                </div>
              ) : (
                <label className="photo-dropzone" style={{ display: 'block' }}>
                  <Camera size={32} style={{ marginBottom: '8px', color: 'var(--color-primary)' }} />
                  <p>Tap to take photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          )}

          {/* ── Count input for count items ── */}
          {currentItem.has_count && (
            <div className="form-group mb-0">
              <label htmlFor={`count-${currentItem.id}`}>
                {currentItem.count_label || 'Count'}
              </label>
              <input
                id={`count-${currentItem.id}`}
                type="number"
                min="0"
                value={currentResponse?.count ?? ''}
                onChange={(e) => handleCountChange(e.target.value)}
                placeholder="Enter count..."
                className="form-input"
                style={{ fontSize: '1.1rem', minHeight: '48px' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
          className="btn btn-outline flex-1 flex items-center justify-center gap-1"
          style={{ minHeight: '48px' }}
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <button
          onClick={handleSkip}
          className="btn btn-outline flex items-center justify-center gap-1"
          style={{ minHeight: '48px', color: 'var(--color-text-muted)', borderColor: '#ddd' }}
        >
          <SkipForward size={16} />
          Skip
        </button>

        <button
          onClick={goNext}
          disabled={currentIndex >= totalItems - 1}
          className="btn btn-primary flex-1 flex items-center justify-center gap-1"
          style={{ minHeight: '48px' }}
        >
          Next
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Summary toggle */}
      <button
        onClick={() => setShowSummary((prev) => !prev)}
        className="btn btn-outline btn-full flex items-center justify-center gap-2 mb-3"
      >
        {showSummary ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        {showSummary ? 'Hide' : 'Show'} Summary ({completedCount}/{totalItems} answered)
      </button>

      {/* Collapsible summary */}
      {showSummary && (
        <div className="card mb-4" style={{ maxHeight: '300px', overflow: 'auto' }}>
          <h4 className="mb-2" style={{ fontSize: '1rem' }}>Response Summary</h4>
          {items.map((item, idx) => {
            const resp = responses[item.id]
            const answered = resp?.answer != null && resp?.answer !== ''
            return (
              <div
                key={item.id}
                className="flex items-start gap-2 py-2"
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentIndex(idx)}
              >
                <span
                  style={{
                    minWidth: '20px',
                    color: answered ? 'var(--color-success)' : 'var(--color-text-muted)'
                  }}
                >
                  {answered ? <CheckCircle size={16} /> : <span style={{ opacity: 0.3 }}>{idx + 1}</span>}
                </span>
                <span
                  style={{
                    flex: 1,
                    color: answered ? 'var(--color-text)' : 'var(--color-text-muted)'
                  }}
                >
                  {item.item_text || item.question}
                </span>
                {answered && (
                  <span className="badge badge-rte" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {resp.answer}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Submit button — only when all answered */}
      <div className="page-actions">
        <button
          onClick={handleSubmit}
          className="btn btn-primary btn-full flex items-center justify-center gap-2"
          disabled={submitting || completedCount < totalItems}
          style={{ minHeight: '52px', fontSize: '1.05rem' }}
        >
          {submitting ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
              Submitting...
            </>
          ) : (
            <>
              <Save size={20} />
              Submit Checklist ({completedCount}/{totalItems})
            </>
          )}
        </button>
        {completedCount < totalItems && (
          <p className="text-center text-sm text-muted mt-2">
            Answer all {totalItems} items to enable submission
          </p>
        )}
      </div>
    </div>
  )
}
