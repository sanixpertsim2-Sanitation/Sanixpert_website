import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChecklist, insertPreCleanLog } from '../lib/supabase.js'

export default function PreCleanPage() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [responses, setResponses] = useState({})
  const [employeeName, setEmployeeName] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  /* ── load saved progress ── */
  useEffect(() => {
    const saved = localStorage.getItem(`pre-clean-${lineId}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.responses) setResponses(parsed.responses)
        if (parsed.employeeName) setEmployeeName(parsed.employeeName)
      } catch { /* ignore */ }
    }
  }, [lineId])

  /* ── persist progress ── */
  useEffect(() => {
    if (Object.keys(responses).length > 0 || employeeName) {
      localStorage.setItem(
        `pre-clean-${lineId}`,
        JSON.stringify({ responses, employeeName, savedAt: new Date().toISOString() })
      )
    }
  }, [responses, employeeName, lineId])

  /* ── fetch checklist ── */
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchError } = await getChecklist(lineId, 'pre_cleaning')
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
    if (!employeeName.trim()) {
      return 'Please enter your name.'
    }
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
      phase: 'pre_cleaning',
      answer: responses[item.id].answer,
      notes: responses[item.id].notes || null,
      employee_name: employeeName.trim(),
      created_at: new Date().toISOString()
    }))

    try {
      const { error: submitError } = await insertPreCleanLog(responseRecords)
      if (submitError) throw submitError

      // clear saved progress
      localStorage.removeItem(`pre-clean-${lineId}`)

      // update state machine
      localStorage.setItem(`line-state-${lineId}`, JSON.stringify('pre_done'))

      navigate(`/control/${lineId}`)
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.message || 'Failed to submit checklist. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
        <h1>Pre-Clean Checklist</h1>
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

      {/* ── Employee Name ── */}
      <div className="emp-in">
        <label htmlFor="emp-name">Employee Name</label>
        <input
          id="emp-name"
          type="text"
          value={employeeName}
          onChange={e => setEmployeeName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

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
    </div>
  )
}
