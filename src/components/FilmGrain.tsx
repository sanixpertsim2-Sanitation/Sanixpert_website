export default function FilmGrain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9990] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    >
      {/* Animated grain via CSS */}
      <style>{`
        @keyframes grain-shift {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 1%); }
          30% { transform: translate(-1%, 2%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-2%, 1%); }
          60% { transform: translate(2%, -2%); }
          70% { transform: translate(-1%, -1%); }
          80% { transform: translate(1%, 2%); }
          90% { transform: translate(-2%, -1%); }
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'inherit',
          backgroundRepeat: 'inherit',
          backgroundSize: 'inherit',
          width: '110%',
          height: '110%',
          top: '-5%',
          left: '-5%',
          animation: 'grain-shift 0.5s steps(1) infinite',
        }}
      />
    </div>
  )
}
