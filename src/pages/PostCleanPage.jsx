import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChecklist, insertPostCleanLog, insertDamageReport, uploadPhoto } from '../lib/supabase.js'

export default function PostCleanPage() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [responses, setResponses] = useState({})
  const [goodBags, setGoodBags] = useState('')
  const [badBags, setBadBags] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  /* ── Damage modal state ── */
  const [showDamageModal, setShowDamageModal] = useState(false)
  const [damageDescription, setDamageDescription] = useState('')
  const [damageSeverity, setDamageSeverity] = useState('medium')
  const [damagePhotoUrl, setDamagePhotoUrl] = useState('')
  const [damageSubmitting, setDamageSubmitting] = useState(false)
  const [damageError, setDamageError] = useState('')

  /* ── load saved progress ── */
  useEffect(() => {
    const saved = localStorage.getItem(`post-clean-${lineId}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.responses) setResponses(parsed.responses)
        if (parsed.goodBags != null) setGoodBags(String(parsed.goodBags))
        if (parsed.badBags != null) setBadBags(String(parsed.badBags))
      } catch { /* ignore */ }
    }
  }, [lineId])

  /* ── persist progress ── */
  useEffect(() => {
    if (Object.keys(responses).length > 0 || goodBags || badBags) {
      localStorage.setItem(
        `post-clean-${lineId}`,
        JSON.stringify({
          responses,
          goodBags,
          badBags,
          savedAt: new Date().toISOString()
        })
      )
    }
  }, [responses, goodBags, badBags, lineId])

  /* ── fetch checklist ── */
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchError } = await getChecklist(lineId, 'post_cleaning')
      if (fetchError) throw fetchError
      setItems(data || [])
    } catch (err) {
      console.error('Error fetching checklist:', err)
      setError('Failed to load checklist. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [lineId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  /* ── response helpers ── */
  const setResponse = (itemId, answer) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], answer, notes: prev[itemId]?.notes || '' }
    }))
  }

  const setNotes = (itemId, notes) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], notes }
    }))
  }

  const getAnsweredCount = () =>
    items.filter(item => responses[item.id]?.answer != null).length

  const progressPercent = items.length > 0
    ? Math.round((getAnsweredCount() / items.length) * 100)
    : 0

  const answeredCount = getAnsweredCount()
  const totalItems = items.length

  /* ── validation ── */
  const validate = () => {
    const unanswered = items.filter(item => !responses[item.id]?.answer)
    if (unanswered.length > 0) {
      return `${unanswered.length} item(s) still need a response.`
    }
    // Notes required for "not_acceptable" responses
    const noNotes = items.filter(item => {
      const r = responses[item.id]
      return r?.answer === 'not_acceptable' && !r?.notes?.trim()
    })
    if (noNotes.length > 0) {
      return 'Please add details for all "Not Acceptable" items.'
    }
    return null
  }

  /* ── submit ── */
  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')

    const responseRecords = items.map(item => ({
      checklist_item_id: item.id,
      line_id: lineId,
      phase: 'post_cleaning',
      answer: responses[item.id].answer,
      notes: responses[item.id].notes || null,
      good_bags: goodBags ? parseInt(goodBags, 10) : null,
      bad_bags: badBags ? parseInt(badBags, 10) : null,
      created_at: new Date().toISOString()
    }))

    try {
      const { error: submitError } = await insertPostCleanLog(responseRecords)
      if (submitError) throw submitError

      // clear saved progress
      localStorage.removeItem(`post-clean-${lineId}`)

      // update state machine
      localStorage.setItem(`line-state-${lineId}`, JSON.stringify('post_done'))

      navigate(`/control/${lineId}`)
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to submit checklist. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── photo handling for damage modal ── */
  const handlePhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setDamageError('')
      const url = await uploadPhoto(file)
      setDamagePhotoUrl(url)
    } catch (err) {
      console.error('Photo upload error:', err)
      setDamageError('Failed to upload photo.')
    }
  }

  /* ── damage report submission ── */
  const handleDamageSubmit = async () => {
    setDamageError('')

    if (!damageDescription.trim()) {
      setDamageError('Please enter a description.')
      return
    }

    setDamageSubmitting(true)

    try {
      const report = {
        line_id: lineId,
        description: damageDescription.trim(),
        severity: damageSeverity,
        photo_url: damagePhotoUrl || null,
        status: 'open',
        created_at: new Date().toISOString()
      }

      const { error: reportError } = await insertDamageReport(report)
      if (reportError) throw reportError

      // Reset modal state
      setDamageDescription('')
      setDamageSeverity('medium')
      setDamagePhotoUrl('')
      setDamageError('')
      setShowDamageModal(false)
    } catch (err) {
      console.error('Damage report error:', err)
      setDamageError(err.message || 'Failed to submit damage report.')
    } finally {
      setDamageSubmitting(false)
    }
  }

  const closeDamageModal = () => {
    setShowDamageModal(false)
    setDamageDescription('')
    setDamageSeverity('medium')
    setDamagePhotoUrl('')
    setDamageError('')
  }

  /* ── loading state ── */
  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading checklist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* ── Top ── */}
      <div className="chk-top">
        <button className="back-btn" onClick={() => navigate(`/control/${lineId}`)}>
          &#8592; Back
        </button>
        <h1>Post-Clean Checklist</h1>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="toast toast-error mb-3">
          {error}
        </div>
      )}

      {/* ── Progress Bar ── */}
      <div className="pbar">
        <div className="pfill" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="ptxt">{answeredCount} of {totalItems}</div>

      {/* ── Bag Counts ── */}
      <div className="counts">
        <div>
          <label htmlFor="good-bags">Good Bags</label>
          <input
            id="good-bags"
            type="number"
            min="0"
            value={goodBags}
            onChange={e => setGoodBags(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="bad-bags">Bad Bags</label>
          <input
            id="bad-bags"
            type="number"
            min="0"
            value={badBags}
            onChange={e => setBadBags(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* ── Damage Report Button ── */}
      <button className="btn dmg-btn" onClick={() => setShowDamageModal(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Report Damage
      </button>

      {/* ── Checklist Items ── */}
      {items.map(item => {
        const response = responses[item.id]
        const answer = response?.answer
        const showNotes = answer === 'not_acceptable'

        return (
          <div key={item.id} className="glass">
            <div className="chk-title">{item.title}</div>
            {item.description && (
              <div className="chk-desc">{item.description}</div>
            )}
            {item.step_number && (
              <div className="chk-desc">Step {item.step_number}</div>
            )}

            <div className="opt-row">
              <button
                className={`opt${answer === 'acceptable' ? ' selected' : ''}`}
                onClick={() => setResponse(item.id, 'acceptable')}
              >
                &#10003; Acceptable
              </button>
              <button
                className={`opt-r${answer === 'not_acceptable' ? ' selected' : ''}`}
                onClick={() => setResponse(item.id, 'not_acceptable')}
              >
                &#10007; Not Acceptable
              </button>
              <button
                className={`opt-y${answer === 'na' ? ' selected' : ''}`}
                onClick={() => setResponse(item.id, 'na')}
              >
                &#8212; N/A
              </button>
            </div>

            {showNotes && (
              <textarea
                className="notes"
                placeholder="Please describe the issue..."
                value={response?.notes || ''}
                onChange={e => setNotes(item.id, e.target.value)}
              />
            )}
          </div>
        )
      })}

      {/* ── Empty State ── */}
      {items.length === 0 && !error && (
        <div className="glass text-center" style={{ padding: '48px 24px' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No checklist items found for this line.</p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="btn-nav">
        <button
          className="btn btn-o"
          onClick={() => navigate(`/control/${lineId}`)}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          className="btn btn-g"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', display: 'inline-block', marginRight: '8px' }} />
              Submitting...
            </>
          ) : 'Submit'}
        </button>
      </div>

      {/* ═══════════════════════════════════════════
          Damage Report Modal
          ═══════════════════════════════════════════ */}
      {showDamageModal && (
        <div className="m-overlay" onClick={closeDamageModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Report Damage</h3>

            {damageError && (
              <div className="toast toast-error mb-3" style={{ marginTop: '12px' }}>
                {damageError}
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label htmlFor="dmg-desc">Description</label>
              <textarea
                id="dmg-desc"
                className="form-textarea"
                rows="3"
                placeholder="Describe the damage..."
                value={damageDescription}
                onChange={e => setDamageDescription(e.target.value)}
              />
            </div>

            {/* Severity */}
            <div className="form-group">
              <label htmlFor="dmg-severity">Severity</label>
              <select
                id="dmg-severity"
                className="form-select"
                value={damageSeverity}
                onChange={e => setDamageSeverity(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div className="form-group">
              <label>Photo</label>
              <label className="p-upload">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhoto}
                  style={{ display: 'none' }}
                />
                <div className="p-drop">
                  {damagePhotoUrl ? (
                    <img src={damagePhotoUrl} alt="Damage" />
                  ) : (
                    <span>&#128247; Tap to take photo</span>
                  )}
                </div>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="m-actions">
              <button className="btn btn-o" onClick={closeDamageModal} disabled={damageSubmitting}>
                Cancel
              </button>
              <button className="btn btn-d" onClick={handleDamageSubmit} disabled={damageSubmitting}>
                {damageSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', display: 'inline-block', marginRight: '8px' }} />
                    Submitting...
                  </>
                ) : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
