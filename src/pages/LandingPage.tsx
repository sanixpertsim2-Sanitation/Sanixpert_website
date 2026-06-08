import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #162544 40%, #1d3566 100%)' }}>
      
      {/* Ambient glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,157,0.12), transparent 70%)' }} />
      
      <div className="relative z-10 w-full max-w-sm px-6 text-center">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold tracking-[3px] uppercase text-white/50">
            G&amp;G Sanitation Digital
          </span>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto mb-8">
          <img
            src="/macy-cupcake.jpg"
            alt="MACY Cupcake"
            className="w-44 h-44 rounded-full object-cover mx-auto shadow-2xl border-[3px] border-white/10"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
            MACY LINE
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Sanitation
          <span className="block text-lg font-medium text-white/60 mt-1">Digital Checklist System</span>
        </h1>

        <p className="text-sm text-white/40 mb-8">
          CFIA-compliant audit-grade control for food manufacturing
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/areas')}
          className="w-full py-5 px-8 bg-white text-[#0a1628] font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Start Sanitation
        </button>

        {/* Sub areas hint */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Production', 'Decoration', 'Oven', 'Spiral', 'Palletizing'].map(a => (
            <span key={a} className="text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-1 rounded-full">
              {a}
            </span>
          ))}
        </div>

        <p className="mt-8 text-xs text-white/20">v3.0 &middot; Audit Ready</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
