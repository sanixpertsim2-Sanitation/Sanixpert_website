import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ChevronDown,
  Building2,
  Beef,
  Milk,
  Sprout,
  ShieldCheck,
  Sparkles,
  Zap,
  Users,
  Award,
  TrendingUp,
  Target,
  Clock,
  Phone,
} from 'lucide-react'
import SplitText from '../components/SplitText'
import CinematicReveal, { ParallaxLayer } from '../components/CinematicReveal'
import ParticleNetwork from '../components/ParticleNetwork'
import TrustedBy from '../components/TrustedBy'
import FloatingOrbs from '../components/FloatingOrbs'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════ HERO SECTION ═══════════════ */
function HeroSection({ preloaderDone }: { preloaderDone: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    if (!hero || !video) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(video, { x: x * 20, y: y * 15, scale: 1.08, duration: 1.5, ease: 'power2.out' })
      if (contentRef.current) {
        gsap.to(contentRef.current, { x: x * -8, y: y * -5, duration: 1.5, ease: 'power2.out' })
      }
    }
    const handleMouseLeave = () => {
      gsap.to(video, { x: 0, y: 0, scale: 1, duration: 2, ease: 'power2.out' })
      if (contentRef.current) gsap.to(contentRef.current, { x: 0, y: 0, duration: 2, ease: 'power2.out' })
    }
    hero.addEventListener('mousemove', handleMouseMove)
    hero.addEventListener('mouseleave', handleMouseLeave)
    return () => { hero.removeEventListener('mousemove', handleMouseMove); hero.removeEventListener('mouseleave', handleMouseLeave) }
  }, [])

  useEffect(() => {
    if (!preloaderDone) return
    const tl = gsap.timeline()
    tl.fromTo('.hero-caption', { opacity: 0, y: 20, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' })
      .fromTo('.hero-headline-char', { y: '120%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.02, ease: 'power4.out' }, '-=0.5')
      .fromTo('.hero-sub', { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, '-=0.7')
      .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-trust', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.4')
    return () => { tl.kill() }
  }, [preloaderDone])

  const headlineText = 'PROFESSIONAL SANITATION SERVICES'

  return (
    <section ref={heroRef} className="relative w-full min-h-[100dvh] overflow-hidden flex items-center" style={{ perspective: '1000px' }}>
      {/* Video Background */}
      <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-[-5%] w-[110%] h-[110%] object-cover z-0 will-change-transform" poster="/images/service-food-plant.jpg">
        <source src="/videos/hero-team-cinematic.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay with depth */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(6,13,26,0.4) 0%, rgba(6,13,26,0.75) 50%, rgba(6,13,26,0.95) 100%)' }} />

      {/* Particle network overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-auto">
        <ParticleNetwork particleCount={60} connectionDistance={120} maxSpeed={0.3} />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(6,13,26,0.5) 100%)' }} />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 content-max pt-24 pb-40 will-change-transform">
        <div className="max-w-[680px]">
          <p className="hero-caption caption-style mb-6 opacity-0" style={{ letterSpacing: '0.25em' }}>
            <Sparkles size={14} className="inline mr-2 -mt-0.5" />
            Hamilton, Ontario • Trusted Since 2009
          </p>

          <h1 className="text-[clamp(32px,5.5vw,72px)] font-light uppercase tracking-[0.08em] leading-[1.05] text-[#F0F4F8] text-glow-strong mb-2">
            {headlineText.split('').map((char, i) => (
              <span key={i} className="hero-headline-char inline-block overflow-hidden" style={{ opacity: 0 }}>
                <span className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-6 text-lg md:text-xl text-[#8BA3BE]/90 max-w-[520px] leading-relaxed opacity-0">
            Serving Ferrero, Give & GO Bakery, Bimbo Bakery & ATB Farms with industry-leading sanitation across Ontario.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap gap-4 opacity-0">
            <Link to="/contact" className="group relative px-9 py-4 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(46,143,212,0.5)]">
              <span className="relative z-10 flex items-center gap-2">
                <Phone size={16} /> Contact Us
              </span>
              <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
            <Link to="/services" className="px-9 py-4 border border-[#1E3A5F] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded-lg transition-all duration-500 hover:border-[#2E8FD4] hover:bg-[rgba(46,143,212,0.08)] hover:shadow-[0_0_30px_rgba(46,143,212,0.15)]">
              Our Services
            </Link>
          </div>

          <div className="hero-trust mt-10 flex flex-wrap items-center gap-5 opacity-0">
            {['15+ Years', 'Health Canada Certified', 'BRC & USDA Compliant'].map((badge, i) => (
              <span key={badge} className="flex items-center gap-5">
                <span className="text-xs uppercase tracking-[0.15em] text-[#8BA3BE]">{badge}</span>
                {i < 2 && <span className="w-1 h-1 rounded-full bg-[#2E8FD4]" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8BA3BE]">Scroll</span>
          <ChevronDown size={20} className="text-[#8BA3BE] animate-bounce" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ TRUSTED BY CLIENTS ═══════════════ */
function TrustedClients() {
  return <TrustedBy />
}

/* ═══════════════ STATS BANNER ═══════════════ */
function StatsBanner() {
  const statsRef = useRef<HTMLDivElement>(null)

  const stats = [
    { target: 15, suffix: '+', label: 'Years Experience', desc: 'Serving Ontario since 2009' },
    { target: 99.9, suffix: '%', decimals: 1, label: 'Sterilization Rate', desc: 'UV and OZONE technology' },
    { target: 200, suffix: '+', label: 'Clients Served', desc: 'Food processing sector' },
    { target: 24, suffix: '/7', label: 'Emergency Service', desc: 'Always available' },
  ]

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const cards = el.querySelectorAll('.stat-card')
    const numbers = el.querySelectorAll('.stat-number')

    gsap.set(cards, { opacity: 0, y: 50, filter: 'blur(6px)' })
    const tween = gsap.to(cards, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.2, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    })

    stats.forEach(({ target, decimals = 0 }, i) => {
      const numEl = numbers[i]
      if (!numEl) return
      const obj = { val: 0 }
      gsap.to(obj, { val: target, duration: 2.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
        onUpdate: () => { numEl.textContent = (decimals ? obj.val.toFixed(decimals) : Math.round(obj.val)) + stats[i].suffix },
      })
    })
    return () => { tween.kill() }
  }, [])

  return (
    <section className="w-full border-t border-[#1E3A5F]/30 bg-[#060d1a] relative overflow-hidden">
      <FloatingOrbs />
      <div ref={statsRef} className="content-max py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center">
              <div className="stat-number text-[clamp(36px,4vw,56px)] font-light text-[#D4AF37] gold-glow" />
              <p className="mt-2 text-lg md:text-xl font-medium text-[#F0F4F8]">{stat.label}</p>
              <p className="mt-1 text-sm text-[#8BA3BE]">{stat.desc}</p>
            </div>
          ))}
          {[25, 50, 75].map(p => (
            <div key={p} className="hidden lg:block absolute top-4 bottom-4 left-[{p}%] w-px bg-[#1E3A5F]/30" style={{ left: `${p}%` }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ ABOUT SECTION ═══════════════ */
function AboutSection() {
  return (
    <section className="w-full section-padding relative overflow-hidden bg-mesh">
      <FloatingOrbs />
      <div className="content-max relative z-10">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
          {/* Left - Text */}
          <CinematicReveal type="fade-left" duration={1.4}>
            <div>
              <p className="caption-style mb-4">About SaniXperts</p>
              <SplitText text="Sanitation Services Based in Ontario, Canada" as="h2"
                className="text-[clamp(28px,3.5vw,48px)] font-normal leading-[1.15] text-[#F0F4F8]"
                type="chars" animation="reveal-up" stagger={0.015} duration={0.8} scrollTrigger scrollStart="top 75%" />
              <CinematicReveal type="blur-focus" delay={0.3} duration={1.2}>
                <p className="mt-6 text-base text-[#8BA3BE] leading-relaxed">
                  SaniXperts Inc. offers professional sanitation services in the southern parts of Ontario, Canada. We have more than 15 years of experience in the commercial sanitation industry, specializing in all federal and provincial food plants.
                </p>
              </CinematicReveal>
              <CinematicReveal type="blur-focus" delay={0.5} duration={1.2}>
                <p className="mt-4 text-base text-[#8BA3BE] leading-relaxed">
                  We proudly serve industry leaders including Ferrero Brantford, Give & GO Bakery, Bimbo Bakery, and ATB Farms — delivering prestige results that exceed compliance standards.
                </p>
              </CinematicReveal>
              {/* Mini client badges */}
              <CinematicReveal type="fade-up" delay={0.6}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {['Ferrero', 'Give & GO', 'Bimbo', 'ATB Farms'].map((client, i) => (
                    <span key={i} className="px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider border border-[#1E3A5F]/60 text-[#8BA3BE] bg-[#0e1d35]/50">
                      {client}
                    </span>
                  ))}
                </div>
              </CinematicReveal>
              <CinematicReveal type="fade-up" delay={0.7}>
                <Link to="/" className="inline-block mt-6 text-sm font-medium text-[#2E8FD4] group">
                  <span className="relative">Learn More <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#2E8FD4] transition-all duration-300 group-hover:w-full" /></span>
                  <span className="ml-1">→</span>
                </Link>
              </CinematicReveal>
            </div>
          </CinematicReveal>

          {/* Right - Video with parallax */}
          <CinematicReveal type="fade-right" duration={1.4}>
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden will-change-transform" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(46,143,212,0.1)' }}>
                <video autoPlay loop muted playsInline className="w-full object-cover" poster="/images/about-team.jpg">
                  <source src="/videos/hero-team-professional.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(46,143,212,0.1) 0%, transparent 60%)' }} />
              </div>
              <CinematicReveal type="scale-up" delay={0.8} className="absolute -bottom-6 -left-6">
                <div className="glass-panel-strong rounded-lg px-6 py-5">
                  <span className="text-3xl font-light text-[#D4AF37] gold-glow">15+</span>
                  <p className="text-sm text-[#F0F4F8] mt-1 leading-snug">Years of diverse<br />industry experience</p>
                </div>
              </CinematicReveal>
            </div>
          </CinematicReveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ SERVICES SHOWCASE ═══════════════ */
function ServicesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const services = [
    { num: '01', title: 'Food Plant Sanitation', desc: 'Complete sanitation solutions for federal and provincial food processing facilities ensuring full regulatory compliance.', image: '/images/service-food-plant.jpg' },
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
      const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 100}`, scrub: 1.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      })
      return () => { scrollTween.kill() }
    })
    return () => { mm.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="w-full section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #060d1a 0%, #0a1628 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <ParticleNetwork particleCount={40} connectionDistance={100} color="46,143,212" maxSpeed={0.2} />
      </div>
      <div className="content-max mb-16 md:mb-20 text-center relative z-10">
        <CinematicReveal type="blur-focus">
          <p className="caption-style mb-4">What We Do</p>
          <SplitText text="Comprehensive Sanitation Solutions" as="h2"
            className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
            type="chars" animation="reveal-up" stagger={0.012} duration={0.8} scrollTrigger />
          <CinematicReveal type="blur-focus" delay={0.3}>
            <p className="mt-4 text-base text-[#8BA3BE] max-w-[560px] mx-auto">
              From food plant sanitation to emergency disinfecting, we deliver excellence at every level.
            </p>
          </CinematicReveal>
        </CinematicReveal>
      </div>
      <div ref={trackRef} className="flex flex-col md:flex-row gap-6 md:gap-10 px-6 md:px-0 md:pl-8 md:w-max relative z-10" style={{ perspective: '1200px' }}>
        {services.map((service) => (
          <div key={service.num}
            className="group relative w-full md:w-[400px] h-[350px] md:h-[500px] rounded-xl overflow-hidden border border-[#1E3A5F]/60 shrink-0"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}
            onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)` }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateY(0) rotateX(0) translateZ(0)' }}>
            <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(6,13,26,0.95) 0%, rgba(6,13,26,0.4) 50%, rgba(6,13,26,0.15) 100%)' }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(46,143,212,0.15) 0%, transparent 60%)' }} />
            <span className="absolute top-4 right-4 text-[80px] md:text-[120px] font-extralight text-white/[0.04] leading-none select-none">{service.num}</span>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-medium text-[#F0F4F8] mb-2">{service.title}</h3>
              <p className="text-sm text-[#8BA3BE] max-w-[320px] leading-relaxed">{service.desc}</p>
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
    { icon: Users, title: 'Honesty & Integrity', desc: 'Transparent operations and documentation for all sanitation activities.' },
    { icon: Target, title: 'Responsibility & Accountability', desc: 'Full ownership of sanitation programs with documented checklists and validation.' },
    { icon: TrendingUp, title: 'Safety Standard Compliance', desc: 'BRC, USDA (FSA), and third-party audit compliance with complete integrity.' },
    { icon: Zap, title: 'Trained Employees', desc: 'Continuous training and certification in the latest sanitation techniques and safety protocols.' },
    { icon: Clock, title: 'Service Excellence', desc: 'Dedication to renewal and continuous improvement in all sanitation processes.' },
  ]

  const indentations = [0, 20, 40, 20, 40, 20, 0]

  return (
    <section className="w-full section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #060d1a 100%)' }}>
      <FloatingOrbs />
      <div className="content-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <ParallaxLayer speed={0.3}>
            <CinematicReveal type="clip-reveal-left" duration={1.6}>
              <div className="lg:sticky lg:top-32 rounded-xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(46,143,212,0.05)' }}>
                <img src="/images/process-inspection.jpg" alt="Sanitation supervisor inspecting equipment" className="w-full object-cover" loading="lazy" />
              </div>
            </CinematicReveal>
          </ParallaxLayer>
          <div>
            <CinematicReveal type="blur-focus">
              <p className="caption-style mb-4">Our Advantage</p>
              <SplitText text="Why Choose SaniXperts" as="h2"
                className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8] mb-12"
                type="chars" animation="reveal-up" stagger={0.01} duration={0.6} scrollTrigger />
            </CinematicReveal>
            <div className="space-y-8">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <CinematicReveal key={i} type="fade-right" delay={i * 0.08} duration={0.9}>
                    <div className="flex gap-5" style={{ paddingLeft: `${indentations[i]}px` }}>
                      <div className="shrink-0 w-10 h-10 rounded-full bg-[#162544] border border-[#1E3A5F] flex items-center justify-center transition-all duration-300 hover:border-[#2E8FD4] hover:shadow-[0_0_15px_rgba(46,143,212,0.2)]">
                        <Icon size={18} className="text-[#2E8FD4]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-[#F0F4F8]">{feature.title}</h3>
                        <p className="mt-1 text-sm text-[#8BA3BE]">{feature.desc}</p>
                      </div>
                    </div>
                  </CinematicReveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ PROCESS SECTION ═══════════════ */
function ProcessSection() {
  const steps = ['Inspection', 'Dry Pick', 'Pre-Rinse', 'Self-Inspection', 'Apply Chemical', 'Condensation', 'Pre-Op', 'Sanitizing', 'Validation']

  return (
    <section className="w-full section-padding relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0e1d35 50%, #060d1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <ParticleNetwork particleCount={35} connectionDistance={130} color="124,77,255" maxSpeed={0.25} />
      </div>
      <div className="content-max relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Our Process</p>
            <SplitText text="Nine Steps to Sanitary" as="h2"
              className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
              type="chars" animation="reveal-up" stagger={0.012} duration={0.8} scrollTrigger />
            <CinematicReveal type="blur-focus" delay={0.3}>
              <p className="mt-4 text-base text-[#8BA3BE] max-w-[600px] mx-auto">
                We follow a rigorous nine-step sanitation procedure to deliver immaculate results every time.
              </p>
            </CinematicReveal>
          </CinematicReveal>
        </div>
        <CinematicReveal type="scale-up" duration={1.2}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center text-center w-[90px] md:w-[120px] group cursor-default">
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center transition-all duration-500 group-hover:border-[#2E8FD4] group-hover:shadow-[0_0_25px_rgba(46,143,212,0.25)] group-hover:scale-110">
                    <span className="text-sm md:text-base font-medium text-[#8BA3BE] group-hover:text-[#2E8FD4] transition-colors">{i + 1}</span>
                    <div className="absolute inset-0 rounded-full border border-[#2E8FD4] opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDuration: '1.5s' }} />
                  </div>
                  <span className="mt-3 text-[10px] md:text-xs uppercase tracking-wider text-[#8BA3BE] group-hover:text-[#F0F4F8] transition-colors">{step}</span>
                </div>
                {i < steps.length - 1 && <div className="hidden md:block w-6 lg:w-10 h-px bg-[#1E3A5F]/60 mx-1 lg:mx-2" />}
              </div>
            ))}
          </div>
        </CinematicReveal>
      </div>
    </section>
  )
}

/* ═══════════════ INDUSTRIES SECTION ═══════════════ */
function IndustriesSection() {
  const industries = [
    { icon: Building2, title: 'Federal & Provincial Food Plants', desc: 'Full compliance sanitation for all federally and provincially regulated food processing facilities.' },
    { icon: Beef, title: 'Poultry & Meat Processing', desc: 'Specialized cleaning for poultry, pork, red meat, and RTE fully cooked processing facilities.' },
    { icon: Milk, title: 'Dairy & Bakery', desc: 'Sanitation solutions for dairy plants, bakeries, and prepared frozen food facilities.' },
    { icon: Sprout, title: 'Vertical Farming', desc: 'Innovative cleaning protocols for controlled environment agriculture facilities.' },
  ]

  return (
    <section className="w-full section-padding relative overflow-hidden bg-mesh">
      <FloatingOrbs />
      <div className="content-max relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Who We Serve</p>
            <SplitText text="Industries We Specialize In" as="h2"
              className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
              type="chars" animation="reveal-up" stagger={0.012} duration={0.8} scrollTrigger />
          </CinematicReveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, i) => {
            const Icon = industry.icon
            return (
              <CinematicReveal key={i} type="depth-parallax" delay={i * 0.12} duration={1}>
                <div className="group bg-[#0e1d35]/80 border border-[#1E3A5F]/50 rounded-xl p-8 md:p-10 h-full transition-all duration-500 hover:-translate-y-2 hover:border-[#2E8FD4]/30 hover:shadow-[0_20px_60px_rgba(46,143,212,0.08)]"
                  style={{ backdropFilter: 'blur(10px)' }}>
                  <div className="transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                    <Icon size={48} className="text-[#2E8FD4] transition-colors duration-500 group-hover:text-[#4DB8FF]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-[#F0F4F8]">{industry.title}</h3>
                  <p className="mt-3 text-sm text-[#8BA3BE] leading-relaxed">{industry.desc}</p>
                </div>
              </CinematicReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ TECHNOLOGY SECTION ═══════════════ */
function TechnologySection() {
  const techList = ['Electrostatic Sprayer Technology', 'UV Light Disinfection Systems', 'OZONE Generation Equipment', 'Health Canada Certified Products']

  return (
    <section className="w-full section-padding relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #060d1a 100%)' }}>
      <FloatingOrbs />
      <div className="content-max relative z-10">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 items-center">
          <CinematicReveal type="fade-left" duration={1.4}>
            <div>
              <p className="caption-style mb-4">Advanced Technology</p>
              <SplitText text="Cutting-Edge Disinfecting Solutions" as="h2"
                className="text-[clamp(28px,3.5vw,48px)] font-normal leading-[1.15] text-[#F0F4F8]"
                type="chars" animation="reveal-up" stagger={0.015} duration={0.7} scrollTrigger />
              <CinematicReveal type="blur-focus" delay={0.3} duration={1.2}>
                <p className="mt-6 text-base text-[#8BA3BE] leading-relaxed">
                  Our goals are to be cost effective, deliver the task on time, and ensure customer satisfaction. With our new Electrostatic Sprayer Gun, UV, and OZONE disinfectant, we go the extra mile to ensure the health and safety of your staff, space, and customers are achieved.
                </p>
              </CinematicReveal>
              <div className="mt-8 space-y-4">
                {techList.map((item, i) => (
                  <CinematicReveal key={i} type="fade-right" delay={0.4 + i * 0.1} duration={0.8}>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#2E8FD4] shrink-0 shadow-[0_0_8px_rgba(46,143,212,0.5)]" />
                      <span className="text-[#F0F4F8]">{item}</span>
                    </div>
                  </CinematicReveal>
                ))}
              </div>
              <CinematicReveal type="fade-up" delay={0.8}>
                <Link to="/services" className="inline-block mt-8 text-sm font-medium text-[#2E8FD4] group">
                  <span className="relative">Learn About Our Technology <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#2E8FD4] transition-all duration-300 group-hover:w-full" /></span>
                  <span className="ml-1">→</span>
                </Link>
              </CinematicReveal>
            </div>
          </CinematicReveal>
          <CinematicReveal type="fade-right" duration={1.4}>
            <div className="relative">
              <ParallaxLayer speed={0.2}>
                <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 0 60px rgba(46,143,212,0.15), 0 30px 80px rgba(0,0,0,0.4)' }}>
                  <img src="/images/service-uv.jpg" alt="UV sterilization technology" className="w-full" loading="lazy" />
                </div>
              </ParallaxLayer>
              <CinematicReveal type="scale-up" delay={0.6} className="absolute -top-4 -right-4">
                <div className="glass-panel-strong rounded-lg px-5 py-3 border border-[#D4AF37]/30" style={{ boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
                  <span className="text-2xl font-light text-[#D4AF37] gold-glow">99.9%</span>
                  <p className="text-xs uppercase tracking-wider text-[#F0F4F8]">Sterilization Rate</p>
                </div>
              </CinematicReveal>
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
    <section className="w-full py-24 md:py-32 text-center relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #060d1a 0%, #0e1d35 100%)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <ParticleNetwork particleCount={50} connectionDistance={140} color="212,175,55" maxSpeed={0.3} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.15) 0%, transparent 70%)' }} />
      <div className="content-max relative z-10">
        <SplitText text="Ready to Elevate Your Sanitation Standards?" as="h2"
          className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
          type="words" animation="fade-blur" stagger={0.04} duration={0.8} scrollTrigger />
        <CinematicReveal type="blur-focus" delay={0.3} duration={1.2}>
          <p className="mt-6 text-base text-[#8BA3BE] max-w-[600px] mx-auto">
            Join Ferrero, Give & GO, Bimbo Bakery and ATB Farms in trusting SaniXperts for your sanitation needs.
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
      <StatsBanner />
      <AboutSection />
      <ServicesShowcase />
      <WhyChooseUs />
      <ProcessSection />
      <IndustriesSection />
      <TechnologySection />
      <ContactCTA />
    </main>
  )
}
