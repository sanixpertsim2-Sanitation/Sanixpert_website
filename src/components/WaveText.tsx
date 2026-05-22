import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface WaveTextProps {
  text: string
}

export default function WaveText({ text }: WaveTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const layer1 = container.querySelector('.wave-layer-1')
    const layer2 = container.querySelector('.wave-layer-2')
    if (!layer1 || !layer2) return

    const chars1 = layer1.querySelectorAll<HTMLSpanElement>('.wave-char')
    const chars2 = layer2.querySelectorAll<HTMLSpanElement>('.wave-char')

    const tweens1: gsap.core.Tween[] = []
    const tweens2: gsap.core.Tween[] = []

    chars1.forEach((span, i) => {
      const tween = gsap.to(span, {
        y: 8,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.08,
      })
      tweens1.push(tween)
    })

    chars2.forEach((span, i) => {
      const tween = gsap.to(span, {
        y: 6,
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.08 + 0.5,
      })
      tweens2.push(tween)
    })

    return () => {
      tweens1.forEach((t) => t.kill())
      tweens2.forEach((t) => t.kill())
    }
  }, [])

  const characters = text.split('').map((char, i) => (
    <span
      key={i}
      className="wave-char inline-block"
      style={{ willChange: 'transform' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex items-center justify-center mt-8"
      style={{ height: 100 }}
    >
      {/* Layer 1 - Blue */}
      <div
        className="wave-layer-1 absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'Geist Sans', sans-serif",
          fontWeight: 200,
          fontSize: 'clamp(60px, 10vw, 120px)',
          textTransform: 'uppercase',
          color: '#2E8FD4',
          opacity: 0.02,
        }}
      >
        {characters}
      </div>

      {/* Layer 2 - White, offset */}
      <div
        className="wave-layer-2 absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontFamily: "'Geist Sans', sans-serif",
          fontWeight: 200,
          fontSize: 'clamp(60px, 10vw, 120px)',
          textTransform: 'uppercase',
          color: '#ffffff',
          opacity: 0.01,
        }}
      >
        {characters.map((_, i) => (
          <span
            key={i}
            className="wave-char inline-block"
            style={{ willChange: 'transform' }}
          >
            {text[i] === ' ' ? '\u00A0' : text[i]}
          </span>
        ))}
      </div>
    </div>
  )
}
