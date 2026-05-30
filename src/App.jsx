import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase, getCurrentUser } from './lib/supabase.js'
import './App.css'

// Page components
import Login from './components/Login.jsx'
import LineSelection from './components/LineSelection.jsx'
import AreaSelection from './components/AreaSelection.jsx'
import ChecklistForm from './components/ChecklistForm.jsx'
import DamageReport from './components/DamageReport.jsx'
import AreaLeadVerification from './components/AreaLeadVerification.jsx'
import Dashboard from './components/Dashboard.jsx'

// Layout component
import Navbar from './components/Navbar.jsx'

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
