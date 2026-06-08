import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenLine, CheckCircle, XCircle } from 'lucide-react';
import { getAreaById } from '../lib/data';

export default function VerifyPage() {
  const navigate = useNavigate();
  const areaId = sessionStorage.getItem('selectedArea') || 'macy-production';
  const area = getAreaById(areaId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [verifierName, setVerifierName] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const endDraw = () => { setDrawing(false); };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleVerify = () => {
    if (!verifierName.trim()) { alert('Please enter verifier name'); return; }
    if (!hasSignature) { alert('Please sign to verify'); return; }
    sessionStorage.setItem(`verify_${areaId}`, JSON.stringify({ verifierName, verifiedAt: new Date().toISOString() }));
    setVerified(true);
  };

  if (!area) return null;

  return (
    <div className="min-h-screen px-5 py-6 pb-24" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/hub')} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Area Lead Verification</h1>
          <p className="text-xs text-white/50">{area.name} &middot; Sign to confirm inspection</p>
        </div>
      </div>

      {verified ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #00d084, #00b894)' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Area Verified!</h2>
          <p className="text-white/50 text-sm mb-2">Verified by <span className="text-emerald-300 font-semibold">{verifierName}</span></p>
          <p className="text-white/30 text-xs">{new Date().toLocaleString()}</p>
          <button onClick={() => navigate('/hub')}
            className="mt-8 px-8 py-3 rounded-xl text-sm font-semibold text-white/80 border border-white/15 hover:bg-white/5 transition-colors">
            Back to Control Hub
          </button>
        </div>
      ) : (
        <>
          {/* Status */}
          <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-emerald-300"
            style={{ background: 'rgba(0,208,132,0.1)', border: '1px solid rgba(0,208,132,0.2)' }}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Pre-clean and post-clean submitted. Ready for verification.</span>
          </div>

          {/* Verifier Name */}
          <div className="mb-5">
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Verifier Name (Area Lead) *</label>
            <input type="text" value={verifierName} onChange={e => setVerifierName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
          </div>

          {/* Signature Pad */}
          <div className="mb-4">
            <label className="text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5" /> Digital Signature *
            </label>
            <canvas
              ref={canvasRef}
              width={400}
              height={140}
              className="w-full rounded-xl cursor-crosshair touch-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)' }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
            <button onClick={clearSignature}
              className="mt-2 text-xs text-white/40 hover:text-white/70 transition-colors">
              Clear Signature
            </button>
          </div>

          {/* Review Items */}
          <div className="rounded-2xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-semibold text-white mb-3">Inspection Review</h3>
            {[
              { label: 'Pre-cleaning completed', ok: true },
              { label: 'Post-cleaning completed', ok: true },
              { label: 'All damage reports resolved', ok: true },
              { label: 'Photos attached for critical items', ok: true },
              { label: 'Floor clean and dry', ok: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                {item.ok ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                <span className={`text-xs ${item.ok ? 'text-white/60' : 'text-red-300'}`}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Verify Button */}
          <button onClick={handleVerify}
            className="w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #00d084, #00b894)', boxShadow: '0 8px 32px rgba(0,208,132,0.3)' }}>
            <CheckCircle className="w-5 h-5 inline mr-2" /> Verify & Sign Off
          </button>
        </>
      )}
    </div>
  );
}
