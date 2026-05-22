import { Link } from 'react-router-dom'
import { Search, ClipboardList, Users, FileCheck } from 'lucide-react'
import SplitText from '../components/SplitText'
import CinematicReveal, { ParallaxLayer } from '../components/CinematicReveal'

const services = [
  {
    num: '01', category: 'Core Service', title: 'Food Plant Sanitation',
    description: 'Complete facility sanitation for federal and provincial food processing plants. We handle every aspect from equipment breakdown to final validation, ensuring your facility meets all regulatory requirements.',
    features: ['Equipment breakdown and reassembly', 'Chemical application and dwell time management', 'Full documentation for BRC and USDA audits', 'Pre-op inspection and validation'],
    image: '/images/service-food-plant.jpg', imageLeft: true,
  },
  {
    num: '02', category: 'Kitchen Deep Clean', title: 'Commercial Kitchen Equipment Cleaning',
    description: 'Specialized deep cleaning of commercial kitchen exhaust systems, hoods, fans, ducts, and all associated components. We clean to bare metal, significantly reducing fire hazards and ensuring compliance.',
    features: ['Hood and exhaust system cleaning to bare metal', 'Fan blade and ductwork degreasing', 'Fire suppression system protection during cleaning', 'Before and after photo documentation'],
    image: '/images/service-kitchen.jpg', imageLeft: false,
  },
  {
    num: '03', category: 'Industrial Facilities', title: 'Industrial Sanitation',
    description: 'Comprehensive cleaning services for manufacturing plants, warehouses, and industrial facilities. Our trained professionals meet all health and safety protocols while ensuring your facility maintains operational standards.',
    features: ['Production line and equipment sanitation', 'Floor and surface deep cleaning', 'Confined space entry and cleaning', 'Waste and debris removal'],
    image: '/images/service-industrial.jpg', imageLeft: true,
  },
  {
    num: '04', category: 'Advanced Technology', title: 'UV & Ozone Disinfection',
    description: 'Our advanced UV-C and ozone disinfection systems achieve a 99.9% sterilization rate. UV light terminates microbial DNA and RNA, while ozone penetrates hard-to-reach areas for complete sanitization.',
    features: ['UV-C light sterilization of all surfaces', 'Ozone generation for airborne and surface pathogens', '99.9% elimination of bacteria, viruses, and mold', 'Post-treatment air quality verification'],
    image: '/images/service-uv.jpg', imageLeft: false,
  },
  {
    num: '05', category: 'Complete Coverage', title: 'Electrostatic Spraying',
    description: 'State-of-the-art electrostatic sprayer technology that electrically charges disinfectant particles, causing them to wrap around surfaces for complete 360-degree coverage.',
    features: ['360-degree surface coverage', 'Reaches difficult and awkward areas', 'Uses Health Canada approved disinfectants', 'Ideal for large facilities and equipment'],
    image: '/images/service-electrostatic.jpg', imageLeft: true,
  },
  {
    num: '06', category: 'Always Available', title: 'Emergency Response',
    description: '24/7 emergency disinfecting services for contamination events, food recalls, and urgent sanitation needs. Our rapid response team can be deployed across Ontario with all necessary equipment.',
    features: ['24/7 availability across Ontario', 'Rapid deployment with full equipment', 'Contamination event response', 'Post-incident documentation and reporting'],
    image: '/images/service-emergency.jpg', imageLeft: false,
  },
]

const processSteps = [
  { icon: Search, title: 'Assessment', description: "We evaluate your facility's unique sanitation requirements and develop a tailored approach." },
  { icon: ClipboardList, title: 'Planning', description: 'We create a customized sanitation program, schedule, and resource allocation plan.' },
  { icon: Users, title: 'Execution', description: 'Our trained team delivers meticulous cleaning with real-time quality oversight.' },
  { icon: FileCheck, title: 'Documentation', description: 'Complete records for internal, third-party, BRC, and USDA regulatory audits.' },
]

