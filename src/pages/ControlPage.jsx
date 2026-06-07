import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLines } from '../lib/supabase.js'

const CIRCUMFERENCE = 408

const STATE_ORDER = ['idle', 'pre_done', 'post_done', 'handover_open', 'verified', 'released']

const BADGE_MAP = {
  idle:          { cls: 'b-idle', label: 'Idle' },
  pre_done:      { cls: 'b-pc',   label: 'Pre-Clean Done' },
  post_done:     { cls: 'b-cip',  label: 'Post-Clean Done' },
  handover_open: { cls: 'b-blk',  label: 'Handover Open' },
  verified:      { cls: 'b-blk',  label: 'Verified' },
  released:      { cls: 'b-rel',  label: 'Released' },
}

function detectShift() {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  if (day === 0) return 'Sunday'
  if (hour >= 19 || hour < 7) return 'Night'
  if (hour >= 11 && hour < 19) return 'Afternoon'
  return 'Morning'
}

export default function ControlPage() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const [lineName, setLineName] = useState('MACY')
  const [state, setState] = useState('idle')
  const [loading, setLoading] = useState(true)

  /* ── load persisted state ── */
  useEffect(() => {
    const saved = localStorage.getItem(`line-state-${lineId}`)
    if (saved) {
      try { setState(JSON.parse(saved)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [lineId])

  /* ── persist state changes ── */
  useEffect(() => {
    localStorage.setItem(`line-state-${lineId}`, JSON.stringify(state))
  }, [state, lineId])

  /* ── fetch line info ── */
  useEffect(() => {
    let cancelled = false
    const fetchLine = async () => {
      try {
        const { data, error } = await getLines()
        if (error) throw error
        const line = (data || []).find(l => l.id === lineId || l.id === Number(lineId))
        if (line && !cancelled) setLineName(line.name || 'MACY')
      } catch (err) {
        console.error('Error fetching lines:', err)
      }
    }
    fetchLine()
    return () => { cancelled = true }
  }, [lineId])

  /* ── progress percent ── */
  const progressPercent = useMemo(() => {
    const idx = STATE_ORDER.indexOf(state)
    return Math.round((idx / (STATE_ORDER.length - 1)) * 100)
  }, [state])

  const dashOffset = CIRCUMFERENCE - (progressPercent / 100) * CIRCUMFERENCE

  /* ── prerequisite checks ── */
  const canPreClean   = true
  const canPostClean  = STATE_ORDER.indexOf(state) >= STATE_ORDER.indexOf('pre_done')
  const canHandover   = STATE_ORDER.indexOf(state) >= STATE_ORDER.indexOf('post_done')
  const canVerify     = STATE_ORDER.indexOf(state) >= STATE_ORDER.indexOf('handover_open')
  const canRelease    = STATE_ORDER.indexOf(state) >= STATE_ORDER.indexOf('verified')
  const isReleased    = state === 'released'

  /* ── derived badge ── */
  const badge = BADGE_MAP[state] || BADGE_MAP.idle

  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading Control Hub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* ── Top Section ── */}
      <div className="ctrl-top">
        <div className="brand">G&amp;G SANITATION DIGITAL</div>
        <h1>{lineName} CONTROL HUB</h1>
        <div className="shift">{detectShift()} Shift</div>
      </div>

      {/* ── Back Button ── */}
      <button className="back-btn" onClick={() => navigate('/lines')}>
        &#8592; Lines
      </button>

      {/* ── Status Badge ── */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span className={`badge ${badge.cls}`}>{badge.label}</span>
      </div>

      {/* ── Progress Ring ── */}
      <div className="ring-wrap">
        <div className="ring">
          <svg viewBox="0 0 140 140">
            <defs>
              <linearGradient id="ringGrad">
                <stop offset="0%" stopColor="#00d084" />
                <stop offset="100%" stopColor="#00e5a0" />
              </linearGradient>
            </defs>
            <circle className="ring-track" cx="70" cy="70" r="65" />
            <circle
              className="ring-fill"
              cx="70" cy="70" r="65"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="ring-txt">
            <span className="pct">{progressPercent}%</span>
            <span className="lbl">COMPLETE</span>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="ctrl-actions">
        {/* Pre-Clean */}
        <button
          className="act-btn"
          onClick={() => navigate(`/pre-clean/${lineId}`)}
          disabled={!canPreClean || isReleased}
        >
          <div className="act-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div className="act-txt">
            <span className="t">Pre-Clean</span>
            <span className="d">Start sanitation</span>
          </div>
          <span className="act-arr">&#8250;</span>
        </button>

        {/* Post-Clean */}
        <button
          className="act-btn"
          onClick={() => navigate(`/post-clean/${lineId}`)}
          disabled={!canPostClean || isReleased}
        >
          <div className="act-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div className="act-txt">
            <span className="t">Post-Clean</span>
            <span className="d">After production</span>
          </div>
          <span className="act-arr">&#8250;</span>
        </button>

        {/* Handover */}
        <button
          className="act-btn"
          onClick={() => navigate(`/handover/${lineId}`)}
          disabled={!canHandover || isReleased}
        >
          <div className="act-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="act-txt">
            <span className="t">Handover</span>
            <span className="d">Transfer tasks</span>
          </div>
          <span className="act-arr">&#8250;</span>
        </button>

        {/* Area Lead Verify */}
        <button
          className="act-btn"
          onClick={() => navigate(`/verify/${lineId}`)}
          disabled={!canVerify || isReleased}
        >
          <div className="act-icon" style={{ background: '#d1fae5', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c.552 0 1-.448 1-1V8c0-2.761-4.686-5-10-5S2 5.239 2 8v3c0 .552.448 1 1 1"/><path d="M2 12v4c0 2.761 4.686 5 10 5s10-2.239 10-5v-4"/></svg>
          </div>
          <div className="act-txt">
            <span className="t">Area Lead Verify</span>
            <span className="d">Sign-off</span>
          </div>
          <span className="act-arr">&#8250;</span>
        </button>

        {/* Release Line */}
        <button
          className="act-btn"
          onClick={() => navigate(`/release/${lineId}`)}
          disabled={!canRelease || isReleased}
        >
          <div className="act-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div className="act-txt">
            <span className="t">Release Line</span>
            <span className="d">Approve start</span>
          </div>
          <span className="act-arr">&#8250;</span>
        </button>

        {/* Dashboard */}
        <button
          className="act-btn"
          onClick={() => navigate(`/dashboard`)}
        >
          <div className="act-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div className="act-txt">
            <span className="t">Dashboard</span>
            <span className="d">View reports</span>
          </div>
          <span className="act-arr">&#8250;</span>
        </button>
      </div>
    </div>
  )
}
