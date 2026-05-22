import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FoamCleanAnimation({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cRef = useRef<HTMLDivElement>(null)
  const foamRef = useRef<HTMLDivElement>(null)
  const ctRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = cRef.current, foam = foamRef.current, ct = ctRef.current, bubbles = bubblesRef.current
    if (!c || !foam || !ct || !bubbles) return

    const ctx = gsap.context(() => {
      // Foam bubbles rise and drift
      const bubbleEls = bubbles.querySelectorAll('.foam-bubble')
      gsap.set(bubbleEls, { y: 200, opacity: 0, scale: 0.3 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: c, start: 'top 70%', end: 'bottom 30%', scrub: 2 }
      })

      // Foam overlay rises and fades
      tl.fromTo(foam, { y: '60%', opacity: 0.95 }, { y: '-30%', opacity: 0, ease: 'power2.inOut' }, 0)

      // Bubbles rise
      tl.to(bubbleEls, {
        y: -300,
        opacity: (i) => 0.3 + (i % 3) * 0.2,
        scale: 1,
        stagger: 0.05,
        ease: 'power1.out'
      }, 0)

      // Content reveals through the foam
      tl.fromTo(ct,
        { filter: 'blur(8px) brightness(0.6)', opacity: 0.3 },
        { filter: 'blur(0px) brightness(1)', opacity: 1, ease: 'power2.out' },
        0.3
      )
    }, c)

    return () => ctx.revert()
  }, [])

  const bubbles = Array.from({ length: 24 }, () => ({
    size: 15 + Math.random() * 50,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 4,
  }))

  return (
    <div ref={cRef} className={`relative overflow-hidden ${className}`}>
      {/* Content behind foam */}
      <div ref={ctRef} className="relative z-10" style={{ filter: 'blur(8px) brightness(0.6)', opacity: 0.3 }}>
        {children}
      </div>

      {/* Foam overlay */}
      <div
        ref={foamRef}
        className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
        style={{
          height: '120%',
          background: `
            radial-gradient(ellipse 120% 80% at 50% 100%, rgba(240,248,255,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 100% 60% at 30% 90%, rgba(220,240,255,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 70% 85%, rgba(200,230,255,0.1) 0%, transparent 50%),
            linear-gradient(180deg, transparent 0%, rgba(200,230,255,0.08) 30%, rgba(220,240,255,0.12) 60%, rgba(240,248,255,0.08) 100%)
          `,
        }}
      />

      {/* Floating bubbles */}
      <div ref={bubblesRef} className="absolute inset-0 z-[25] pointer-events-none overflow-hidden">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="foam-bubble absolute rounded-full"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              bottom: '-10%',
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,230,255,0.4) 40%, rgba(100,180,255,0.15) 70%, transparent)`,
              boxShadow: '0 0 15px rgba(100,190,255,0.15), inset 0 0 8px rgba(255,255,255,0.3)',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Foam edge line */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[22] pointer-events-none"
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(200,230,255,0.4), rgba(255,255,255,0.6), rgba(200,230,255,0.4), transparent)',
          boxShadow: '0 -2px 20px rgba(100,190,255,0.3)',
        }}
      />
    </div>
  )
}
