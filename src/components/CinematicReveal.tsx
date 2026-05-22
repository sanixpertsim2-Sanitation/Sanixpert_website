import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RevealType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'clip-reveal-up'
  | 'clip-reveal-down'
  | 'clip-reveal-left'
  | 'clip-reveal-right'
  | 'blur-focus'
  | 'scale-up'
  | 'scale-down'
  | 'depth-parallax'
  | 'rotate-in'

interface CinematicRevealProps {
  children: ReactNode
  type?: RevealType
  delay?: number
  duration?: number
  distance?: number
  className?: string
  stagger?: number
  scrub?: boolean | number
  start?: string
  end?: string
  pin?: boolean
}

const initialStates: Record<RevealType, gsap.TweenVars> = {
  'fade-up': { opacity: 0, y: 80 },
  'fade-down': { opacity: 0, y: -80 },
  'fade-left': { opacity: 0, x: -80 },
  'fade-right': { opacity: 0, x: 80 },
  'clip-reveal-up': { clipPath: 'inset(100% 0 0% 0)', opacity: 0 },
  'clip-reveal-down': { clipPath: 'inset(0% 0 100% 0)', opacity: 0 },
  'clip-reveal-left': { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  'clip-reveal-right': { clipPath: 'inset(0 0 0 100%)', opacity: 0 },
  'blur-focus': { opacity: 0, filter: 'blur(12px) brightness(0.5)', y: 30 },
  'scale-up': { opacity: 0, scale: 0.8 },
  'scale-down': { opacity: 0, scale: 1.15 },
  'depth-parallax': { opacity: 0, y: 60, scale: 0.95 },
  'rotate-in': { opacity: 0, rotation: 5, y: 40 },
}

const finalStates: Record<RevealType, gsap.TweenVars> = {
  'fade-up': { opacity: 1, y: 0 },
  'fade-down': { opacity: 1, y: 0 },
  'fade-left': { opacity: 1, x: 0 },
  'fade-right': { opacity: 1, x: 0 },
  'clip-reveal-up': { clipPath: 'inset(0% 0 0% 0)', opacity: 1 },
  'clip-reveal-down': { clipPath: 'inset(0% 0 0% 0)', opacity: 1 },
  'clip-reveal-left': { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
  'clip-reveal-right': { clipPath: 'inset(0 0 0 0%)', opacity: 1 },
  'blur-focus': { opacity: 1, filter: 'blur(0px) brightness(1)', y: 0 },
  'scale-up': { opacity: 1, scale: 1 },
  'scale-down': { opacity: 1, scale: 1 },
  'depth-parallax': { opacity: 1, y: 0, scale: 1 },
  'rotate-in': { opacity: 1, rotation: 0, y: 0 },
}

export default function CinematicReveal({
  children,
  type = 'fade-up',
  delay = 0,
  duration = 1.2,
  className = '',
  stagger = 0,
  scrub = false,
  start = 'top 85%',
  end = 'bottom 20%',
  pin = false,
}: CinematicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = stagger > 0 ? el.children : el

    gsap.set(targets, initialStates[type])

    const tweenVars: gsap.TweenVars = {
      ...finalStates[type],
      duration,
      delay,
      stagger: stagger > 0 ? stagger : undefined,
      ease: scrub ? 'none' : 'power3.out',
    }

    let tween: gsap.core.Tween | gsap.core.Timeline

    if (scrub) {
      tween = gsap.to(targets, {
        ...tweenVars,
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: scrub === true ? 1.5 : scrub,
          pin,
        },
      })
    } else {
      tween = gsap.to(targets, {
        ...tweenVars,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      })
    }

    return () => {
      if (tween) tween.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [type, delay, duration, stagger, scrub, start, end, pin])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Parallax wrapper for depth effect
export function ParallaxLayer({
  children,
  speed = 0.5,
  className = '',
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.to(el, {
      y: () => -speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })

    return () => { tween.kill() }
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Sticky section with cinematic reveal
export function CinematicStickySection({
  children,
  background,
  className = '',
}: {
  children: ReactNode
  background?: string
  className?: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const tween = gsap.fromTo(
      content,
      { scale: 0.9, opacity: 0, filter: 'blur(8px)' },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      }
    )

    return () => { tween.kill() }
  }, [])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={background ? { background } : undefined}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
