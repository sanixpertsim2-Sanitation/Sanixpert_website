import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplitTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  type?: 'chars' | 'words' | 'lines'
  animation?: 'reveal-up' | 'reveal-down' | 'fade-blur' | 'typewriter' | 'wave'
  stagger?: number
  duration?: number
  delay?: number
  scrollTrigger?: boolean
  scrollStart?: string
  tag?: string
}

export default function SplitText({
  text,
  className = '',
  as: Tag = 'div',
  type = 'chars',
  animation = 'reveal-up',
  stagger = 0.02,
  duration = 0.6,
  delay = 0,
  scrollTrigger = false,
  scrollStart = 'top 80%',
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasAnimated.current) return

    const chars = el.querySelectorAll('.split-char')
    const words = el.querySelectorAll('.split-word')

    let targets = type === 'chars' ? chars : type === 'words' ? words : chars

    // Set initial states based on animation type
    switch (animation) {
      case 'reveal-up':
        gsap.set(targets, { y: '120%', opacity: 0 })
        break
      case 'reveal-down':
        gsap.set(targets, { y: '-120%', opacity: 0 })
        break
      case 'fade-blur':
        gsap.set(targets, { opacity: 0, filter: 'blur(10px)', y: 20 })
        break
      case 'typewriter':
        gsap.set(targets, { opacity: 0 })
        break
      case 'wave':
        gsap.set(targets, { y: 0 })
        break
    }

    const animate = () => {
      hasAnimated.current = true

      switch (animation) {
        case 'reveal-up':
        case 'reveal-down':
          gsap.to(targets, {
            y: '0%',
            opacity: 1,
            duration,
            stagger,
            delay,
            ease: 'power3.out',
          })
          break
        case 'fade-blur':
          gsap.to(targets, {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration,
            stagger,
            delay,
            ease: 'power2.out',
          })
          break
        case 'typewriter':
          gsap.to(targets, {
            opacity: 1,
            duration: 0.05,
            stagger: 0.05,
            delay,
            ease: 'none',
          })
          break
        case 'wave':
          gsap.to(targets, {
            y: -8,
            duration: 0.8,
            stagger: {
              each: 0.03,
              repeat: -1,
              yoyo: true,
            },
            delay,
            ease: 'sine.inOut',
          })
          break
      }
    }

    if (scrollTrigger) {
      const st = ScrollTrigger.create({
        trigger: el,
        start: scrollStart,
        onEnter: () => {
          if (!hasAnimated.current) animate()
        },
        once: true,
      })
      return () => { st.kill() }
    } else {
      animate()
    }

    return () => {
      gsap.killTweensOf(targets)
    }
  }, [text, type, animation, stagger, duration, delay, scrollTrigger, scrollStart])

  const renderContent = () => {
    if (type === 'words') {
      return text.split(' ').map((word, wi) => (
        <span key={wi} className="split-word inline-block overflow-hidden mr-[0.25em]">
          <span className="split-word-inner inline-block">{word}</span>
        </span>
      ))
    }

    // Character splitting
    return text.split('').map((char, ci) => {
      if (char === ' ') {
        return <span key={ci} className="split-char inline-block">&nbsp;</span>
      }
      return (
        <span key={ci} className="split-char inline-block overflow-hidden">
          <span className="split-char-inner inline-block">{char}</span>
        </span>
      )
    })
  }

  return (
    <Tag
      ref={containerRef as any}
      className={className}
    >
      {renderContent()}
    </Tag>
  )
}
