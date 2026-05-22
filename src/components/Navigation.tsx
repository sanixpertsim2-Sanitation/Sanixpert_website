import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Why Us', path: '/why-us' },
  { label: 'Training', path: '/training' },
  { label: 'Contact', path: '/contact' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const lastScroll = useRef(0)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    gsap.to(nav, { opacity: 1, y: 0, duration: 0.8, delay: 2.8, ease: 'power3.out' })

    const handleScroll = () => {
      const current = window.scrollY
      setScrolled(current > 50)
      if (current > lastScroll.current && current > 100) {
        if (!hidden) { gsap.to(nav, { y: -80, duration: 0.4, ease: 'power3.inOut' }); setHidden(true) }
      } else {
        if (hidden) { gsap.to(nav, { y: 0, duration: 0.4, ease: 'power3.inOut' }); setHidden(false) }
      }
      lastScroll.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hidden])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 opacity-0 -translate-y-5 transition-all duration-500"
        style={{
          height: 72,
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          background: scrolled ? 'rgba(6, 13, 26, 0.85)' : 'rgba(6, 13, 26, 0.4)',
          borderBottom: scrolled ? '1px solid rgba(30, 58, 95, 0.4)' : '1px solid transparent',
        }}>
        <div className="content-max h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0 shrink-0 group">
            <span className="text-lg font-semibold text-[#2E8FD4] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(46,143,212,0.5)]">Sani</span>
            <span className="text-lg font-semibold text-[#F0F4F8]">Xperts</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`relative text-sm font-medium tracking-[0.06em] transition-all duration-300 ${location.pathname === link.path ? 'text-[#2E8FD4]' : 'text-[#8BA3BE] hover:text-[#F0F4F8]'}`}>
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] bg-[#2E8FD4] transition-all duration-400 ease-out"
                  style={{ width: location.pathname === link.path ? '100%' : '0%', boxShadow: location.pathname === link.path ? '0 0 8px rgba(46,143,212,0.5)' : 'none' }} />
              </Link>
            ))}
          </div>

          <Link to="/contact"
            className="hidden md:inline-flex items-center px-7 py-2.5 bg-[#2E8FD4]/90 text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded-lg border border-[#2E8FD4]/40 transition-all duration-500 hover:bg-[#2E8FD4] hover:shadow-[0_0_25px_rgba(46,143,212,0.35)] hover:border-[#2E8FD4]">
            Get a Quote
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#2E8FD4] p-2 transition-transform duration-300 hover:scale-110" aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 bg-[#060d1a] flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-700 ease-out ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backdropFilter: 'blur(30px)', transform: mobileOpen ? 'scale(1)' : 'scale(1.05)' }}>
        {navLinks.map((link, i) => (
          <Link key={link.path} to={link.path}
            className={`text-2xl font-medium tracking-[0.06em] transition-all duration-500 ${location.pathname === link.path ? 'text-[#2E8FD4]' : 'text-[#8BA3BE]'}`}
            style={{ transitionDelay: mobileOpen ? `${i * 0.08}s` : '0s', opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)' }}>
            {link.label}
          </Link>
        ))}
        <Link to="/contact" className="mt-4 px-8 py-4 bg-[#2E8FD4] text-[#F0F4F8] text-lg font-semibold uppercase tracking-[0.1em] rounded-lg transition-all duration-500"
          style={{ transitionDelay: mobileOpen ? `${navLinks.length * 0.08}s` : '0s', opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)' }}>
          Get a Quote
        </Link>
      </div>
    </>
  )
}
