import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CheckCircle,
  ChevronDown,
  Building2,
  Beef,
  Milk,
  Sprout,
} from 'lucide-react'
import SplitText from '../components/SplitText'
import CinematicReveal, { ParallaxLayer } from '../components/CinematicReveal'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════ HERO SECTION ═══════════════ */
function HeroSection({ preloaderDone }: { preloaderDone: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollIndRef = useRef<HTMLDivElement>(null)

  // Mouse-driven parallax on video
  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    if (!hero || !video) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(video, {
        x: x * 30,
        y: y * 20,
        scale: 1.1,
        duration: 1.2,
        ease: 'power2.out',
      })

      // Subtle content parallax (opposite direction)
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          x: x * -10,
          y: y * -6,
          duration: 1.2,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(video, { x: 0, y: 0, scale: 1, duration: 1.5, ease: 'power2.out' })
      if (contentRef.current) {
        gsap.to(contentRef.current, { x: 0, y: 0, duration: 1.5, ease: 'power2.out' })
      }
    }

    hero.addEventListener('mousemove', handleMouseMove)
    hero.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove)
      hero.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Entrance animation after preloader
  useEffect(() => {
    if (!preloaderDone) return

    const tl = gsap.timeline()

    tl.fromTo('.hero-caption',
      { opacity: 0, y: 20, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-headline-char',
      { y: '120%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.2, stagger: 0.02, ease: 'power4.out' },
      '-=0.5'
    )
    .fromTo('.hero-sub',
      { opacity: 0, y: 30, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
      '-=0.7'
    )
    .fromTo('.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-trust',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.4'
    )
    .fromTo(scrollIndRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.3'
    )

    return () => { tl.kill() }
  }, [preloaderDone])

  const carouselItems = [
    'Food Plant Sanitation',
    'UV Disinfection',
    '24/7 Emergency Response',
    'Health Canada Certified',
    '15+ Years Experience',
  ]

  const headlineText = 'PROFESSIONAL SANITATION SERVICES'

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center"
      style={{ perspective: '1000px' }}
    >
      {/* Video Background with mouse parallax */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-[-5%] w-[110%] h-[110%] object-cover z-0 will-change-transform"
        poster="/images/service-food-plant.jpg"
      >
        <source src="/videos/hero-sanitation.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay with depth */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,22,40,0.5) 0%, rgba(10,22,40,0.75) 50%, rgba(10,22,40,0.95) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,22,40,0.6) 100%)',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 content-max pt-24 pb-40 will-change-transform"
      >
        <div className="max-w-[680px]">
          {/* Caption */}
          <p
            className="hero-caption caption-style mb-6 opacity-0"
            style={{ letterSpacing: '0.25em' }}
          >
            Hamilton, Ontario • Since 2009
          </p>

          {/* Headline with character split */}
          <h1 className="text-[clamp(32px,5.5vw,72px)] font-light uppercase tracking-[0.08em] leading-[1.05] text-[#F0F4F8] text-glow mb-2">
            {headlineText.split('').map((char, i) => (
              <span
                key={i}
                className="hero-headline-char inline-block overflow-hidden"
                style={{ opacity: 0 }}
              >
                <span className="inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              </span>
            ))}
          </h1>

          {/* Subheadline with blur reveal */}
          <p
            className="hero-sub mt-6 text-lg md:text-xl text-[#8BA3BE] max-w-[520px] leading-relaxed opacity-0"
          >
            Top-of-the-line sanitation services specializing in all federal and provincial food plants with over 15 years of experience in the food industry.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta mt-10 flex flex-wrap gap-4 opacity-0">
            <Link
              to="/contact"
              className="group relative px-9 py-4 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(46,143,212,0.4)]"
            >
              <span className="relative z-10">Contact Us</span>
              <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
            <Link
              to="/services"
              className="px-9 py-4 border border-[#1E3A5F] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded transition-all duration-500 hover:border-[#2E8FD4] hover:bg-[rgba(46,143,212,0.08)] hover:shadow-[0_0_30px_rgba(46,143,212,0.15)]"
            >
              Our Services
            </Link>
          </div>

          {/* Trust badges */}
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

      {/* Horizontal Text Carousel */}
      <div className="absolute bottom-28 left-0 right-0 z-10 overflow-hidden opacity-40">
        <div className="flex w-max animate-scroll-left">
          {[...carouselItems, ...carouselItems].map((item, i) => (
            <span key={i} className="flex items-center shrink-0 px-[2vw]">
              <span className="text-[clamp(28px,8vw,120px)] font-bold uppercase text-[#F0F4F8]/[0.04] whitespace-nowrap">
                {item}
              </span>
              <span className="mx-[2vw] text-[#2E8FD4]/20 text-lg">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8BA3BE]">Scroll</span>
          <ChevronDown size={20} className="text-[#8BA3BE] animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 35s linear infinite;
        }
      `}</style>
    </section>
  )
}

/* ═══════════════ STATS BANNER ═══════════════ */
function StatsBanner() {
  const statsRef = useRef<HTMLDivElement>(null)

  const stats = [
    { target: 15, suffix: '+', label: 'Years Experience', desc: 'Serving Ontario since 2009' },
    { target: 99.9, suffix: '%', decimals: 1, label: 'Sterilization Rate', desc: 'Using UV and OZONE technology' },
    { target: 200, suffix: '+', label: 'Clients Served', desc: 'Across Ontario food processing' },
    { target: 24, suffix: '/7', label: 'Emergency Service', desc: 'Always available when needed' },
  ]

  useEffect(() => {
    const el = statsRef.current
    if (!el) return

    const cards = el.querySelectorAll('.stat-card')
    const numbers = el.querySelectorAll('.stat-number')

    gsap.set(cards, { opacity: 0, y: 50, filter: 'blur(6px)' })

    // Blur-to-focus entrance
    const tween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    // Counter animation
    stats.forEach(({ target, decimals = 0 }, i) => {
      const numEl = numbers[i]
      if (!numEl) return
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
        onUpdate: () => {
          const val = decimals ? obj.val.toFixed(decimals) : Math.round(obj.val)
          const suffix = stats[i].suffix
          numEl.textContent = String(val) + suffix
        },
      })
    })

    return () => { tween.kill() }
  }, [])

  return (
    <section className="w-full border-t border-[#1E3A5F] bg-[#0A1628]">
      <div ref={statsRef} className="content-max py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center">
              <div className="stat-number text-[clamp(36px,4vw,56px)] font-light text-[#D4AF37] gold-glow" />
              <p className="mt-2 text-lg md:text-xl font-medium text-[#F0F4F8]">{stat.label}</p>
              <p className="mt-1 text-sm text-[#8BA3BE]">{stat.desc}</p>
            </div>
          ))}
          <div className="hidden lg:block absolute top-4 bottom-4 left-[25%] w-px bg-[#1E3A5F]/50" />
          <div className="hidden lg:block absolute top-4 bottom-4 left-[50%] w-px bg-[#1E3A5F]/50" />
          <div className="hidden lg:block absolute top-4 bottom-4 left-[75%] w-px bg-[#1E3A5F]/50" />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ ABOUT SECTION ═══════════════ */
function AboutSection() {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = imageRef.current
    if (!el) return

    // Parallax on image
    const tween = gsap.to(el, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    return () => { tween.kill() }
  }, [])

  return (
    <section className="w-full bg-[#0A1628] section-padding overflow-hidden">
      <div className="content-max">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
          {/* Left - Text */}
          <CinematicReveal type="fade-left" duration={1.4}>
            <div>
              <p className="caption-style mb-4">About SaniXperts</p>

              <SplitText
                text="Sanitation Services Based in Ontario, Canada"
                as="h2"
                className="text-[clamp(28px,3.5vw,48px)] font-normal leading-[1.15] text-[#F0F4F8]"
                type="chars"
                animation="reveal-up"
                stagger={0.015}
                duration={0.8}
                scrollTrigger
                scrollStart="top 75%"
              />

              <CinematicReveal type="blur-focus" delay={0.3} duration={1.2}>
                <p className="mt-6 text-base text-[#8BA3BE] leading-relaxed">
                  SaniXperts Inc. offers professional sanitation services in the southern parts of Ontario, Canada. We have more than 15 years of experience in the commercial sanitation industry, specializing in all federal and provincial food plants. We provide excellent services to clients, and we are proud that we have grown fundamentally through referrals.
                </p>
              </CinematicReveal>

              <CinematicReveal type="blur-focus" delay={0.5} duration={1.2}>
                <p className="mt-4 text-base text-[#8BA3BE] leading-relaxed">
                  We ensure prestige results in our services and adhere to all standards of compliance in exceeding our clients' expectations. Sanixperts Inc. has the knowledge and expertise you can rely on for all your sanitation needs.
                </p>
              </CinematicReveal>

              <CinematicReveal type="fade-up" delay={0.6}>
                <Link
                  to="/"
                  className="inline-block mt-6 text-sm font-medium text-[#2E8FD4] group"
                >
                  <span className="relative">
                    Learn More
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#2E8FD4] transition-all duration-300 group-hover:w-full" />
                  </span>
                  <span className="ml-1">→</span>
                </Link>
              </CinematicReveal>
            </div>
          </CinematicReveal>

          {/* Right - Image with parallax */}
          <CinematicReveal type="fade-right" duration={1.4}>
            <div className="relative">
              <div
                ref={imageRef}
                className="relative rounded-xl overflow-hidden will-change-transform"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}
              >
                <img
                  src="/images/about-team.jpg"
                  alt="SaniXperts sanitation team inspecting food processing equipment"
                  className="w-full object-cover"
                  loading="lazy"
                />
                {/* Subtle blue overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(46,143,212,0.08) 0%, transparent 60%)' }}
                />
              </div>

              {/* Floating stat card */}
              <CinematicReveal
                type="scale-up"
                delay={0.8}
                className="absolute -bottom-6 -left-6"
              >
                <div className="glass-panel rounded-lg px-6 py-5 border border-[#1E3A5F]/50">
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
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 100}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => { scrollTween.kill() }
    })

    return () => { mm.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#0F1D32] section-padding">
      {/* Header */}
      <div className="content-max mb-16 md:mb-20 text-center">
        <CinematicReveal type="blur-focus">
          <p className="caption-style mb-4">What We Do</p>
          <SplitText
            text="Comprehensive Sanitation Solutions"
            as="h2"
            className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
            type="chars"
            animation="reveal-up"
            stagger={0.012}
            duration={0.8}
            scrollTrigger
          />
          <CinematicReveal type="blur-focus" delay={0.3}>
            <p className="mt-4 text-base text-[#8BA3BE] max-w-[560px] mx-auto">
              From food plant sanitation to emergency disinfecting, we deliver excellence at every level.
            </p>
          </CinematicReveal>
        </CinematicReveal>
      </div>

      {/* Horizontal Track with 3D perspective */}
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row gap-6 md:gap-10 px-6 md:px-0 md:pl-8 md:w-max"
        style={{ perspective: '1200px' }}
      >
        {services.map((service) => (
          <div
            key={service.num}
            className="group relative w-full md:w-[400px] h-[350px] md:h-[500px] rounded-xl overflow-hidden border border-[#1E3A5F]/60 shrink-0"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = (e.clientX - rect.left) / rect.width - 0.5
              const y = (e.clientY - rect.top) / rect.height - 0.5
              e.currentTarget.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateY(0) rotateX(0) translateZ(0)'
            }}
          >
            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.4) 50%, rgba(10,22,40,0.15) 100%)',
              }}
            />
            {/* Blue glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 100%, rgba(46,143,212,0.15) 0%, transparent 60%)',
              }}
            />
            <span className="absolute top-4 right-4 text-[80px] md:text-[120px] font-extralight text-white/[0.04] leading-none select-none">
              {service.num}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-medium text-[#F0F4F8] mb-2">
                {service.title}
              </h3>
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
    { title: 'Expertise in Facility Maintenance', desc: 'Deep knowledge of food processing equipment and facility requirements.' },
    { title: 'Superior Food Safety Solutions', desc: 'Health Canada certified products and procedures that exceed industry standards.' },
    { title: 'Honesty & Integrity', desc: 'Transparent operations and documentation for all sanitation activities.' },
    { title: 'Responsibility & Accountability', desc: 'Full ownership of sanitation programs with documented checklists and validation.' },
    { title: 'Safety Standard Compliance', desc: 'BRC, USDA (FSA), and third-party audit compliance with complete integrity.' },
    { title: 'Trained Employees', desc: 'Continuous training and certification in the latest sanitation techniques and safety protocols.' },
    { title: 'Service Excellence', desc: 'Dedication to renewal and continuous improvement in all sanitation processes.' },
  ]

  const indentations = [0, 20, 40, 20, 40, 20, 0]

  return (
    <section className="w-full bg-[#0A1628] section-padding overflow-hidden">
      <div className="content-max">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Image with parallax */}
          <ParallaxLayer speed={0.3}>
            <CinematicReveal type="clip-reveal-left" duration={1.6}>
              <div className="lg:sticky lg:top-32 rounded-xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <img
                  src="/images/process-inspection.jpg"
                  alt="Sanitation supervisor inspecting equipment"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </CinematicReveal>
          </ParallaxLayer>

          {/* Right - Features with staggered cinematic reveals */}
          <div>
            <CinematicReveal type="blur-focus">
              <p className="caption-style mb-4">Our Advantage</p>
              <SplitText
                text="Why Choose SaniXperts"
                as="h2"
                className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8] mb-12"
                type="chars"
                animation="reveal-up"
                stagger={0.01}
                duration={0.6}
                scrollTrigger
              />
            </CinematicReveal>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <CinematicReveal
                  key={i}
                  type="fade-right"
                  delay={i * 0.08}
                  duration={0.9}
                >
                  <div
                    className="flex gap-5"
                    style={{ paddingLeft: `${indentations[i]}px` }}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-[#162544] border border-[#1E3A5F] flex items-center justify-center transition-all duration-300 hover:border-[#2E8FD4] hover:shadow-[0_0_15px_rgba(46,143,212,0.2)]">
                      <CheckCircle size={18} className="text-[#2E8FD4]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#F0F4F8]">{feature.title}</h3>
                      <p className="mt-1 text-sm text-[#8BA3BE]">{feature.desc}</p>
                    </div>
                  </div>
                </CinematicReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════ PROCESS SECTION ═══════════════ */
function ProcessSection() {
  const steps = [
    'Inspection', 'Dry Pick', 'Pre-Rinse', 'Self-Inspection',
    'Apply Chemical', 'Condensation', 'Pre-Op', 'Sanitizing', 'Validation',
  ]

  return (
    <section className="w-full bg-[#0F1D32] section-padding">
      <div className="content-max">
        <div className="text-center mb-16 md:mb-20">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Our Process</p>
            <SplitText
              text="Nine Steps to Sanitary"
              as="h2"
              className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
              type="chars"
              animation="reveal-up"
              stagger={0.012}
              duration={0.8}
              scrollTrigger
            />
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
                    <span className="text-sm md:text-base font-medium text-[#8BA3BE] group-hover:text-[#2E8FD4] transition-colors">
                      {i + 1}
                    </span>
                    {/* Pulse ring on hover */}
                    <div className="absolute inset-0 rounded-full border border-[#2E8FD4] opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDuration: '1.5s' }} />
                  </div>
                  <span className="mt-3 text-[10px] md:text-xs uppercase tracking-wider text-[#8BA3BE] group-hover:text-[#F0F4F8] transition-colors">
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block w-6 lg:w-10 h-px bg-[#1E3A5F]/60 mx-1 lg:mx-2" />
                )}
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
    <section className="w-full bg-[#0A1628] section-padding">
      <div className="content-max">
        <div className="text-center mb-16 md:mb-20">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Who We Serve</p>
            <SplitText
              text="Industries We Specialize In"
              as="h2"
              className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
              type="chars"
              animation="reveal-up"
              stagger={0.012}
              duration={0.8}
              scrollTrigger
            />
          </CinematicReveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, i) => {
            const Icon = industry.icon
            return (
              <CinematicReveal
                key={i}
                type="depth-parallax"
                delay={i * 0.12}
                duration={1}
              >
                <div className="group bg-[#0F1D32] border border-[#1E3A5F]/60 rounded-xl p-8 md:p-10 h-full transition-all duration-500 hover:-translate-y-2 hover:border-[#2E8FD4]/40 hover:shadow-[0_20px_60px_rgba(46,143,212,0.1)]">
                  <div className="transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                    <Icon
                      size={48}
                      className="text-[#2E8FD4] transition-colors duration-500 group-hover:text-[#4DB8FF]"
                      strokeWidth={1.5}
                    />
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
  const techList = [
    'Electrostatic Sprayer Technology',
    'UV Light Disinfection Systems',
    'OZONE Generation Equipment',
    'Health Canada Certified Products',
  ]

  return (
    <section className="w-full bg-[#0F1D32] section-padding overflow-hidden">
      <div className="content-max">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 items-center">
          {/* Left */}
          <CinematicReveal type="fade-left" duration={1.4}>
            <div>
              <p className="caption-style mb-4">Advanced Technology</p>
              <SplitText
                text="Cutting-Edge Disinfecting Solutions"
                as="h2"
                className="text-[clamp(28px,3.5vw,48px)] font-normal leading-[1.15] text-[#F0F4F8]"
                type="chars"
                animation="reveal-up"
                stagger={0.015}
                duration={0.7}
                scrollTrigger
              />
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
                <Link
                  to="/services"
                  className="inline-block mt-8 text-sm font-medium text-[#2E8FD4] group"
                >
                  <span className="relative">
                    Learn About Our Technology
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#2E8FD4] transition-all duration-300 group-hover:w-full" />
                  </span>
                  <span className="ml-1">→</span>
                </Link>
              </CinematicReveal>
            </div>
          </CinematicReveal>

          {/* Right - Image with depth */}
          <CinematicReveal type="fade-right" duration={1.4}>
            <div className="relative">
              <ParallaxLayer speed={0.2}>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    boxShadow: '0 0 60px rgba(46,143,212,0.15), 0 30px 80px rgba(0,0,0,0.3)',
                  }}
                >
                  <img
                    src="/images/service-uv.jpg"
                    alt="UV sterilization technology"
                    className="w-full"
                    loading="lazy"
                  />
                </div>
              </ParallaxLayer>

              {/* Tech badge with glow */}
              <CinematicReveal type="scale-up" delay={0.6} className="absolute -top-4 -right-4">
                <div
                  className="glass-panel rounded-lg px-5 py-3 border border-[#D4AF37]/30"
                  style={{ boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}
                >
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
    <section
      className="w-full py-24 md:py-32 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #0A1628 0%, #0F1D32 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(46,143,212,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="content-max relative z-10">
        <SplitText
          text="Ready to Elevate Your Sanitation Standards?"
          as="h2"
          className="text-[clamp(28px,3.5vw,48px)] font-normal text-[#F0F4F8]"
          type="words"
          animation="fade-blur"
          stagger={0.04}
          duration={0.8}
          scrollTrigger
        />

        <CinematicReveal type="blur-focus" delay={0.3} duration={1.2}>
          <p className="mt-6 text-base text-[#8BA3BE] max-w-[600px] mx-auto">
            Contact us today for a free consultation and discover why Ontario's leading food plants trust SaniXperts.
          </p>
        </CinematicReveal>

        <CinematicReveal type="scale-up" delay={0.5}>
          <Link
            to="/contact"
            className="group relative inline-block mt-10 px-14 py-5 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded overflow-hidden transition-shadow duration-500 hover:shadow-[0_12px_50px_rgba(46,143,212,0.4)]"
          >
            <span className="relative z-10">Get in Touch</span>
            <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </CinematicReveal>

        <CinematicReveal type="fade-up" delay={0.7}>
          <p className="mt-8 text-xl font-medium text-[#D4AF37] gold-glow">
            1-888-714-7264
          </p>
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
