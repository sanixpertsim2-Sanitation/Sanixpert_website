import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  FlaskConical,
  Lock,
  Box,
  HardHat,
  Users,
  Forklift,
  ArrowUpFromLine,
  HeartPulse,
} from 'lucide-react'
import SplitText from '../components/SplitText'
import CinematicReveal from '../components/CinematicReveal'

const programs = [
  { icon: ShieldCheck, title: 'HACCP Certification', description: 'Hazard Analysis Critical Control Points training for food safety management. Learn to identify, evaluate, and control food safety hazards throughout the production process.', badge: 'Food Safety' },
  { icon: FlaskConical, title: 'WHMIS Training', description: 'Workplace Hazardous Materials Information System certification. Understand chemical classifications, labeling, and safety data sheets for safe handling of cleaning agents.', badge: 'Chemical Safety' },
  { icon: Lock, title: 'Lockout & Tagout', description: 'Proper procedures for isolating energy sources during equipment cleaning and maintenance. Essential for protecting workers from hazardous energy releases.', badge: 'Equipment Safety' },
  { icon: Box, title: 'Confined Space Entry', description: 'Training for safe entry and monitoring of confined spaces including tanks, vessels, and ductwork. Covers atmospheric testing, ventilation, and rescue procedures.', badge: 'Specialized' },
  { icon: HardHat, title: 'Health & Safety', description: 'Comprehensive workplace health and safety training covering hazard recognition, incident prevention, emergency response, and regulatory compliance.', badge: 'General Safety' },
  { icon: Users, title: 'Workplace Harassment Prevention', description: 'Training on recognizing, preventing, and responding to workplace harassment and violence. Promotes a respectful and safe work environment for all employees.', badge: 'Compliance' },
  { icon: Forklift, title: 'Forklift Certification', description: 'Certified forklift operation training including pre-operation inspection, safe maneuvering, load handling, and facility-specific operating procedures.', badge: 'Equipment' },
  { icon: ArrowUpFromLine, title: 'Scissor Lift & Aerial Lift', description: 'Safe operation of scissor lifts and boom lifts for elevated work areas. Covers setup, operation, hazard awareness, and emergency lowering procedures.', badge: 'Equipment' },
  { icon: HeartPulse, title: 'First Aid & CPR/AED', description: 'First Aid, CPR, and AED certification. Prepares team members to respond effectively to medical emergencies in the workplace.', badge: 'Emergency' },
]

const stats = [
  { num: '100%', label: 'Team Certification', desc: 'All field employees hold current certifications in their areas of work.' },
  { num: '40+', label: 'Training Hours Annually', desc: 'Minimum continuing education hours per employee each year.' },
  { num: '9', label: 'Specialized Programs', desc: 'Industry-specific training tracks for different facility types.' },
]

export default function Training() {
  return (
    <main>
      {/* Page Hero */}
      <section className="relative w-full flex items-center justify-center overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0 bg-[#0F1D32]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 to-[#0A1628]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.15) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 content-max text-center py-32">
          <CinematicReveal type="blur-focus">
            <p className="caption-style mb-4">Training & Certifications</p>
            <SplitText
              text="Building Expertise, Ensuring Safety"
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
              Comprehensive training programs that keep our team and your staff at the forefront of sanitation and safety standards.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* Team Video Section */}
      <section className="w-full bg-rich section-padding relative overflow-hidden">
        <div className="content-max">
          <CinematicReveal type="fade-up" duration={1.4}>
            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(46,143,212,0.1)' }}>
              <video autoPlay loop muted playsInline className="w-full h-[350px] md:h-[450px] object-cover" poster="/images/about-team.jpg">
                <source src="/videos/hero-team-professional.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(4,8,15,0.2) 0%, rgba(4,8,15,0.5) 50%, rgba(4,8,15,0.8) 100%)' }} />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="caption-style mb-2">Our Professionals</p>
                <p className="text-xl md:text-2xl font-light text-[#F0F4F8]">Every team member is continuously trained and certified</p>
              </div>
            </div>
          </CinematicReveal>
        </div>
      </section>

      {/* Training Programs */}
      <section className="w-full bg-rich-alt section-padding">
        <div className="content-max">
          <div className="text-center mb-16">
            <CinematicReveal type="blur-focus">
              <p className="caption-style mb-4">Programs</p>
              <SplitText
                text="Our Training & Certifications"
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

          <CinematicReveal stagger={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, i) => {
                const Icon = program.icon
                return (
                  <div
                    key={i}
                    className="bg-[#0F1D32] border border-[#1E3A5F]/50 rounded-xl p-8 md:p-10 group transition-all duration-500 hover:-translate-y-2 hover:border-[#2E8FD4]/30 hover:shadow-[0_20px_60px_rgba(46,143,212,0.08)]"
                  >
                    <div className="transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                      <Icon size={40} className="text-[#2E8FD4] group-hover:text-[#4DB8FF] transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-[#F0F4F8]">{program.title}</h3>
                    <p className="mt-3 text-sm text-[#8BA3BE] leading-relaxed">{program.description}</p>
                    <span className="inline-block mt-4 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#2E8FD4]/10 text-[#2E8FD4] border border-[#2E8FD4]/20">
                      {program.badge}
                    </span>
                  </div>
                )
              })}
            </div>
          </CinematicReveal>
        </div>
      </section>

      {/* Training Approach */}
      <section className="w-full bg-[#0F1D32] section-padding">
        <div className="content-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <CinematicReveal type="fade-left" duration={1.4}>
              <div>
                <p className="caption-style mb-4">Our Approach</p>
                <SplitText
                  text="Investing in Our People"
                  as="h2"
                  className="text-[clamp(28px,3vw,40px)] font-normal text-[#F0F4F8]"
                  type="chars"
                  animation="reveal-up"
                  stagger={0.015}
                  duration={0.7}
                  scrollTrigger
                />
                <CinematicReveal type="blur-focus" delay={0.3}>
                  <p className="mt-6 text-base text-[#8BA3BE] leading-relaxed">
                    At SaniXperts, we believe that our people are our greatest asset. That's why we invest heavily in continuous training and professional development. Every team member undergoes rigorous certification programs and regular refresher training to ensure they remain at the cutting edge of sanitation technology and food safety standards.
                  </p>
                </CinematicReveal>
                <CinematicReveal type="blur-focus" delay={0.5}>
                  <blockquote className="mt-8 pl-6 border-l-[3px] border-[#2E8FD4]">
                    <p className="text-lg text-[#F0F4F8] italic">
                      "Our commitment to training ensures that every SaniXperts team member delivers consistent, high-quality service that exceeds industry standards."
                    </p>
                  </blockquote>
                </CinematicReveal>
              </div>
            </CinematicReveal>

            {/* Right */}
            <CinematicReveal type="fade-right" duration={1.4}>
              <div className="space-y-10">
                {stats.map((stat, i) => (
                  <CinematicReveal key={i} type="fade-up" delay={i * 0.15}>
                    <div>
                      <span className="text-[clamp(40px,4vw,56px)] font-light text-[#D4AF37] gold-glow">{stat.num}</span>
                      <p className="text-xl font-medium text-[#F0F4F8] mt-2">{stat.label}</p>
                      <p className="text-sm text-[#8BA3BE] mt-1">{stat.desc}</p>
                    </div>
                  </CinematicReveal>
                ))}
              </div>
            </CinematicReveal>
          </div>
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
            text="Invest in Your Team's Safety Training"
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
              Contact us to learn more about our training programs and how we can help your team achieve the highest safety standards.
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
