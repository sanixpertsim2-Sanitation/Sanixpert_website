import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  supabase,
  getAreas,
  getAssignments,
  createAssignment,
  getCurrentUser,
  getProfile,
  subscribeToLine,
  logActivity
} from '@/lib/supabase.js'
import { detectShift, getShiftLabel } from '@/utils/shiftDetection.js'
import { ArrowLeft, Lock, AlertTriangle, Play, CheckCircle, RotateCcw } from 'lucide-react'

/**
 * AreaSelection.jsx
 * -----------------
 * Route: /line/:lineId/areas
 *
 * Displays areas for a selected production line, grouped by status.
 * Implements area locking — when an employee starts pre-cleaning,
 * the area locks to them. Other employees can only report damage.
 *
 * BUSINESS LOGIC:
 * - Areas grouped by status: RAW, CLEANING, RTE, OTHER
 * - Click "Start Pre-Cleaning" → create assignment → area locks to you
 * - Locked by another → show "🔒 By [Name]" + only "Report Damage"
 * - Locked by you → show "Continue" button
 * - Completed → show "✓ Done" badge
 * - Two phases: pre-cleaning and post-cleaning (each has its own checklist)
 */
export default function AreaSelection() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const [areas, setAreas] = useState([])
  const [assignments, setAssignments] = useState([])
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState({})

  const currentShift = detectShift()
  const shiftLabel = getShiftLabel(currentShift)
  const today = new Date().toISOString().split('T')[0]

  /**
   * Fetch current user and profile
   */
  useEffect(() => {
    let mounted = true
    getCurrentUser().then((u) => {
      if (!mounted) return
      setUser(u)
      if (u?.id) {
        getProfile(u.id).then(setProfile).catch(() => {})
      }
    })
    return () => { mounted = false }
  }, [])

  /**
   * Fetch areas and assignments for this line
   */
  const fetchData = useCallback(async () => {
    if (!lineId) return
    setError('')
    try {
      // Fetch areas for this line
      const { data: areasData, error: areasError } = await getAreas(lineId)
      if (areasError) throw areasError
      setAreas(areasData || [])

      // Fetch today's assignments for this line + current shift
      const { data: assignmentsData, error: assignmentsError } = await getAssignments(lineId, currentShift)
      if (assignmentsError) throw assignmentsError
      // Filter to today's assignments only
      const todayAssignments = (assignmentsData || []).filter(
        (a) => a.date === today || a.date?.startsWith(today)
      )
      setAssignments(todayAssignments)
    } catch (err) {
      console.error('Error fetching area data:', err)
      setError('Failed to load areas. Please try again.')
    }
  }, [lineId, currentShift, today])

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
   * Real-time subscription for this line
   */
  useEffect(() => {
    if (!lineId) return

    const channel = subscribeToLine(lineId, (payload) => {
      console.log('AreaSelection realtime update:', payload)
      fetchData()
    })

    return () => { channel?.unsubscribe() }
  }, [lineId, fetchData])

  /**
   * Start pre-cleaning: create assignment → lock area
   */
  const handleStartPreCleaning = async (areaId) => {
    if (!user?.id) {
      setError('You must be signed in to start cleaning.')
      return
    }

    setActionLoading((prev) => ({ ...prev, [areaId]: true }))
    setError('')

    try {
      const { error: createError } = await createAssignment({
        line_id: lineId,
        area_id: areaId,
        user_id: user.id,
        phase: 'pre-cleaning',
        shift: currentShift,
        date: today,
        status: 'in_progress'
      })

      if (createError) throw createError

      // Log activity
      await logActivity({
        line_id: lineId,
        area_id: areaId,
        user_id: user.id,
        action: 'started_pre_cleaning',
        details: { shift: currentShift },
        created_at: new Date().toISOString()
      }).catch(() => {}) // non-critical

      // Navigate to pre-cleaning checklist
      navigate(`/line/${lineId}/area/${areaId}/checklist/pre-cleaning`)
    } catch (err) {
      console.error('Error starting pre-cleaning:', err)
      setError(err.message || 'Failed to start pre-cleaning. Please try again.')
    } finally {
      setActionLoading((prev) => ({ ...prev, [areaId]: false }))
    }
  }

  /**
   * Continue an existing assignment
   */
  const handleContinue = (areaId, phase) => {
    const phaseRoute = phase === 'post-cleaning' ? 'post-cleaning' : 'pre-cleaning'
    navigate(`/line/${lineId}/area/${areaId}/checklist/${phaseRoute}`)
  }

  /**
   * Navigate to damage report page
   */
  const handleReportDamage = (areaId) => {
    navigate(`/line/${lineId}/damage-report`, { state: { areaId } })
  }

  /**
   * Get assignment for a given area (today's shift only)
   */
  const getAreaAssignment = (areaId) => {
    return assignments.find((a) => a.area_id === areaId)
  }

  /**
   * Get lock status for an area
   */
  const getLockStatus = (areaId) => {
    const assignment = getAreaAssignment(areaId)
    if (!assignment) return { locked: false, byMe: false, byName: null, completed: false }

    const byMe = assignment.user_id === user?.id
    const completed = assignment.status === 'completed'

    return {
      locked: true,
      byMe,
      byName: assignment.profiles?.full_name || 'Another employee',
      completed,
      phase: assignment.phase,
      assignmentId: assignment.id
    }
  }

  /**
   * Group areas by their status
   */
  const groupAreasByStatus = () => {
    const groups = {
      raw: [],      // Ready to clean
      cleaning: [], // In progress
      rte: [],      // Ready to examine
      other: []     // Not started / idle
    }

    areas.forEach((area) => {
      const status = (area.status || 'other').toLowerCase()
      if (groups[status]) {
        groups[status].push(area)
      } else {
        groups.other.push(area)
      }
    })

    return groups
  }

  /**
   * Status badge class helper
   */
  const getBadgeClass = (status) => {
    const s = (status || 'other').toLowerCase()
    if (s === 'raw') return 'badge-raw'
    if (s === 'rte') return 'badge-rte'
    if (s === 'cleaning') return 'badge-cleaning'
    return 'badge-other'
  }

  const getBadgeLabel = (status) => {
    const s = (status || 'other').toLowerCase()
    if (s === 'raw') return 'Ready to Clean'
    if (s === 'rte') return 'Ready to Examine'
    if (s === 'cleaning') return 'In Progress'
    return 'Not Started'
  }

  const areaGroups = groupAreasByStatus()

  const groupOrder = [
    { key: 'raw', label: 'Ready to Clean', className: 'badge-raw' },
    { key: 'cleaning', label: 'In Progress', className: 'badge-cleaning' },
    { key: 'rte', label: 'Ready to Examine', className: 'badge-rte' },
    { key: 'other', label: 'Not Started', className: 'badge-other' }
  ]

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="page">
        <div style={{ height: '20px', width: '50%', background: '#e0e0e0', borderRadius: '8px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '16px', width: '30%', background: '#e0e0e0', borderRadius: '8px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ height: '100px', marginBottom: '12px', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="page">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="navbar-btn mb-2"
        style={{ padding: '8px 0', display: 'inline-flex' }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Back to Lines</span>
      </button>

      {/* Header */}
      <h1 className="page-title">Select Area</h1>
      <p className="page-subtitle">
        Line {lineId?.toUpperCase?.()} — Choose an area to begin cleaning
      </p>

      {/* Shift info */}
      <div className="card mb-3" style={{ padding: '10px 14px', background: 'var(--color-primary-light)' }}>
        <span className="text-sm text-muted">Current Shift: </span>
        <strong className="text-sm text-primary">{shiftLabel}</strong>
      </div>

      {/* Error */}
      {error && (
        <div className="toast toast-error mb-3 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Empty state */}
      {areas.length === 0 ? (
        <div className="card text-center" style={{ padding: '48px 24px' }}>
          <CheckCircle size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
          <h3 className="card-title">No Areas Found</h3>
          <p className="card-desc">This production line has no areas configured yet.</p>
        </div>
      ) : (
        /* Grouped areas */
        groupOrder.map((group) => {
          const groupAreas = areaGroups[group.key]
          if (groupAreas.length === 0) return null

          return (
            <div key={group.key} className="mb-4">
              {/* Group header */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${group.className}`}>{group.label}</span>
                <span className="text-sm text-muted">({groupAreas.length})</span>
              </div>

              {/* Area cards */}
              <div className="area-list">
                {groupAreas.map((area) => {
                  const lockStatus = getLockStatus(area.id)
                  const isLoading = actionLoading[area.id]

                  return (
                    <div key={area.id} className="area-card card">
                      {/* Area info row */}
                      <div className="area-info">
                        <div>
                          <h3 className="area-name">{area.name}</h3>
                          {area.description && (
                            <p className="card-desc" style={{ margin: '2px 0 0' }}>{area.description}</p>
                          )}
                        </div>
                        <span className={`badge ${getBadgeClass(area.status)}`}>
                          {getBadgeLabel(area.status)}
                        </span>
                      </div>

                      {/* Locked indicator */}
                      {lockStatus.locked && !lockStatus.byMe && !lockStatus.completed && (
                        <div className="locked-area">
                          <Lock size={18} />
                          <span>
                            <strong>Locked by {lockStatus.byName}</strong> — {lockStatus.phase === 'pre-cleaning' ? 'Pre-cleaning' : 'Post-cleaning'} in progress
                          </span>
                        </div>
                      )}

                      {/* My assignment indicator */}
                      {lockStatus.byMe && !lockStatus.completed && (
                        <div
                          className="flex items-center gap-2"
                          style={{
                            padding: '8px 12px',
                            background: 'var(--color-primary-light)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--color-primary)'
                          }}
                        >
                          <Play size={14} />
                          <strong>Your assignment</strong> — {lockStatus.phase === 'pre-cleaning' ? 'Pre-cleaning' : 'Post-cleaning'}
                        </div>
                      )}

                      {/* Completed indicator */}
                      {lockStatus.completed && (
                        <div
                          className="flex items-center gap-2"
                          style={{
                            padding: '8px 12px',
                            background: '#d4edda',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--color-success)'
                          }}
                        >
                          <CheckCircle size={14} />
                          <strong>Completed</strong> — All phases done
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="area-actions">
                        {lockStatus.completed ? (
                          /* Completed — show restart option */
                          <button
                            onClick={() => handleStartPreCleaning(area.id)}
                            className="btn btn-outline flex items-center justify-center gap-1"
                            disabled={isLoading}
                          >
                            <RotateCcw size={14} />
                            Restart
                          </button>
                        ) : lockStatus.byMe ? (
                          /* My assignment — continue button */
                          <button
                            onClick={() => handleContinue(area.id, lockStatus.phase)}
                            className="btn btn-primary flex items-center justify-center gap-1"
                            disabled={isLoading}
                          >
                            <Play size={14} />
                            {isLoading ? 'Loading...' : 'Continue'}
                          </button>
                        ) : lockStatus.locked ? (
                          /* Locked by another — only report damage */
                          <button
                            onClick={() => handleReportDamage(area.id)}
                            className="btn btn-danger flex items-center justify-center gap-1"
                          >
                            <AlertTriangle size={14} />
                            Report Damage
                          </button>
                        ) : (
                          /* Available — start pre-cleaning */
                          <>
                            <button
                              onClick={() => handleStartPreCleaning(area.id)}
                              className="btn btn-primary flex items-center justify-center gap-1"
                              disabled={isLoading}
                            >
                              <Play size={14} />
                              {isLoading ? 'Starting...' : 'Start Pre-Cleaning'}
                            </button>
                            <button
                              onClick={() => handleReportDamage(area.id)}
                              className="btn btn-outline flex items-center justify-center gap-1"
                              style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                            >
                              <AlertTriangle size={14} />
                              Report Damage
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
