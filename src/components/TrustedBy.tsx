import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clients = [
  {
    name: 'Ferrero',
    location: 'Brantford, ON',
    description: 'Leading confectionery manufacturer — facility sanitation & hygiene management.',
    color: '#D4AF37',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: "Give & GO Bakery",
    parent: 'Mondelēz International',
    location: 'Ontario, Canada',
    description: 'Baked goods production — comprehensive food plant sanitation services.',
    color: '#7c4dff',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <path d="M20 28h24M20 36h16" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Bimbo Bakery',
    location: 'Ontario, Canada',
    description: 'Large-scale bakery operations — daily sanitation & BRC compliance.',
    color: '#2E8FD4',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <path d="M12 44c0-12 8-20 20-24s20 0 20 12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
        <path d="M20 48c4-8 12-14 24-12" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
        <circle cx="32" cy="20" r="4" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    name: 'ATB Farms',
    location: 'Ontario, Canada',
    description: 'Agricultural & vertical farming — specialized grow facility sanitation.',
    color: '#00c853',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <path d="M32 52V28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
        <path d="M32 28c-8-8-8-18 0-18s8 10 0 18z" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M32 36c6-6 14-6 14 0s-8 8-14 0z" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <path d="M20 44c4-4 10-4 12 0" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function TrustedBy() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const cards = el.querySelectorAll('.client-card')

    gsap.set(cards, { opacity: 0, y: 60, rotateX: 15 })

    const tween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    return () => { tween.kill() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #060d1a 0%, #081224 50%, #060d1a 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(46, 143, 212, 0.1) 0%, transparent 60%)' }}
      />

      <div className="content-max section-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="caption-style mb-4">Our Partners</p>
          <h2 className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 text-base text-[#8BA3BE] max-w-[560px] mx-auto">
            SaniXperts is proud to be the sanitation contractor of choice for some of Ontario's most respected food production facilities.
          </p>
        </div>

        {/* Client Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
          {clients.map((client, i) => (
            <div
              key={i}
              className="client-card group relative rounded-xl p-8 transition-all duration-500"
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, rgba(14,29,53,0.9) 0%, rgba(10,22,40,0.95) 100%)',
                border: `1px solid rgba(30,58,95,0.4)`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - rect.left) / rect.width - 0.5
                const y = (e.clientY - rect.top) / rect.height - 0.5
                e.currentTarget.style.transform = `translateY(-8px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`
                e.currentTarget.style.borderColor = `${client.color}40`
                e.currentTarget.style.boxShadow = `0 20px 60px ${client.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) rotateY(0) rotateX(0) translateZ(0)'
                e.currentTarget.style.borderColor = 'rgba(30,58,95,0.4)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}
            >
              {/* Glow dot */}
              <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse-glow"
                style={{ backgroundColor: client.color }}
              />

              {/* Icon */}
              <div className="text-[#2E8FD4] mb-5 transition-transform duration-500 group-hover:scale-110">
                {client.icon}
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold text-[#F0F4F8] mb-1">
                {client.name}
              </h3>

              {/* Parent company if exists */}
              {client.parent && (
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: client.color }}>
                  {client.parent}
                </p>
              )}

              {/* Location */}
              <p className="text-xs text-[#8BA3BE] uppercase tracking-wider mb-4">
                {client.location}
              </p>

              {/* Description */}
              <p className="text-sm text-[#8BA3BE] leading-relaxed">
                {client.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-4 right-4 h-px transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${client.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Stats row below clients */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '4', label: 'Major Facilities', sub: 'Trusted Partnerships' },
            { value: '15+', label: 'Years', sub: 'Industry Experience' },
            { value: '99.9%', label: 'Compliance Rate', sub: 'Audit Success' },
            { value: '24/7', label: 'Operations', sub: 'Always Available' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-[clamp(32px,3vw,48px)] font-light text-[#D4AF37] gold-glow">
                {stat.value}
              </div>
              <p className="mt-1 text-sm font-medium text-[#F0F4F8]">{stat.label}</p>
              <p className="text-xs text-[#8BA3BE]">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
