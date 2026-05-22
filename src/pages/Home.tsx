import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, Phone, ShieldCheck, Award, Zap, Target } from 'lucide-react'
import SplitText from '../components/SplitText'
import CinematicReveal from '../components/CinematicReveal'
import ParticleNetwork from '../components/ParticleNetwork'
import TrustedBy from '../components/TrustedBy'
import FloatingOrbs from '../components/FloatingOrbs'
import GlassWipeReveal from '../components/GlassWipeReveal'
import FoamCleanAnimation from '../components/FoamCleanAnimation'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════ HERO SECTION (No Video) ═══════════════ */
function HeroSection({ preloaderDone }: { preloaderDone: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!preloaderDone) return
    const tl = gsap.timeline()
    tl.fromTo('.hero-caption', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.hero-headline-char', { y: '120%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.02, ease: 'power4.out' }, '-=0.4')
      .fromTo('.hero-sub', { opacity: 0, y: 30, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, '-=0.7')
      .fromTo('.hero-clients', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.5')
      .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    return () => { tl.kill() }
  }, [preloaderDone])

  const headlineText = 'SANIXPERTS'
  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center">
      {/* Particle network background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ParticleNetwork particleCount={100} connectionDistance={140} color="46,143,212" maxSpeed={0.4} />
      </div>
      {/* Deep gradient overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(46,143,212,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(124,77,255,0.04) 0%, transparent 40%), linear-gradient(180deg, rgba(4,8,15,0.3) 0%, rgba(4,8,15,0.1) 50%, rgba(4,8,15,0.5) 100%)' }} />
      {/* Vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 15%, rgba(4,8,15,0.6) 100%)' }} />

      <div ref={contentRef} className="relative z-10 content-max text-center">
        <p className="hero-caption caption-style mb-8 opacity-0" style={{ letterSpacing: '0.3em' }}>
          Hamilton, Ontario &bull; Trusted Since 2009
        </p>

        <h1 className="text-[clamp(56px,12vw,160px)] font-extralight uppercase tracking-[0.12em] leading-[0.9] text-[#F0F4F8] text-glow-strong mb-6">
          {headlineText.split('').map((char, i) => (
            <span key={i} className="hero-headline-char inline-block overflow-hidden" style={{ opacity: 0 }}>
              <span className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
            </span>
          ))}
        </h1>

        <p className="hero-sub text-lg md:text-2xl text-[#8BA3BE] max-w-[680px] mx-auto leading-relaxed mb-8 opacity-0">
          Ontario's premier food plant sanitation partner
        </p>

        {/* Client badges under headline */}
        <div className="hero-clients flex flex-wrap items-center justify-center gap-3 mb-10 opacity-0">
          {['Ferrero', 'Give & GO Bakery', 'Bimbo Bakery', 'ATB Farms'].map((client) => (
            <span key={client} className="px-5 py-2 rounded-full text-xs font-medium tracking-wider border border-[#1E3A5F]/60 text-[#8BA3BE] glass-panel">
              {client}
            </span>
          ))}
        </div>

        <div className="hero-cta flex flex-wrap items-center justify-center gap-4 opacity-0">
          <Link to="/contact" className="group relative px-10 py-4 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.12em] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(46,143,212,0.5)]">
            <span className="relative z-10 flex items-center gap-2"><Phone size={16} /> Contact Us</span>
            <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link to="/services" className="px-10 py-4 border border-[#1E3A5F] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.12em] rounded-lg transition-all duration-500 hover:border-[#2E8FD4] hover:bg-[rgba(46,143,212,0.06)]">
            Our Services
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8BA3BE]">Scroll</span>
        <ChevronDown size={20} className="text-[#8BA3BE] animate-bounce" />
      </div>
    </section>
  )
}

/* ═══════════════ TRUSTED CLIENTS ═══════════════ */
function TrustedClients() {
  return <TrustedBy />
}

