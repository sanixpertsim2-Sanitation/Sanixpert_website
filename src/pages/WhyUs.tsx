import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../components/SplitText'
import CinematicReveal from '../components/CinematicReveal'

gsap.registerPlugin(ScrollTrigger)

const advantages = [
  { num: '01', title: 'High-Quality, Efficient Service', description: 'We deliver results that exceed expectations on every visit. Our teams work efficiently without compromising thoroughness, minimizing downtime for your facility.' },
  { num: '02', title: 'Raised Standards', description: 'We set the operational bar higher than industry norms. Our internal quality benchmarks exceed regulatory requirements, giving you confidence in every clean.' },
  { num: '03', title: 'Client Relationships', description: 'We work side by side with your team to achieve hygiene goals. We build and maintain strong relationships, functioning as an extension of your operations.' },
  { num: '04', title: 'Trained Professionals', description: 'Continuous training and certification in the latest sanitation techniques. Our employees are experts in facility maintenance and food safety protocols.' },
  { num: '05', title: 'Safety Compliance', description: 'Full adherence to BRC, USDA (FSA), and all third-party audit standards. We document everything with complete integrity for your compliance needs.' },
  { num: '06', title: 'Advanced Technology', description: 'UV, OZONE, and electrostatic spraying capabilities that set us apart. We invest in the latest equipment to deliver superior results.' },
  { num: '07', title: '24/7 Availability', description: 'Emergency response when you need it most. Our rapid deployment team is always on standby for urgent sanitation needs across Ontario.', fullWidth: true },
]

const nineSteps = [
  { title: 'Inspection & Identification', description: 'Equipment breakdown and covering all sensitive components. We begin by thoroughly inspecting all equipment, identifying areas requiring special attention, and protecting sensitive electrical components.' },
  { title: 'Dry Pick', description: 'Remove all loose soils, debris, and product residue from surfaces and equipment. This physical removal step is critical for effective subsequent cleaning stages.' },
  { title: 'Pre-Rinse', description: 'Initial water rinse to remove remaining residues and prepare surfaces for chemical application. Temperature and pressure are carefully controlled for optimal results.' },
  { title: 'Self-Inspection', description: 'Team verification of pre-clean status before chemical application. Our supervisors inspect every surface to ensure proper preparation for the sanitizing phase.' },
  { title: 'Apply Chemical', description: 'Targeted application of cleaning agents selected for your specific equipment and soils. We use only Health Canada certified products at the correct concentration and temperature.' },
  { title: 'Condensation Removal', description: 'Address all moisture and condensation points that could harbor microbial growth. Proper drying prevents recontamination and ensures sanitizer effectiveness.' },
  { title: 'Pre-Op Inspection', description: 'Verify all equipment is clean, reassembled correctly, and ready for operation. Our checklist ensures nothing is missed before the final sanitizing step.' },
  { title: 'Sanitizing', description: 'Apply sanitizer to all food-contact surfaces at the correct concentration and contact time. This critical step eliminates remaining microorganisms to safe levels.' },
  { title: 'Validation', description: 'Final inspection and documentation for audit compliance. We complete all required checklists, take ATP readings where applicable, and sign off on the sanitation record.' },
]

