import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLines } from '../lib/supabase.js'

/**
 * LineSelectPage.jsx
 * ------------------
 * Production line selection screen.
 * - Fetches lines from Supabase on mount
 * - Shows MACY as active (clickable → /control)
 * - Shows JFK and Cece as "Coming Soon" (non-clickable, overlay)
 * - Loading spinner while fetching
 * - Error banner on fetch failure
 */
export default function LineSelectPage() {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

  useEffect(() => {
    let mounted = true
    const load = async () => {
      await fetchLines()
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [fetchLines])

  const handleLineClick = (line) => {
    sessionStorage.setItem('selectedLine', JSON.stringify(line))
    navigate('/control')
  }

  // ─── Loading ───
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading lines...</p>
      </div>
    )
  }

  return (
    <div className="line-page page">
      {/* Top section */}
      <div className="line-top">
        <div className="brand">G&amp;G SANITATION DIGITAL</div>
        <h1>SELECT LINE</h1>
        <p className="sub">Choose your production line</p>
      </div>

      {/* Back button */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back
      </button>

      {/* Error banner */}
      {error && (
        <div className="bn bn-dang">{error}</div>
      )}

      {/* Line cards grid */}
      <div className="line-grid">
        {/* ── MACY (ACTIVE) ── */}
        <div
          className="line-card"
          onClick={() => handleLineClick({ id: 'macy', name: 'MACY', desc: 'Cupcake' })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLineClick({ id: 'macy', name: 'MACY', desc: 'Cupcake' }) }}
        >
          <img src="/macy-cupcake.jpg" alt="MACY" className="line-img" />
          <div className="line-info">
            <div className="line-name">MACY</div>
            <div className="line-desc">Cupcake</div>
            <div className="line-stat st-active">ACTIVE</div>
          </div>
        </div>

        {/* ── JFK (COMING SOON) ── */}
        <div className="line-card">
          <img src="/jfk-donut.jpg" alt="JFK" className="line-img" />
          <div className="line-info">
            <div className="line-name">JFK</div>
            <div className="line-desc">Mini Donut with Icing</div>
            <div className="line-stat st-coming">SOON</div>
          </div>
          <div className="coming-overlay">COMING SOON</div>
        </div>

        {/* ── Cece (COMING SOON) ── */}
        <div className="line-card">
          <img src="/cece-cookie.jpg" alt="Cece" className="line-img" />
          <div className="line-info">
            <div className="line-name">Cece</div>
            <div className="line-desc">Cookie with Icing</div>
            <div className="line-stat st-coming">SOON</div>
          </div>
          <div className="coming-overlay">COMING SOON</div>
        </div>
      </div>
    </div>
  )
}
