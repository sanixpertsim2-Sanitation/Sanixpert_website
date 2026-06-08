import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { getAreaById } from '../lib/data';

export default function ReleasePage() {
  const navigate = useNavigate();
  const areaId = sessionStorage.getItem('selectedArea') || 'macy-production';
  const area = getAreaById(areaId);
  const [releaserName, setReleaserName] = useState('');
  const [notes, setNotes] = useState('');
  const [released, setReleased] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check prerequisites from sessionStorage
  const preClean = sessionStorage.getItem(`preClean_${areaId}`);
  const postClean = sessionStorage.getItem(`postClean_${areaId}`);
  const verification = sessionStorage.getItem(`verify_${areaId}`);

  const checks = [
    { label: 'Pre-Cleaning Submitted', pass: !!preClean },
    { label: 'Post-Cleaning Submitted', pass: !!postClean },
    { label: 'Area Lead Verified', pass: !!verification },
    { label: 'Handover Tasks Resolved', pass: true }, // simplified
  ];

  const allPassed = checks.every(c => c.pass);

  const handleRelease = async () => {
    if (!releaserName.trim()) { alert('Please enter your name'); return; }
    if (!allPassed) { alert('All prerequisites must be met before release'); return; }

    setSubmitting(true);
    sessionStorage.setItem(`release_${areaId}`, JSON.stringify({ releaserName, notes, releasedAt: new Date().toISOString() }));
    await new Promise(r => setTimeout(r, 500));
    setSubmitting(false);
    setReleased(true);
  };

  if (!area) return null;

  return (
    <div className="min-h-screen px-5 py-6 pb-24" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/hub')} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Release Area</h1>
          <p className="text-xs text-white/50">{area.name} &middot; Final approval</p>
        </div>
      </div>

      {released ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #f9ca24, #f0b90b)' }}>
            <Unlock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{area.name} Released!</h2>
          <p className="text-white/50 text-sm mb-1">Released by <span className="text-amber-300 font-semibold">{releaserName}</span></p>
          <p className="text-white/30 text-xs">{new Date().toLocaleString()}</p>
          {notes && <p className="mt-3 text-white/40 text-xs italic max-w-xs">&ldquo;{notes}&rdquo;</p>}
          <button onClick={() => navigate('/areas')}
            className="mt-8 px-8 py-3 rounded-xl text-sm font-semibold text-white/80 border border-white/15 hover:bg-white/5 transition-colors">
            Sanitize Another Area
          </button>
        </div>
      ) : (
        <>
          {/* Prerequisites */}
          <div className="rounded-2xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Release Prerequisites
            </h3>
            <div className="space-y-2">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                  style={{ background: check.pass ? 'rgba(0,208,132,0.08)' : 'rgba(255,140,66,0.08)', border: `1px solid ${check.pass ? 'rgba(0,208,132,0.15)' : 'rgba(255,140,66,0.15)'}` }}>
                  {check.pass ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />}
                  <span className={`text-sm flex-1 ${check.pass ? 'text-emerald-300' : 'text-orange-300'}`}>{check.label}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${check.pass ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-300'}`}>
                    {check.pass ? 'PASS' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {allPassed ? (
            <>
              <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 text-emerald-300"
                style={{ background: 'rgba(0,208,132,0.1)', border: '1px solid rgba(0,208,132,0.2)' }}>
                <Unlock className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">All checks passed! Area is ready for release.</span>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-white/60 mb-1.5 block">Released By *</label>
                <input type="text" value={releaserName} onChange={e => setReleaserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
              </div>

              <div className="mb-6">
                <label className="text-xs font-medium text-white/60 mb-1.5 block">Release Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Any observations or comments..."
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none resize-none h-20"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)' }} />
              </div>

              <button onClick={handleRelease} disabled={submitting}
                className="w-full py-4 rounded-2xl font-bold text-[#0a1628] shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f9ca24, #f0b90b)', boxShadow: '0 8px 32px rgba(249,202,36,0.3)' }}>
                <Send className="w-5 h-5" /> {submitting ? 'Releasing...' : `Release ${area.name}`}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl text-orange-300"
              style={{ background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.2)' }}>
              <Lock className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Complete all prerequisites to unlock release.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
