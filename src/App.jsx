import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase, getCurrentUser } from './lib/supabase.js'
import './App.css'

/* ──────────────────────────────────────────────
   Placeholder pages — will be replaced by
   feature-specific agents later
   ────────────────────────────────────────────── */
function LineSelection() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  return (
    <div className="page">
      <h1 className="page-title">Select Production Line</h1>
      <p className="page-subtitle">Choose a line to begin the deep cleaning process</p>

      {user && (
        <div className="user-bar">
          <span>Signed in as <strong>{user.email}</strong></span>
          <button className="btn btn-outline" onClick={handleLogout}>Sign Out</button>
        </div>
      )}

      <div className="card-grid">
        {['Line 1', 'Line 2', 'Line 3', 'Line 4'].map((line) => (
          <div
            key={line}
            className="card card-clickable"
            onClick={() => navigate(`/line/${line.toLowerCase().replace(' ', '-')}/areas`)}
          >
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 className="card-title">{line}</h3>
            <p className="card-desc">MACY Production Line</p>
            <span className="badge badge-rte">Ready to Examine</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page login-page">
      <div className="login-card card">
        <div className="login-logo">
          <div className="logo-icon">SE</div>
          <h1>SaniExpert</h1>
          <p>Digital Checklist System</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="toast toast-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

function AreaSelection() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  const areas = [
    { id: 'macerator', name: 'Macerator Room', status: 'raw' },
    { id: 'hopper', name: 'Hopper', status: 'cleaning' },
    { id: 'conveyor', name: 'Conveyor System', status: 'rte' },
    { id: 'packing', name: 'Packing Area', status: 'raw' },
    { id: 'dispatch', name: 'Dispatch', status: 'other' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">{lineId?.replace('-', ' ')?.toUpperCase()} — Select Area</h1>
      <p className="page-subtitle">Choose an area to begin cleaning verification</p>

      <div className="area-list">
        {areas.map((area) => (
          <div key={area.id} className="area-card card">
            <div className="area-info">
              <h3 className="area-name">{area.name}</h3>
              <span className={`badge badge-${area.status}`}>
                {area.status === 'raw' && 'Ready to Clean'}
                {area.status === 'cleaning' && 'Being Cleaned'}
                {area.status === 'rte' && 'Ready to Examine'}
                {area.status === 'other' && 'Not Started'}
              </span>
            </div>
            <div className="area-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/line/${lineId}/area/${area.id}/checklist/preclean`)}
              >
                Pre-Clean
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/line/${lineId}/area/${area.id}/checklist/postclean`)}
              >
                Post-Clean
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChecklistForm() {
  const { lineId, areaId, phase } = useParams()
  const navigate = useNavigate()

  const dummyQuestions = [
    { id: 1, text: 'All equipment surfaces cleaned and free of debris?', type: 'yes_no' },
    { id: 2, text: 'Floor drains cleared and sanitized?', type: 'yes_no' },
    { id: 3, text: 'Conveyor belts inspected for residue?', type: 'yes_no' },
    { id: 4, text: 'Photo evidence of cleaned area', type: 'photo' },
    { id: 5, text: 'Additional comments or observations', type: 'text' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">{phase === 'preclean' ? 'Pre-Clean' : 'Post-Clean'} Checklist</h1>
      <p className="page-subtitle">{areaId?.replace('-', ' ')?.toUpperCase()} on {lineId?.replace('-', ' ')?.toUpperCase()}</p>

      <div className="checklist-form">
        {dummyQuestions.map((q) => (
          <div key={q.id} className="checklist-item card">
            <p className="checklist-question">{q.sequence_order}. {q.text}</p>
            {q.type === 'yes_no' && (
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name={`q-${q.id}`} value="yes" /> Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name={`q-${q.id}`} value="no" /> No
                </label>
                <label className="radio-label">
                  <input type="radio" name={`q-${q.id}`} value="na" /> N/A
                </label>
              </div>
            )}
            {q.type === 'photo' && (
              <div className="photo-upload">
                <div className="photo-dropzone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <p>Tap to take photo or upload</p>
                </div>
              </div>
            )}
            {q.type === 'text' && (
              <textarea className="form-textarea" placeholder="Enter any observations..." rows="3" />
            )}
          </div>
        ))}
      </div>

      <div className="page-actions">
        <button className="btn btn-primary btn-full" onClick={() => navigate(`/line/${lineId}/areas`)}>
          Submit Checklist
        </button>
      </div>
    </div>
  )
}

function DamageReport() {
  const { lineId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1 className="page-title">Damage Report</h1>
      <p className="page-subtitle">{lineId?.replace('-', ' ')?.toUpperCase()}</p>

      <div className="damage-banner">
        <strong>Report equipment damage or maintenance issues found during cleaning.</strong>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Damage Type</label>
          <select className="form-select">
            <option>Select type...</option>
            <option>Structural</option>
            <option>Electrical</option>
            <option>Mechanical</option>
            <option>Plumbing</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-textarea" placeholder="Describe the damage or issue..." rows="4" />
        </div>
        <div className="form-group">
          <label>Severity</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="severity" value="low" /> Low
            </label>
            <label className="radio-label">
              <input type="radio" name="severity" value="medium" /> Medium
            </label>
            <label className="radio-label">
              <input type="radio" name="severity" value="high" /> High
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Photo Evidence</label>
          <div className="photo-dropzone">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <p>Tap to upload photo</p>
          </div>
        </div>
        <button className="btn btn-danger btn-full">Submit Damage Report</button>
      </div>
    </div>
  )
}

function AreaLeadVerification() {
  const { lineId } = useParams()

  return (
    <div className="page">
      <h1 className="page-title">Area Lead Verification</h1>
      <p className="page-subtitle">{lineId?.replace('-', ' ')?.toUpperCase()}</p>

      <div className="card">
        <h3>Verification Checklist</h3>
        <div className="verification-list">
          {[
            'All pre-clean tasks completed and signed off',
            'All post-clean tasks completed and signed off',
            'Damage reports reviewed and addressed',
            'Photo evidence reviewed and approved',
            'Area is safe for production restart',
          ].map((item, i) => (
            <label key={i} className="check-row">
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>Lead Signature / PIN</label>
          <input type="password" placeholder="Enter your verification PIN" className="form-input" />
        </div>

        <div className="form-group">
          <label>Comments</label>
          <textarea className="form-textarea" placeholder="Optional comments..." rows="3" />
        </div>

        <button className="btn btn-primary btn-full">Verify &amp; Approve</button>
      </div>
    </div>
  )
}

function Dashboard() {
  const stats = [
    { label: 'Areas Cleaned', value: '12', total: '16', color: 'primary' },
    { label: 'Pending RTE', value: '3', total: '', color: 'warning' },
    { label: 'Damage Reports', value: '2', total: '', color: 'danger' },
    { label: 'Findings', value: '1', total: '', color: 'info' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Real-time overview of cleaning operations</p>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.color}`}>
            <div className="stat-value">{s.value}{s.total && <span className="stat-total">/{s.total}</span>}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">10:30 AM</span>
            <span className="activity-text">Line 1 — Macerator Room marked Ready to Examine</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">10:15 AM</span>
            <span className="activity-text">Line 2 — Hopper pre-clean completed</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">09:45 AM</span>
            <span className="activity-text">Damage report submitted for Line 1 Conveyor</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Route guards & layout
   ────────────────────────────────────────────── */
import { useParams } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    let mounted = true
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (mounted) {
          setUser(user)
          setLoading(false)
        }
      } catch {
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }
    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(setUser)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  if (!user) return null

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <div className="logo-icon small">SE</div>
        <span className="navbar-title">SaniExpert</span>
      </div>
      <div className="navbar-actions">
        <button className="navbar-btn" onClick={() => navigate('/dashboard')} title="Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>
      </div>
    </nav>
  )
}

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  )
}

/* ──────────────────────────────────────────────
   App router
   ────────────────────────────────────────────── */
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <LineSelection />
          </ProtectedRoute>
        } />
        <Route path="/line/:lineId/areas" element={
          <ProtectedRoute>
            <AreaSelection />
          </ProtectedRoute>
        } />
        <Route path="/line/:lineId/area/:areaId/checklist/:phase" element={
          <ProtectedRoute>
            <ChecklistForm />
          </ProtectedRoute>
        } />
        <Route path="/line/:lineId/damage-report" element={
          <ProtectedRoute>
            <DamageReport />
          </ProtectedRoute>
        } />
        <Route path="/line/:lineId/verify" element={
          <ProtectedRoute>
            <AreaLeadVerification />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  )
}
