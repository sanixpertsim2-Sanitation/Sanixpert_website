import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

interface CinematicPreloaderProps {
  onComplete: () => void
}

export default function CinematicPreloader({ onComplete }: CinematicPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete()
      },
    })

    // Animate progress counter
    const counter = { val: 0 }
    gsap.to(counter, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        progressRef.current = Math.round(counter.val)
        setProgress(progressRef.current)
      },
    })

    // Cinematic reveal sequence
    tl.to(containerRef.current, {
      duration: 0.1,
      delay: 0.2,
    })
      // Phase 2: Reveal the content beneath
      .to('.preloader-curtain-left', {
        xPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
      }, '+=0.3')
      .to('.preloader-curtain-right', {
        xPercent: 100,
        duration: 1.2,
        ease: 'power4.inOut',
      }, '<')
      .to('.preloader-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.in',
      }, '<0.6')
      .to(containerRef.current, {
        visibility: 'hidden',
        duration: 0.1,
      })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999]"
      style={{ visibility: 'visible' }}
    >
      {/* Split curtain overlay */}
      <div className="preloader-curtain-left absolute top-0 left-0 w-1/2 h-full bg-[#0A1628] z-10" />
      <div className="preloader-curtain-right absolute top-0 right-0 w-1/2 h-full bg-[#0A1628] z-10" />

      {/* Center content */}
      <div className="preloader-content absolute inset-0 z-20 flex flex-col items-center justify-center">
        {/* Brand name with cinematic reveal */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-0 text-3xl md:text-5xl font-light tracking-[0.15em] uppercase">
            <span className="text-[#2E8FD4] inline-block preloader-sani">Sani</span>
            <span className="text-[#F0F4F8] inline-block preloader-xperts">Xperts</span>
          </div>
        </div>

        {/* Progress line */}
        <div className="mt-10 w-48 md:w-64 h-px bg-[#1E3A5F] relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#2E8FD4] transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress number */}
        <div className="mt-4 font-mono text-xs tracking-[0.2em] text-[#8BA3BE]">
          {String(progress).padStart(3, '0')}
        </div>
      </div>
    </div>
  )
}
