import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Factory, Paintbrush, Flame, RotateCw, PackageCheck } from 'lucide-react';
import { AREAS, getPreCleanCount, getPostCleanCount } from '../lib/data';

const ICONS: Record<string, React.ReactNode> = {
  '🏭': <Factory className="w-6 h-6" />,
  '🎨': <Paintbrush className="w-6 h-6" />,
  '🔥': <Flame className="w-6 h-6" />,
  '🌀': <RotateCw className="w-6 h-6" />,
  '📦': <PackageCheck className="w-6 h-6" />,
};

export default function AreaSelectPage() {
  const navigate = useNavigate();

  const selectArea = (areaId: string) => {
    sessionStorage.setItem('selectedArea', areaId);
    navigate('/hub');
  };

  return (
    <div className="min-h-[100dvh] px-5 py-6 pb-20" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      {/* Header */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 text-sm mb-6 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center mb-8">
        <span className="text-[11px] font-semibold tracking-[3px] uppercase text-white/40">MACY Line</span>
        <h1 className="text-2xl font-bold text-white mt-1">Select Area</h1>
        <p className="text-sm text-white/50 mt-1">Choose sanitation zone to inspect</p>
      </div>

      {/* Area Cards */}
      <div className="space-y-3 max-w-md mx-auto">
        {AREAS.map(area => {
          const preCount = getPreCleanCount(area.id);
          const postCount = getPostCleanCount(area.id);
          return (
            <button
              key={area.id}
              onClick={() => selectArea(area.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${area.color}, ${area.color}88)` }}>
                {ICONS[area.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base">{area.name}</h3>
                <p className="text-white/50 text-xs mt-0.5">{area.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{preCount} Pre-Clean</span>
                  <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{postCount} Post-Clean</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
