import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface Orb {
  x: number
  y: number
  size: number
  color: string
  speed: number
  opacity: number
}

export default function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const orbs = container.querySelectorAll<HTMLDivElement>('.orb')

    orbs.forEach((orb, i) => {
      // Float up and down
      gsap.to(orb, {
        y: `+=${20 + i * 10}`,
        x: `+=${10 + i * 5}`,
        duration: 4 + i,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
      })

      // Subtle scale pulse
      gsap.to(orb, {
        scale: 1.1,
        duration: 5 + i,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
      })
    })

    return () => {
      orbs.forEach((orb) => gsap.killTweensOf(orb))
    }
  }, [])

  const orbs: Orb[] = [
    { x: 10, y: 20, size: 300, color: '46, 143, 212', speed: 20, opacity: 0.06 },
    { x: 70, y: 60, size: 250, color: '124, 77, 255', speed: 25, opacity: 0.04 },
    { x: 40, y: 80, size: 200, color: '0, 229, 255', speed: 18, opacity: 0.03 },
    { x: 85, y: 15, size: 180, color: '46, 143, 212', speed: 22, opacity: 0.05 },
    { x: 20, y: 70, size: 150, color: '212, 175, 55', speed: 15, opacity: 0.03 },
  ]

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="orb absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(${orb.color}, ${orb.opacity}) 0%, transparent 70%)`,
            filter: 'blur(40px)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
