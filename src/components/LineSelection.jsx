import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, getLines, subscribeToLine, getCurrentUser, getProfile } from '@/lib/supabase.js'
import { detectShift, getShiftLabel } from '@/utils/shiftDetection.js'
import { Factory, RefreshCw, User } from 'lucide-react'

/**
 * LineSelection.jsx
 * -----------------
 * Home page — displays all production lines as clickable cards
 * with live status badges.
 *
 * Features:
 * - Real-time status updates via Supabase Realtime
 * - Loading skeleton while fetching
 * - Refresh button to re-fetch data
 * - Current shift display at top
 * - Empty state when no lines exist
 * - Mobile-first responsive card grid (1 / 2 / 3 columns)
 */
export default function LineSelection() {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const currentShift = detectShift()
  const shiftLabel = getShiftLabel(currentShift)

  /**
   * Fetch current user and their profile
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
   * Fetch production lines from Supabase
   */
  const fetchLines = useCallback(async () => {
    setError('')
    try {
      const { data, error: fetchError } = await getLines()
      if (fetchError) throw fetchError
      setLines(data || [])
    } catch (err) {
      console.error('Error fetching lines:', err)
      setError('Failed to load production lines. Please try again.')
      setLines([])
    }
  }, [])

  /**
   * Initial load
   */
  useEffect(() => {
    let mounted = true
    const load = async () => {
      await fetchLines()
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [fetchLines])

  /**
   * Subscribe to real-time updates for all lines
   */
  useEffect(() => {
    if (lines.length === 0) return

    // Subscribe to changes on each line
    const channels = lines.map((line) =>
      subscribeToLine(line.id, (payload) => {
        console.log('Realtime update:', payload)
        // Refresh data on any change
        fetchLines()
      })
    )

    return () => {
      channels.forEach((channel) => channel?.unsubscribe())
    }
  }, [lines.map((l) => l.id).join(','), fetchLines])

  /**
   * Manual refresh button handler
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchLines()
    setRefreshing(false)
  }

  /**
   * Navigate to area selection for a line
   */
  const handleLineClick = (lineId) => {
    navigate(`/line/${lineId}/areas`)
  }

  /**
   * Get the appropriate badge class for a status value
   */
  const getStatusBadgeClass = (status) => {
    const s = (status || 'other').toLowerCase()
    if (s === 'raw') return 'badge-raw'
    if (s === 'rte' || s === 'ready') return 'badge-rte'
    if (s === 'cleaning') return 'badge-cleaning'
    return 'badge-other'
  }

  /**
   * Get human-readable status label
   */
  const getStatusLabel = (status) => {
    const s = (status || 'other').toLowerCase()
    if (s === 'raw') return 'Ready to Clean'
    if (s === 'rte') return 'Ready to Examine'
    if (s === 'ready') return 'Ready'
    if (s === 'cleaning') return 'Cleaning'
    return 'Idle'
  }

  // ─── Loading Skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <div className="page">
        <div style={{ height: '20px', width: '60%', background: '#e0e0e0', borderRadius: '8px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '16px', width: '40%', background: '#e0e0e0', borderRadius: '8px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
        <div className="card-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ height: '160px', background: '#f0f0f0', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
        <h1 className="page-title">Select Production Line</h1>
        <button
          onClick={handleRefresh}
          className="navbar-btn"
          title="Refresh"
          disabled={refreshing}
          style={{ color: 'var(--color-primary)' }}
        >
          <RefreshCw size={20} className={refreshing ? 'spin' : ''} />
        </button>
      </div>
      <p className="page-subtitle">Choose a line to begin the deep cleaning process</p>

      {/* User bar */}
      {user && (
        <div className="user-bar">
          <span className="flex items-center gap-2">
            <User size={16} />
            Signed in as <strong>{profile?.full_name || user.email}</strong>
          </span>
          <span className="badge badge-rte" style={{ textTransform: 'capitalize' }}>
            {shiftLabel}
          </span>
        </div>
      )}

      {/* Error */}
      {error && <div className="toast toast-error mb-3">{error}</div>}

      {/* Shift info */}
      <div className="card mb-3" style={{ padding: '10px 14px', background: 'var(--color-primary-light)' }}>
        <span className="text-sm text-muted">Current Shift: </span>
        <strong className="text-sm text-primary">{shiftLabel}</strong>
      </div>

      {/* Empty state */}
      {lines.length === 0 ? (
        <div className="card text-center" style={{ padding: '48px 24px' }}>
          <Factory size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
          <h3 className="card-title">No Production Lines</h3>
          <p className="card-desc">No production lines have been set up yet. Contact your administrator.</p>
        </div>
      ) : (
        /* Line cards grid */
        <div className="card-grid">
          {lines.map((line) => (
            <div
              key={line.id}
              className="card card-clickable"
              onClick={() => handleLineClick(line.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLineClick(line.id) }}
            >
              <div className="card-icon">
                <Factory size={32} />
              </div>
              <h3 className="card-title">{line.name}</h3>
              <p className="card-desc">
                {line.facilities?.name || 'Production Facility'}
              </p>
              <span className={`badge ${getStatusBadgeClass(line.status)}`}>
                {getStatusLabel(line.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