/* ═══════════════ ABOUT SECTION (Video + Glass Wipe) ═══════════════ */
function AboutSection() {
  return (
    <section className="w-full bg-rich section-padding">
      <FloatingOrbs />
      <div className="content-max relative z-10">
        {/* Video hero for About - cinematic team */}
        <CinematicReveal type="fade-up" duration={1.4}>
          <div className="relative rounded-2xl overflow-hidden mb-20" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(46,143,212,0.1)' }}>
            <video autoPlay loop muted playsInline className="w-full h-[400px] md:h-[500px] object-cover" poster="/images/about-team.jpg">
              <source src="/videos/hero-team-cinematic.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(4,8,15,0.2) 0%, rgba(4,8,15,0.4) 50%, rgba(4,8,15,0.8) 100%)' }} />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="caption-style mb-2">Our Team</p>
              <p className="text-2xl md:text-3xl font-light text-[#F0F4F8]">Trained professionals serving Ontario's food industry</p>
            </div>
          </div>
        </CinematicReveal>

        {/* Glass Wipe Reveal Content */}
        <GlassWipeReveal className="rounded-2xl py-16 md:py-24 px-8 md:px-16">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="caption-style mb-6">About SaniXperts</p>
            <h2 className="text-[clamp(28px,4vw,52px)] font-normal text-[#F0F4F8] leading-[1.1] mb-8">
              Sanitation Services Based in<br />Ontario, Canada
            </h2>
            <p className="text-base md:text-lg text-[#8BA3BE] leading-relaxed max-w-[640px] mx-auto mb-6">
              SaniXperts Inc. offers professional sanitation services across southern Ontario. 
              We have more than 15 years of experience specializing in all federal and provincial food plants.
              We proudly serve industry leaders including Ferrero Brantford, Give & GO Bakery, Bimbo Bakery, and ATB Farms.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-3 bg-[#2E8FD4]/20 border border-[#2E8FD4]/40 text-[#2E8FD4] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#2E8FD4]/30 hover:border-[#2E8FD4]/60">
                View Our Services
              </Link>
              <Link to="/why-us" className="inline-flex items-center gap-2 px-8 py-3 border border-[#1E3A5F] text-[#8BA3BE] rounded-lg text-sm font-medium transition-all duration-300 hover:border-[#2E8FD4]/40 hover:text-[#F0F4F8]">
                Why Choose Us
              </Link>
            </div>
          </div>
        </GlassWipeReveal>
      </div>
    </section>
  )
}

/* ═══════════════ STATS BANNER ═══════════════ */
function StatsBanner() {
  const statsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const cards = el.querySelectorAll('.stat-card')
    const numbers = el.querySelectorAll('.stat-number')
    gsap.set(cards, { opacity: 0, y: 50, filter: 'blur(6px)' })
    gsap.to(cards, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' }})

    const targets = [
      { el: numbers[0], val: 15 },
      { el: numbers[1], val: 99.9, dec: 1 },
      { el: numbers[2], val: 200 },
      { el: numbers[3], val: 24 },
    ]
    targets.forEach(({ el, val, dec }, i) => {
      if (!el) return
      const obj = { v: 0 }
      gsap.to(obj, { v: val, duration: 2.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
        onUpdate: () => { el.textContent = (dec ? obj.v.toFixed(dec) : Math.round(obj.v)) + ['+', '%', '+', '/7'][i] }
      })
    })
  }, [])

  return (
    <section className="w-full border-t border-[#1E3A5F]/30 bg-rich-alt section-padding relative overflow-hidden">
      <FloatingOrbs />
      <div ref={statsRef} className="content-max relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: '15+', label: 'Years Experience', desc: 'Since 2009' },
            { num: '99.9%', label: 'Sterilization', desc: 'UV & Ozone' },
            { num: '200+', label: 'Clients Served', desc: 'Food Plants' },
            { num: '24/7', label: 'Available', desc: 'Emergency' },
          ].map((s, i) => (
            <div key={i} className="stat-card text-center relative">
              <div className="stat-number text-[clamp(40px,4vw,56px)] font-light text-[#D4AF37] gold-glow" />
              <p className="mt-2 text-lg font-medium text-[#F0F4F8]">{s.label}</p>
              <p className="text-sm text-[#8BA3BE]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ FOAM CLEAN SECTION ═══════════════ */
function FoamCleanSection() {
  return (
    <section className="w-full section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #060d1a 0%, #081424 50%, #060d1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticleNetwork particleCount={50} connectionDistance={130} color="46,143,212" maxSpeed={0.25} />
      </div>
      <div className="content-max relative z-10">
        <FoamCleanAnimation className="rounded-2xl py-16 md:py-24 px-8 md:px-16">
          <div className="max-w-[900px] mx-auto text-center">
            <p className="caption-style mb-6">Our Process</p>
            <h2 className="text-[clamp(28px,4vw,52px)] font-normal text-[#F0F4F8] leading-[1.1] mb-8">
              Nine Steps to<br />Complete Sanitation
            </h2>
            <p className="text-base md:text-lg text-[#8BA3BE] leading-relaxed max-w-[600px] mx-auto mb-12">
              We follow a rigorous nine-step sanitation procedure to deliver immaculate results every time. 
              From initial inspection through final validation, every step is documented for audit compliance.
            </p>

            {/* 9 steps grid */}
            <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
              {['Inspection', 'Dry Pick', 'Pre-Rinse', 'Self-Check', 'Chemical', 'Condensation', 'Pre-Op', 'Sanitizing', 'Validation'].map((step, i) => (
                <div key={i} className="group text-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center mx-auto mb-3 transition-all duration-500 group-hover:border-[#2E8FD4] group-hover:shadow-[0_0_25px_rgba(46,143,212,0.25)] group-hover:scale-110 group-hover:bg-[rgba(46,143,212,0.05)]">
                    <span className="text-sm font-medium text-[#8BA3BE] group-hover:text-[#2E8FD4] transition-colors">{i + 1}</span>
                  </div>
                  <p className="text-[10px] md:text-xs uppercase tracking-wider text-[#8BA3BE] group-hover:text-[#F0F4F8] transition-colors">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link to="/why-us" className="inline-flex items-center gap-2 px-8 py-3 border border-[#2E8FD4]/30 text-[#2E8FD4] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[#2E8FD4]/10 hover:border-[#2E8FD4]/50">
                View Full Process
              </Link>
            </div>
          </div>
        </FoamCleanAnimation>
      </div>
    </section>
  )
}

/* ═══════════════ SERVICES SHOWCASE ═══════════════ */
function ServicesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const services = [
    { num: '01', title: 'Food Plant Sanitation', desc: 'Complete sanitation for federal and provincial food processing facilities ensuring full regulatory compliance.', image: '/images/service-food-plant.jpg' },
    { num: '02', title: 'Commercial Kitchen Cleaning', desc: 'Deep cleaning of hoods, fans, ducts, and all kitchen components to bare metal, reducing fire hazards.', image: '/images/service-kitchen.jpg' },
    { num: '03', title: 'Industrial Sanitation', desc: 'Specialized cleaning for manufacturing plants, warehouses, and industrial facilities meeting health standards.', image: '/images/service-industrial.jpg' },
    { num: '04', title: 'UV & Ozone Disinfection', desc: 'Advanced ultraviolet and ozone technology for 99.9% sterilization rate and microbial elimination.', image: '/images/service-uv.jpg' },
    { num: '05', title: 'Electrostatic Spraying', desc: 'State-of-the-art electrostatic sprayer technology for complete surface coverage and disinfection.', image: '/images/service-electrostatic.jpg' },
    { num: '06', title: 'Emergency Response', desc: '24/7 emergency disinfecting services for high-risk contamination situations across Ontario.', image: '/images/service-emergency.jpg' },
  ]

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const st = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 100}`, scrub: 1.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
      })
      return () => { st.kill() }
    })
    return () => { mm.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="w-full section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #04080f 0%, #060d1a 100%)' }}>
      <div className="content-max mb-16 md:mb-20 text-center">
        <CinematicReveal type="blur-focus">
          <p className="caption-style mb-4">What We Do</p>
          <SplitText text="Comprehensive Sanitation Solutions" as="h2" className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]" type="chars" animation="reveal-up" stagger={0.012} duration={0.8} scrollTrigger />
        </CinematicReveal>
      </div>
      <div ref={trackRef} className="flex flex-col md:flex-row gap-6 md:gap-10 px-6 md:px-0 md:pl-8 md:w-max" style={{ perspective: '1200px' }}>
        {services.map((s) => (
          <div key={s.num} className="group relative w-full md:w-[400px] h-[350px] md:h-[480px] rounded-xl overflow-hidden border border-[#1E3A5F]/60 shrink-0"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)' }}
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; e.currentTarget.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)` }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateY(0) rotateX(0) translateZ(0)' }}>
            <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,8,15,0.95) 0%, rgba(4,8,15,0.4) 50%, rgba(4,8,15,0.15) 100%)' }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(46,143,212,0.15) 0%, transparent 60%)' }} />
            <span className="absolute top-4 right-4 text-[80px] md:text-[120px] font-extralight text-white/[0.04] leading-none select-none">{s.num}</span>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-medium text-[#F0F4F8] mb-2">{s.title}</h3>
              <p className="text-sm text-[#8BA3BE] max-w-[320px]">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════ WHY CHOOSE US ═══════════════ */
function WhyChooseUs() {
  const features = [
    { icon: ShieldCheck, title: 'Expertise in Facility Maintenance', desc: 'Deep knowledge of food processing equipment and facility requirements.' },
    { icon: Award, title: 'Superior Food Safety Solutions', desc: 'Health Canada certified products and procedures that exceed industry standards.' },
    { icon: Zap, title: 'Safety Standard Compliance', desc: 'BRC, USDA (FSA), and third-party audit compliance with complete integrity.' },
    { icon: Target, title: 'Trained Professionals', desc: 'Continuous training and certification in the latest sanitation techniques.' },
  ]

  return (
    <section className="w-full bg-rich section-padding relative overflow-hidden">
      <FloatingOrbs />
      <div className="content-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <CinematicReveal type="blur-focus">
              <p className="caption-style mb-4">Our Advantage</p>
              <SplitText text="Why Choose SaniXperts" as="h2" className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8] mb-8" type="chars" animation="reveal-up" stagger={0.012} duration={0.8} scrollTrigger />
            </CinematicReveal>
            <div className="space-y-8">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <CinematicReveal key={i} type="fade-right" delay={i * 0.1}>
                    <div className="flex gap-5">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0c1a2e] border border-[#1E3A5F]/60 flex items-center justify-center transition-all duration-300 hover:border-[#2E8FD4]/50 hover:shadow-[0_0_20px_rgba(46,143,212,0.15)]">
                        <Icon size={20} className="text-[#2E8FD4]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#F0F4F8]">{f.title}</h3>
                        <p className="mt-1 text-sm text-[#8BA3BE]">{f.desc}</p>
                      </div>
                    </div>
                  </CinematicReveal>
                )
              })}
            </div>
          </div>
          <CinematicReveal type="fade-left" duration={1.4}>
            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(46,143,212,0.05)' }}>
              <img src="/images/process-inspection.jpg" alt="Sanitation process" className="w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(46,143,212,0.06) 0%, transparent 50%)' }} />
            </div>
          </CinematicReveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ CONTACT CTA ═══════════════ */
