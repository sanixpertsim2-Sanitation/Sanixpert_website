import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLines, getDashboardStats } from '../lib/supabase.js'

/**
 * DashboardPage.jsx
 * -----------------
 * Overview dashboard showing summary stats across all production lines
 * and a per-area status table. No login required.
 */
export default function DashboardPage() {
  const navigate = useNavigate()

  const [lines, setLines] = useState([])
  const [lineStats, setLineStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ── Fetch all dashboard data ──
  const fetchAllDashboardData = useCallback(async () => {
    try {
      setError('')

      // Fetch all production lines
      const { data: linesData, error: linesError } = await getLines()
      if (linesError) throw linesError

      const linesArr = linesData || []
      setLines(linesArr)

      // Fetch stats for each line
      const statsMap = {}
      for (const line of linesArr) {
        try {
          const stats = await getDashboardStats(line.id)
          statsMap[line.id] = stats
        } catch {
          statsMap[line.id] = { areas: [], assignments: [], damageReports: [], findings: [] }
        }
      }
      setLineStats(statsMap)

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const init = async () => {
      await fetchAllDashboardData()
      if (mounted) setLoading(false)
    }
    init()
    return () => { mounted = false }
  }, [fetchAllDashboardData])

  // ── Compute summary stats ──
  const computeStats = () => {
    const totalLines = lines.length

    let preCleaned = 0
    let postCleaned = 0
    let openDamages = 0
    let openHandovers = 0
    let released = 0

    Object.values(lineStats).forEach((stats) => {
      const areas = stats.areas || []
      preCleaned += areas.filter((a) => a.status === 'pre_done').length
      postCleaned += areas.filter((a) => a.status === 'post_done').length
      released += areas.filter((a) => a.status === 'released').length

      const damages = stats.damageReports || []
      openDamages += damages.filter((d) => d.status === 'open').length

      const assignments = stats.assignments || []
      openHandovers += assignments.filter((a) => a.status === 'open').length
    })

    return { totalLines, preCleaned, postCleaned, openDamages, openHandovers, released }
  }

  const stats = computeStats()

  // ── Status badge helper ──
  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'released') return 'b-rel'
    if (s === 'blocked') return 'b-blk'
    if (s === 'pre_done') return 'b-pc'
    if (s === 'cleaning' || s === 'in_progress') return 'b-cip'
    return 'b-idle'
  }

  const getStatusLabel = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'released') return 'Released'
    if (s === 'blocked') return 'Blocked'
    if (s === 'pre_done') return 'Pre-Cleaned'
    if (s === 'cleaning' || s === 'in_progress') return 'CIP'
    return 'Idle'
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="dash-page page">
        <div className="bn bn-dang">{error}</div>
        <button className="btn btn-p mt-3" onClick={fetchAllDashboardData}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="dash-page page">
      <h1>Dashboard</h1>

      <button className="back-btn" onClick={() => navigate('/control')}>
        ← Back
      </button>

      {/* Stats grid */}
      <div className="stat-grid">
        <div className="stat-c">
          <div className="stat-val">{stats.totalLines}</div>
          <div className="stat-lbl">Total Lines</div>
        </div>
        <div className="stat-c">
          <div className="stat-val">{stats.preCleaned}</div>
          <div className="stat-lbl">Pre-Cleaned</div>
        </div>
        <div className="stat-c">
          <div className="stat-val">{stats.postCleaned}</div>
          <div className="stat-lbl">Post-Cleaned</div>
        </div>
        <div className="stat-c">
          <div className="stat-val">{stats.openDamages}</div>
          <div className="stat-lbl">Open Damages</div>
        </div>
        <div className="stat-c">
          <div className="stat-val">{stats.openHandovers}</div>
          <div className="stat-lbl">Open Handovers</div>
        </div>
        <div className="stat-c">
          <div className="stat-val">{stats.released}</div>
          <div className="stat-lbl">Released</div>
        </div>
      </div>

      {/* Area status table */}
      <div className="table-g">
        {lines.map((line) => {
          const statsForLine = lineStats[line.id] || {}
          const areas = statsForLine.areas || []

          return areas.map((area) => (
            <div key={`${line.id}-${area.id}`} className="ls-row">
              <span className="line-name">{line.name} — {area.name}</span>
              <span className={`badge ${getStatusBadgeClass(area.status)}`}>
                {getStatusLabel(area.status)}
              </span>
            </div>
          ))
        })}

        {lines.length === 0 && (
          <div className="ls-row text-center text-muted">
            No production lines configured.
          </div>
        )}
      </div>
    </div>
  )
}
