import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SprayCanIcon, Sparkles, Wrench, ClipboardCheck, Unlock, BarChart3 } from 'lucide-react';
import { getAreaById, getPreCleanCount, getPostCleanCount } from '../lib/data';

const PHASES = [
  { id: 'pre-clean', label: 'Pre-Cleaning', desc: 'Inspect, dismantle, dry clean', icon: <SprayCanIcon className="w-5 h-5" />, color: '#a855f7', bg: 'linear-gradient(135deg, #a855f7, #9333ea)' },
  { id: 'post-clean', label: 'Post-Cleaning', desc: 'Cover, clean equipment, floor', icon: <Sparkles className="w-5 h-5" />, color: '#4facfe', bg: 'linear-gradient(135deg, #4facfe, #3d8bfe)' },
  { id: 'handover', label: 'Handover', desc: 'Resolve open tasks & damages', icon: <Wrench className="w-5 h-5" />, color: '#ff8c42', bg: 'linear-gradient(135deg, #ff8c42, #e8732d)' },
  { id: 'verify', label: 'Area Lead Verify', desc: 'Sign-off inspection', icon: <ClipboardCheck className="w-5 h-5" />, color: '#00d084', bg: 'linear-gradient(135deg, #00d084, #00b894)' },
  { id: 'release', label: 'Release Area', desc: 'Final approval to release', icon: <Unlock className="w-5 h-5" />, color: '#f9ca24', bg: 'linear-gradient(135deg, #f9ca24, #f0b90b)' },
];

export default function AreaHubPage() {
  const navigate = useNavigate();
  const areaId = sessionStorage.getItem('selectedArea') || 'macy-production';
  const area = getAreaById(areaId);
  const preCount = getPreCleanCount(areaId);
  const postCount = getPostCleanCount(areaId);

  if (!area) return null;

  const goTo = (path: string) => navigate(path);

  return (
    <div className="min-h-screen px-5 py-6 pb-20" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      <button onClick={() => navigate('/areas')} className="flex items-center gap-2 text-white/50 text-sm mb-6 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Areas
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40">G&amp;G Sanitation Digital</span>
        <h1 className="text-xl font-bold text-white mt-1">{area.name} Control Hub</h1>
        <div className="flex justify-center gap-3 mt-2">
          <span className="text-[10px] bg-purple-500/15 text-purple-300 px-2.5 py-1 rounded-full">{preCount} Pre-Clean</span>
          <span className="text-[10px] bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full">{postCount} Post-Clean</span>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 140 140" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="ringGrad"><stop offset="0%" stopColor="#00d084"/><stop offset="100%" stopColor="#00e5a0"/></linearGradient>
            </defs>
            <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
            <circle cx="70" cy="70" r="62" fill="none" stroke="url(#ringGrad)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray="390" strokeDashoffset="390" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">0%</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Complete</span>
          </div>
        </div>
      </div>

      {/* Phase Buttons */}
      <div className="space-y-3 max-w-md mx-auto">
        {PHASES.map(phase => (
          <button
            key={phase.id}
            onClick={() => goTo(`/${phase.id}`)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-0.5 group"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: phase.bg }}>
              {phase.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm">{phase.label}</div>
              <div className="text-white/40 text-xs mt-0.5">{phase.desc}</div>
            </div>
            <span className="text-lg text-white/30 group-hover:text-white/60 transition-colors">&#8250;</span>
          </button>
        ))}

        {/* Dashboard */}
        <button
          onClick={() => alert('Dashboard coming soon')}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-0.5 group"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white/60 flex-shrink-0 bg-white/5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/60 font-semibold text-sm">Dashboard</div>
            <div className="text-white/30 text-xs mt-0.5">View all area stats</div>
          </div>
        </button>
      </div>
    </div>
  );
}
