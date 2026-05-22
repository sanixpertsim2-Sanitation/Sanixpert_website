import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Detect touch device
    const checkTouch = window.matchMedia('(hover: none)').matches
    setIsTouch(checkTouch)
    if (checkTouch) return

    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2' })
    const trailXTo = gsap.quickTo(trail, 'x', { duration: 0.4, ease: 'power2' })
    const trailYTo = gsap.quickTo(trail, 'y', { duration: 0.4, ease: 'power2' })

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      trailXTo(e.clientX)
      trailYTo(e.clientY)
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 })
      gsap.to(trail, { scale: 1, opacity: 1, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 })
      gsap.to(trail, { scale: 0, opacity: 0, duration: 0.3 })
    }

    // Handle interactive element hovers
    const handleElementEnter = () => {
      gsap.to(cursor, { scale: 2.5, opacity: 0.5, borderColor: '#2E8FD4', duration: 0.3 })
    }
    const handleElementLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, borderColor: 'rgba(46,143,212,0.5)', duration: 0.3 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    // Attach hover listeners to interactive elements
    const attachListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleElementEnter)
        el.addEventListener('mouseleave', handleElementLeave)
      })
      return interactiveElements
    }

    // Attach after a short delay for dynamic content
    const timeout = setTimeout(() => {
      const elements = attachListeners()
      return () => {
        elements.forEach((el) => {
          el.removeEventListener('mouseenter', handleElementEnter)
          el.removeEventListener('mouseleave', handleElementLeave)
        })
      }
    }, 2000)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeout)
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
        style={{
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,143,212,0.12) 0%, transparent 70%)',
          opacity: 0,
        }}
      />
      {/* Cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: '50%',
          backgroundColor: '#2E8FD4',
          boxShadow: '0 0 12px rgba(46,143,212,0.6), 0 0 30px rgba(46,143,212,0.3)',
          opacity: 0,
        }}
      />
    </>
  )
}