export default function Services() {
  return (
    <main>
      {/* Page Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0 bg-[#0F1D32]" />
        <div
          className="absolute inset-0 opacity-20 scale-110"
          style={{
            backgroundImage: 'url(/images/service-food-plant.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#0A1628]/70 to-[#0A1628]" />

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.2) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 content-max text-center py-32">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Our Services</p>
            <SplitText
              text="Comprehensive Sanitation Services"
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
              From routine food plant sanitation to emergency disinfecting, we deliver expert solutions tailored to your facility's unique requirements.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* Service Detail Cards */}
      <section className="w-full bg-[#0A1628] section-padding">
        <div className="content-max space-y-20 md:space-y-28">
          {services.map((service) => (
            <CinematicReveal
              key={service.num}
              type={service.imageLeft ? 'fade-left' : 'fade-right'}
              duration={1.4}
            >
              <div className="grid md:grid-cols-2 bg-[#0F1D32] rounded-xl overflow-hidden border border-[#1E3A5F]/40 group"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                {/* Image with parallax */}
                <div className={`relative h-[300px] md:h-[450px] overflow-hidden ${!service.imageLeft ? 'md:order-2' : ''}`}>
                  <ParallaxLayer speed={0.15}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </ParallaxLayer>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: service.imageLeft
                      ? 'linear-gradient(to right, transparent 60%, #0F1D32)'
                      : 'linear-gradient(to left, transparent 60%, #0F1D32)'
                    }}
                  />
                </div>

                {/* Content */}
                <div className={`relative p-8 md:p-12 lg:p-14 flex flex-col justify-center ${!service.imageLeft ? 'md:order-1' : ''}`}>
                  <span className="absolute top-4 right-4 text-[60px] md:text-[80px] font-extralight text-[#D4AF37]/[0.1] leading-none select-none">
                    {service.num}
                  </span>
                  <p className="caption-style mb-3">{service.category}</p>
                  <h2 className="text-2xl md:text-3xl font-medium text-[#F0F4F8]">{service.title}</h2>
                  <p className="mt-5 text-[#8BA3BE] leading-relaxed">{service.description}</p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E8FD4] mt-2 shrink-0 shadow-[0_0_6px_rgba(46,143,212,0.4)]" />
                        <span className="text-sm text-[#8BA3BE]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="inline-block mt-8 text-sm font-medium text-[#2E8FD4] group/link"
                  >
                    <span className="relative">
                      Learn More
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#2E8FD4] transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </CinematicReveal>
          ))}
        </div>
      </section>

      {/* Service Process */}
      <section className="w-full bg-[#0F1D32] section-padding">
        <div className="content-max">
          <div className="text-center mb-16">
            <SplitText
              text="How We Work"
              as="h2"
              className="text-[clamp(28px,3vw,40px)] font-normal text-[#F0F4F8]"
              type="chars"
              animation="reveal-up"
              stagger={0.02}
              duration={0.8}
              scrollTrigger
            />
          </div>

          <CinematicReveal stagger={0.15}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {processSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="text-center relative group">
                    <div className="w-14 h-14 rounded-full border-2 border-[#1E3A5F] flex items-center justify-center mx-auto transition-all duration-500 group-hover:border-[#2E8FD4] group-hover:shadow-[0_0_20px_rgba(46,143,212,0.2)] group-hover:scale-110">
                      <Icon size={22} className="text-[#2E8FD4]" />
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-[#F0F4F8]">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#8BA3BE] max-w-[240px] mx-auto">{step.description}</p>
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] h-px bg-[#1E3A5F]/40" />
                    )}
                  </div>
                )
              })}
            </div>
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
            text="Ready to Discuss Your Sanitation Needs?"
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
              Contact our team for a free facility assessment and customized sanitation proposal.
            </p>
          </CinematicReveal>
          <CinematicReveal type="scale-up" delay={0.5}>
            <Link
              to="/contact"
              className="group relative inline-block mt-10 px-12 py-5 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(46,143,212,0.35)]"
            >
              <span className="relative z-10">Get in Touch</span>
              <span className="absolute inset-0 bg-[#4DB8FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </Link>
          </CinematicReveal>
        </div>
      </section>
    </main>
  )
}