function NineStepsAccordion() {
  const [openIndex, setOpenIndex] = useState(0)
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([])
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  const togglePanel = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      const content = contentRefs.current[i]
      if (!panel || !content) return
      if (i === openIndex) {
        gsap.to(content, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out' })
        panel.classList.add('bg-[#162544]', 'border-l-[3px]', 'border-l-[#2E8FD4]')
      } else {
        gsap.to(content, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in' })
        panel.classList.remove('bg-[#162544]', 'border-l-[3px]', 'border-l-[#2E8FD4]')
      }
    })
  }, [openIndex])

  return (
    <div className="max-w-[900px] mx-auto border-t border-[#1E3A5F]">
      {nineSteps.map((step, i) => (
        <div key={i} className="border-b border-[#1E3A5F]">
          <button
            ref={(el) => { panelRefs.current[i] = el as HTMLButtonElement | null }}
            onClick={() => togglePanel(i)}
            className="w-full flex items-center justify-between py-5 px-4 md:px-6 text-left transition-all duration-400 cursor-pointer rounded group"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <span className="text-2xl md:text-3xl font-light text-[#D4AF37] w-12 transition-all duration-300 group-hover:gold-glow">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-lg md:text-xl font-medium text-[#F0F4F8] group-hover:text-[#2E8FD4] transition-colors">{step.title}</span>
            </div>
            <ChevronDown size={20} className={`text-[#8BA3BE] transition-transform duration-400 shrink-0 ${openIndex === i ? 'rotate-180 text-[#2E8FD4]' : ''}`} />
          </button>
          <div
            ref={(el) => { contentRefs.current[i] = el }}
            className="overflow-hidden"
            style={{ height: i === 0 ? 'auto' : 0, opacity: i === 0 ? 1 : 0 }}
          >
            <div className="pb-6 px-4 md:px-6 pl-16 md:pl-[84px]">
              <p className="text-[#8BA3BE] leading-relaxed">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function WhyUs() {
  return (
    <main>
      {/* Page Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0 bg-[#0F1D32]" />
        <div className="absolute inset-0 opacity-15 scale-110"
          style={{ backgroundImage: 'url(/images/industry-poultry.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#0A1628]/70 to-[#0A1628]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.2) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 content-max text-center py-32">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Why SaniXperts</p>
            <SplitText
              text="The SaniXperts Advantage"
              as="h1"
              className="text-[clamp(32px,4vw,48px)] font-normal text-[#F0F4F8]"
              type="chars"
              animation="reveal-up"
              stagger={0.015}
              duration={1}
            />
          </CinematicReveal>
          <CinematicReveal type="blur-focus" delay={0.4}>
            <p className="mt-6 text-base text-[#8BA3BE] max-w-[600px] mx-auto">
              Discover why Ontario's leading food processing facilities choose SaniXperts for their sanitation needs.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* Advantages */}
      <section className="w-full bg-[#0F1D32] section-padding">
        <div className="content-max">
          <div className="text-center mb-16">
            <SplitText
              text="What Sets Us Apart"
              as="h2"
              className="text-[clamp(28px,3vw,40px)] font-normal text-[#F0F4F8]"
              type="chars"
              animation="reveal-up"
              stagger={0.02}
              duration={0.8}
              scrollTrigger
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
            {advantages.map((adv, i) => (
              <CinematicReveal key={i} type="depth-parallax" delay={i * 0.1} duration={1} className={adv.fullWidth ? 'sm:col-span-2' : ''}>
                <div className="relative bg-[#0A1628] border border-[#1E3A5F]/50 rounded-xl p-8 md:p-10 h-full group transition-all duration-500 hover:border-[#2E8FD4]/30 hover:shadow-[0_10px_40px_rgba(46,143,212,0.06)]">
                  <span className="absolute top-4 right-4 text-[48px] md:text-[64px] font-extralight text-[#D4AF37]/20 leading-none select-none group-hover:text-[#D4AF37]/30 transition-colors">
                    {adv.num}
                  </span>
                  <h3 className="text-xl md:text-2xl font-medium text-[#F0F4F8]">{adv.title}</h3>
                  <p className="mt-3 text-[#8BA3BE] leading-relaxed">{adv.description}</p>
                </div>
              </CinematicReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nine Steps Detail */}
      <section className="w-full bg-[#0A1628] section-padding">
        <div className="content-max">
          <div className="text-center mb-12 md:mb-16">
            <CinematicReveal type="blur-focus">
              <p className="caption-style mb-4">Our Process</p>
              <SplitText
                text="The Nine Steps to Sanitary"
                as="h2"
                className="text-[clamp(28px,3vw,40px)] font-normal text-[#F0F4F8]"
                type="chars"
                animation="reveal-up"
                stagger={0.015}
                duration={0.8}
                scrollTrigger
              />
            </CinematicReveal>
          </div>

          <CinematicReveal type="fade-up" duration={1.2}>
            <NineStepsAccordion />
          </CinematicReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 md:py-32 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #0A1628 0%, #0F1D32 100%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.15) 0%, transparent 70%)' }}
        />
        <div className="content-max relative z-10">
          <SplitText
            text="Experience the SaniXperts Difference"
            as="h2"
            className="text-[clamp(28px,3vw,40px)] font-normal text-[#F0F4F8]"
            type="words"
            animation="fade-blur"
            stagger={0.04}
            duration={0.8}
            scrollTrigger
          />
          <CinematicReveal type="blur-focus" delay={0.3}>
            <p className="mt-6 text-base text-[#8BA3BE] max-w-[600px] mx-auto">
              Contact us today to learn how our nine-step process can elevate your facility's sanitation standards.
            </p>
          </CinematicReveal>
          <CinematicReveal type="scale-up" delay={0.5}>
            <Link
              to="/contact"
              className="group relative inline-block mt-10 px-12 py-5 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(46,143,212,0.35)]"
            >
              <span className="relative z-10">Contact Us</span>
              <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </CinematicReveal>
        </div>
      </section>
    </main>
  )
}
