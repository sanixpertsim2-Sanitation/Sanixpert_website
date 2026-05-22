import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GlassWipeReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cRef = useRef<HTMLDivElement>(null)
  const fRef = useRef<HTMLDivElement>(null)
  const wRef = useRef<HTMLDivElement>(null)
  const ctRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = cRef.current, f = fRef.current, w = wRef.current, ct = ctRef.current
    if (!c || !f || !w || !ct) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: c, start: 'top 55%', end: 'bottom 35%', scrub: 1.5 }
      })

      // Fog fades out
      tl.fromTo(f, { opacity: 1 }, { opacity: 0, ease: 'power2.out' }, 0)

      // Wiper sweeps across
      tl.fromTo(w, { x: '-20%' }, { x: '120%', ease: 'power2.inOut' }, 0)

      // Content reveals from blur
      tl.fromTo(
        ct,
        { filter: 'blur(14px) brightness(0.4)', scale: 0.98 },
        { filter: 'blur(0px) brightness(1)', scale: 1, ease: 'power2.out' },
        0.1
      )
    }, c)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={cRef} className={`relative overflow-hidden ${className}`}>
      {/* Content - starts blurred */}
      <div ref={ctRef} className="relative z-10" style={{ filter: 'blur(14px) brightness(0.4)', transform: 'scale(0.98)' }}>
        {children}
      </div>

      {/* Fog/mist overlay */}
      <div
        ref={fRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 40% 45%, rgba(190,210,235,0.25) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 75% 25%, rgba(170,200,230,0.18) 0%, transparent 45%),
            radial-gradient(ellipse 60% 40% at 55% 75%, rgba(160,195,225,0.15) 0%, transparent 50%),
            linear-gradient(180deg, rgba(4,8,15,0.2) 0%, rgba(8,20,40,0.15) 50%, rgba(4,8,15,0.2) 100%)
          `,
          backdropFilter: 'blur(12px) saturate(130%)',
        }}
      />

      {/* Water droplets */}
      <div className="absolute inset-0 z-[25] pointer-events-none">
        {[
          [15, 20, 8], [25, 45, 6], [60, 15, 10], [75, 55, 7],
          [35, 70, 5], [80, 30, 9], [50, 40, 6], [10, 65, 7],
          [90, 75, 5], [45, 25, 8], [70, 80, 6], [20, 85, 9]
        ].map(([l, t, s], i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${l}%`, top: `${t}%`, width: `${s}px`, height: `${s}px`,
              background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95), rgba(200,225,255,0.5) 50%, transparent 70%)',
              boxShadow: '0 2px 8px rgba(100,180,255,0.2), inset 0 0 4px rgba(255,255,255,0.3)',
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* Wiper squeegee */}
      <div
        ref={wRef}
        className="absolute top-0 z-30 pointer-events-none"
        style={{
          left: 0,
          width: '6px',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(220,240,255,0.95) 40%, rgba(200,230,255,0.95) 60%, rgba(255,255,255,0.98) 100%)',
          boxShadow: '0 0 30px rgba(255,255,255,0.7), 0 0 80px rgba(100,190,255,0.3), -3px 0 20px rgba(255,255,255,0.2), 3px 0 20px rgba(255,255,255,0.2)',
          borderRadius: '3px',
        }}
      >
        {/* Wiper handle top */}
        <div
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-5 h-12 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #0c1a2e 0%, #2E8FD4 50%, #0c1a2e 100%)',
            boxShadow: '0 0 15px rgba(46,143,212,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        />
        {/* Wiper rubber base glow */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(46,143,212,0.6) 0%, rgba(12,26,46,0.4) 70%)',
            boxShadow: '0 0 20px rgba(46,143,212,0.4)',
          }}
        />
      </div>
    </div>
  )
}
