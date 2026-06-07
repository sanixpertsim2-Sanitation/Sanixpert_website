import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, CheckCircle, ShieldAlert, Wrench, ClipboardList } from 'lucide-react'
import {
  getHandoverTasks, updateHandoverTask,
  getDamageReports, updateDamageReport, insertHandoverTask,
} from '../lib/supabase.js'

/**
 * HandoverPage — Resolve open tasks and damages before verification
 * Route: /line/:lineId/handover
 */
export default function HandoverPage() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [damages, setDamages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Completion form state per task
  const [completeBy, setCompleteBy] = useState({})
  const [completeNotes, setCompleteNotes] = useState({})

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
        if (!cancelled) setError(err.message || 'Failed to load handover data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [lineId])

  // ═══════════════════════════════════════════
  //  Task completion
  // ═══════════════════════════════════════════
  const handleCompleteTask = async (taskId) => {
    setError('')
    setSuccess('')

    const completedBy = completeBy[taskId]?.trim()
    if (!completedBy) {
      setError('Please enter your name to mark this task complete.')
      return
    }

    try {
      const { error: updError } = await updateHandoverTask(taskId, {
        status: 'completed',
        completed_by: completedBy,
        completion_notes: completeNotes[taskId]?.trim() || null,
      })
      if (updError) throw updError

      setSuccess('Task marked as completed.')
      // Refresh
      const { data } = await getHandoverTasks(lineId)
      setTasks(data || [])
      setCompleteBy(prev => ({ ...prev, [taskId]: '' }))
      setCompleteNotes(prev => ({ ...prev, [taskId]: '' }))
    } catch (err) {
      setError('Failed to complete task: ' + err.message)
    }
  }

  // ═══════════════════════════════════════════
  //  Damage actions
  // ═══════════════════════════════════════════
  const handleMarkRepaired = async (damageId) => {
    setError('')
    setSuccess('')

    try {
      const { error: updError } = await updateDamageReport(damageId, { status: 'completed' })
      if (updError) throw updError

      setSuccess('Damage marked as repaired.')
      const { data } = await getDamageReports(lineId)
      setDamages(data || [])
    } catch (err) {
      setError('Failed to mark repaired: ' + err.message)
    }
  }

  const handleCreateHandover = async (damage) => {
    setError('')
    setSuccess('')

    try {
      const { error: insError } = await insertHandoverTask({
        line_id: lineId,
        area_id: damage.area_id,
        source: 'damage_report',
        source_id: damage.id,
        title: `Follow-up for damage: ${damage.description?.substring(0, 60) || 'Unknown'}`,
        description: damage.description,
        status: 'open',
        created_at: new Date().toISOString(),
      })
      if (insError) throw insError

      setSuccess('Handover task created from damage report.')
      const { data } = await getHandoverTasks(lineId)
      setTasks(data || [])
    } catch (err) {
      setError('Failed to create handover task: ' + err.message)
    }
  }

  // ═══════════════════════════════════════════
  //  Derived state
  // ═══════════════════════════════════════════
  const openTasks = tasks.filter(t => t.status !== 'completed')
  const openDamages = damages.filter(d => d.status !== 'completed' && d.status !== 'resolved')
  const allClear = openTasks.length === 0 && openDamages.length === 0

  // ═══════════════════════════════════════════
  //  Render: Loading
  // ═══════════════════════════════════════════
  if (loading) {
    return (
      <div className="ho-page page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading handover data...</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  //  Render: Main
  // ═══════════════════════════════════════════
  return (
    <div className="ho-page page">
      {/* ── Header ── */}
      <button className="back-btn" onClick={() => navigate('/control')}>
        <ChevronLeft size={18} /> Back
      </button>
      <h1>HANDOVER</h1>
      <p className="sub">Resolve open tasks and damages</p>

      {/* ── Status Banner ── */}
      <div className={`bn ${allClear ? 'bn-ok' : 'bn-warn'}`}>
        {allClear ? (
          <><CheckCircle size={16} /> All clear — no open tasks or damages</>
        ) : (
          <><AlertTriangle size={16} /> {openTasks.length} open task{openTasks.length !== 1 ? 's' : ''}, {openDamages.length} open damage{openDamages.length !== 1 ? 's' : ''}</>
        )}
      </div>

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

      {/* ── Open Tasks ── */}
      {openTasks.length > 0 && (
        <section className="mb-4">
          <h2 className="flex items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
            <ClipboardList size={18} />
            Open Tasks ({openTasks.length})
          </h2>
          {openTasks.map(task => (
            <div key={task.id} className="glass">
              <div className="flex items-center gap-2 mb-2">
                <span className={`task-src ${task.source === 'pre_clean' ? 'src-pc' : task.source === 'damage_report' ? 'src-dr' : 'src-ai'}`}>
                  {task.source === 'pre_clean' ? 'PRE-CLEAN' : task.source === 'damage_report' ? 'DAMAGE' : 'AI'}
                </span>
                <span className="task-title">{task.title || 'Untitled Task'}</span>
              </div>
              {task.description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: '0 0 12px' }}>
                  {task.description}
                </p>
              )}
              <div className="comp-form">
                <label className="emp-in">
                  <span>Your Name *</span>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={completeBy[task.id] || ''}
                    onChange={e => setCompleteBy(prev => ({ ...prev, [task.id]: e.target.value }))}
                  />
                </label>
                <label className="emp-in">
                  <span>Completion Notes</span>
                  <input
                    type="text"
                    placeholder="Optional notes..."
                    value={completeNotes[task.id] || ''}
                    onChange={e => setCompleteNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                  />
                </label>
                <button className="btn btn-g" onClick={() => handleCompleteTask(task.id)}>
                  <CheckCircle size={16} /> Mark Complete
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── Open Damages ── */}
      {openDamages.length > 0 && (
        <section className="mb-4">
          <h2 className="flex items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
            <ShieldAlert size={18} />
            Open Damages ({openDamages.length})
          </h2>
          {openDamages.map(damage => (
            <div key={damage.id} className="glass dmg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="task-src src-dr">DAMAGE</span>
                <span className="task-title">{damage.description?.substring(0, 60) || 'Untitled'}</span>
              </div>
              {damage.severity && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
                  Severity: <strong>{damage.severity}</strong>
                </p>
              )}
              {damage.photo_url && (
                <img
                  src={damage.photo_url}
                  alt="Damage"
                  style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}
                />
              )}
              <div className="dmg-actions">
                <button className="btn btn-g" onClick={() => handleMarkRepaired(damage.id)}>
                  <Wrench size={16} /> Mark Repaired
                </button>
                <button className="btn btn-w" onClick={() => handleCreateHandover(damage)}>
                  <ClipboardList size={16} /> Create Handover
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── All Complete Message ── */}
      {allClear && (
        <div className="glass text-center" style={{ padding: '32px 16px' }}>
          <CheckCircle size={40} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
          <p style={{ fontWeight: 600, margin: '0 0 4px' }}>Everything is resolved!</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
            All tasks and damages are cleared. Ready for verification.
          </p>
          <button className="btn btn-g mt-3" onClick={() => navigate(`/line/${lineId}/verify`)}>
            Proceed to Verification
          </button>
        </div>
      )}
    </div>
  )
}
