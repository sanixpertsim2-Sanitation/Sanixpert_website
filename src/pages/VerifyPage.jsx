import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, CheckCircle, PenLine, XCircle, ClipboardList, FileText } from 'lucide-react'
import {
  getDamageReports, insertInspectionLog,
} from '../lib/supabase.js'

function getStoredLineId() {
  try {
    const stored = sessionStorage.getItem('selectedLine')
    return stored ? JSON.parse(stored).id : 'macy'
  } catch { return 'macy' }
}

/**
 * VerifyPage — Area Lead Verification with signature
 */
export default function VerifyPage() {
  const navigate = useNavigate()
  const lineId = getStoredLineId()
  const canvasRef = useRef(null)

  const [damages, setDamages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Signature state
  const [drawing, setDrawing] = useState(false)

  // Inspector
  const [inspectorName, setInspectorName] = useState('')
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

        const { data: damagesData, error: damagesError } = await getDamageReports(lineId)
        if (damagesError) throw damagesError
        if (!cancelled) setDamages(damagesData || [])
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load verification data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [lineId])

  // ═══════════════════════════════════════════
  //  Signature pad logic
  // ═══════════════════════════════════════════
  const getCoords = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const start = (e) => {
    e.preventDefault()
    setDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getCoords(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!drawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getCoords(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = (e) => {
    e.preventDefault()
    setDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // ═══════════════════════════════════════════
  //  Submit verification
  // ═══════════════════════════════════════════
  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    // Validation
    const name = inspectorName.trim()
    if (!name) {
      setError('Please enter your name.')
      return
    }

    // Check signature
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pixelBuffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const hasSignature = pixelBuffer.some(channel => channel !== 0)
    if (!hasSignature) {
      setError('Please sign before submitting.')
      return
    }

    // Check open damages
    const openDamages = damages.filter(d => d.status !== 'completed' && d.status !== 'resolved')
    if (openDamages.length > 0) {
      setError(`Cannot verify: ${openDamages.length} unresolved damage report(s). Resolve them in Handover first.`)
      return
    }

    setSubmitting(true)

    try {
      const signatureData = canvas.toDataURL('image/png')

      const { error: insError } = await insertInspectionLog({
        line_id: lineId,
        inspector_name: name,
        signature_data: signatureData,
        notes: notes.trim() || null,
        created_at: new Date().toISOString(),
      })
      if (insError) throw insError

      setSuccess('Verification submitted successfully!')
      setTimeout(() => navigate('/control'), 1500)
    } catch (err) {
      setError('Verification failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ═══════════════════════════════════════════
  //  Derived state
  // ═══════════════════════════════════════════
  const openDamages = damages.filter(d => d.status !== 'completed' && d.status !== 'resolved')
  const canVerify = openDamages.length === 0

  // ═══════════════════════════════════════════
  //  Render: Loading
  // ═══════════════════════════════════════════
  if (loading) {
    return (
      <div className="ver-page page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading verification data...</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  //  Render: Main
  // ═══════════════════════════════════════════
  return (
    <div className="ver-page page">
      {/* ── Header ── */}
      <button className="back-btn" onClick={() => navigate('/control')}>
        <ChevronLeft size={18} /> Back
      </button>
      <h1>AREA LEAD VERIFICATION</h1>
      <p className="sub">Sign to confirm inspection</p>

      {/* ── Status Banner ── */}
      <div className={`bn ${canVerify ? 'bn-ok' : 'bn-warn'}`}>
        {canVerify ? (
          <><CheckCircle size={16} /> Ready to verify — all damages resolved</>
        ) : (
          <><AlertTriangle size={16} /> {openDamages.length} unresolved damage report{openDamages.length !== 1 ? 's' : ''} blocking verification</>
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

      {/* ── Open Damages Blocker ── */}
      {openDamages.length > 0 && (
        <div className="glass" style={{ borderLeft: '4px solid #e74c3c', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={16} /> Unresolved Damages
          </h3>
          {openDamages.map(d => (
            <div key={d.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
              {d.description?.substring(0, 80)}{d.description?.length > 80 ? '...' : ''}
            </div>
          ))}
        </div>
      )}

      {/* ── Signature Pad ── */}
      <div className="glass mb-3">
        <h3 style={{ fontSize: '1rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PenLine size={16} /> Digital Signature
        </h3>
        <canvas
          ref={canvasRef}
          className="sig-pad"
          width={320}
          height={160}
          onMouseDown={start}
          onMouseMove={draw}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={draw}
          onTouchEnd={end}
        />
        <button className="sig-clear" onClick={clearSignature}>
          <XCircle size={14} /> Clear Signature
        </button>
      </div>

      {/* ── Inspector Name ── */}
      <label className="emp-in mb-3">
        <span><FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />Inspector Name *</span>
        <input
          type="text"
          placeholder="Enter your full name..."
          value={inspectorName}
          onChange={e => setInspectorName(e.target.value)}
        />
      </label>

      {/* ── Notes ── */}
      <label className="emp-in mb-3">
        <span>Verification Notes (optional)</span>
        <textarea
          rows={3}
          placeholder="Any additional notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </label>

      {/* ── Submit ── */}
      <button
        className="btn btn-g"
        onClick={handleSubmit}
        disabled={submitting || !canVerify}
      >
        {submitting ? (
          <>Submitting...</>
        ) : (
          <><CheckCircle size={16} /> Verify &amp; Sign</>
        )}
      </button>
    </div>
  )
}