function ContactCTA() {
  return (
    <section className="w-full py-24 md:py-32 text-center relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #060d1a 0%, #0c1a2e 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.12) 0%, transparent 70%)' }} />
      <div className="content-max relative z-10">
        <SplitText text="Ready to Elevate Your Sanitation Standards?" as="h2" className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]" type="words" animation="fade-blur" stagger={0.04} duration={0.8} scrollTrigger />
        <CinematicReveal type="blur-focus" delay={0.3}>
          <p className="mt-6 text-base text-[#8BA3BE] max-w-[560px] mx-auto">
            Join Ferrero, Give & GO, Bimbo Bakery and ATB Farms in trusting SaniXperts.
          </p>
        </CinematicReveal>
        <CinematicReveal type="scale-up" delay={0.5}>
          <Link to="/contact" className="group relative inline-block mt-10 px-14 py-5 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded-lg overflow-hidden transition-shadow duration-500 hover:shadow-[0_12px_50px_rgba(46,143,212,0.5)]">
            <span className="relative z-10">Get in Touch</span>
            <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </CinematicReveal>
        <CinematicReveal type="fade-up" delay={0.7}>
          <p className="mt-8 text-xl font-medium text-[#D4AF37] gold-glow">1-888-714-7264</p>
        </CinematicReveal>
      </div>
    </section>
  )
}

/* ═══════════════ HOME PAGE ═══════════════ */
export default function Home({ preloaderDone }: { preloaderDone: boolean }) {
  return (
    <main>
      <HeroSection preloaderDone={preloaderDone} />
      <TrustedClients />
      <AboutSection />
      <StatsBanner />
      <FoamCleanSection />
      <ServicesShowcase />
      <WhyChooseUs />
      <ContactCTA />
    </main>
  )
}
