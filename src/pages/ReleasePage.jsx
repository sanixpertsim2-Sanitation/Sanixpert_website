import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, CheckCircle, Lock, Unlock, Send } from 'lucide-react'
import {
  getHandoverTasks, getDamageReports, insertReleaseLog,
} from '../lib/supabase.js'

/**
 * ReleasePage — Final approval to release a production line
 * Route: /line/:lineId/release
 */
export default function ReleasePage() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [damages, setDamages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [releaserName, setReleaserName] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ═══════════════════════════════════════════
  //  Fetch data
  // ═══════════════════════════════════════════
  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [tasksRes, damagesRes] = await Promise.all([
          getHandoverTasks(lineId),
          getDamageReports(lineId),
        ])

        if (!cancelled) {
          setTasks(tasksRes.data || [])
          setDamages(damagesRes.data || [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load release data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [lineId])

  // ═══════════════════════════════════════════
  //  Derived state (guards)
  // ═══════════════════════════════════════════
  const openTasks = tasks.filter(t => t.status !== 'completed')
  const openDamages = damages.filter(d => d.status !== 'completed' && d.status !== 'resolved')
  const blockers = [
    ...openTasks.map(t => ({ type: 'task', id: t.id, label: t.title || `Task #${t.id}` })),
    ...openDamages.map(d => ({ type: 'damage', id: d.id, label: d.description?.substring(0, 60) || `Damage #${d.id}` })),
  ]
  const isBlocked = blockers.length > 0

  // ═══════════════════════════════════════════
  //  Submit release
  // ═══════════════════════════════════════════
  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    const name = releaserName.trim()
    if (!name) {
      setError('Please enter your name.')
      return
    }

    if (isBlocked) {
      setError('Cannot release: unresolved blockers remain.')
      return
    }

    setSubmitting(true)

    try {
      const { error: insError } = await insertReleaseLog({
        line_id: lineId,
        released_by: name,
        notes: notes.trim() || null,
        created_at: new Date().toISOString(),
      })
      if (insError) throw insError

      setSuccess('Line released successfully!')
      setTimeout(() => navigate('/control'), 1500)
    } catch (err) {
      setError('Release failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ═══════════════════════════════════════════
  //  Render: Loading
  // ═══════════════════════════════════════════
  if (loading) {
    return (
      <div className="rel-page page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading release data...</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  //  Render: Main
  // ═══════════════════════════════════════════
  return (
    <div className="rel-page page">
      {/* ── Header ── */}
      <button className="back-btn" onClick={() => navigate('/control')}>
        <ChevronLeft size={18} /> Back
      </button>
      <h1>LINE RELEASE</h1>
      <p className="sub">Final approval to release line</p>

      {/* ── Messages ── */}
      {success && (
        <div className="toast toast-success flex items-center gap-2 mb-3">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="toast toast-error flex items-center gap-2 mb-3">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* ── BLOCKED STATE ── */}
      {isBlocked && (
        <div className="rel-blocked">
          <div className="glass" style={{ borderLeft: '4px solid #e74c3c', textAlign: 'center', padding: '32px 16px' }}>
            <Lock size={40} style={{ color: '#e74c3c', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px' }}>Release Blocked</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: '0 0 20px' }}>
              Resolve all blockers before releasing this line.
            </p>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '16px 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: '#e74c3c' }} />
            Blockers ({blockers.length})
          </h3>

          {blockers.map((blocker, idx) => (
            <div key={`${blocker.type}-${blocker.id}-${idx}`} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                className="task-src"
                style={{
                  background: blocker.type === 'task' ? '#fff3cd' : '#fdecea',
                  color: blocker.type === 'task' ? '#856404' : '#e74c3c',
                }}
              >
                {blocker.type === 'task' ? 'TASK' : 'DAMAGE'}
              </span>
              <span style={{ fontSize: '0.9rem' }}>{blocker.label}</span>
            </div>
          ))}

          <button className="btn btn-w mt-3" onClick={() => navigate(`/line/${lineId}/handover`)}>
            Go to Handover
          </button>
        </div>
      )}

      {/* ── CLEAR STATE ── */}
      {!isBlocked && (
        <div className="rel-clear">
          <div className="glass" style={{ textAlign: 'center', padding: '24px 16px', marginBottom: '16px' }}>
            <Unlock size={40} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px' }}>Line Ready for Release</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
              All blockers cleared. Enter your details to release.
            </p>
          </div>

          <div className="rel-form">
            <label className="emp-in">
              <span>Releaser Name *</span>
              <input
                type="text"
                placeholder="Enter your full name..."
                value={releaserName}
                onChange={e => setReleaserName(e.target.value)}
              />
            </label>

            <label className="emp-in">
              <span>Release Notes (optional)</span>
              <textarea
                rows={3}
                placeholder="Any additional notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </label>

            <button
              className="btn btn-g rel-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <><Send size={16} /> RELEASE LINE</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
