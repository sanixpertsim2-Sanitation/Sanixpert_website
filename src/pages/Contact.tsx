import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import SplitText from '../components/SplitText'
import CinematicReveal from '../components/CinematicReveal'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

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
            <p className="caption-style mb-4">Contact Us</p>
            <SplitText
              text="Get in Touch"
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
              Ready to discuss your sanitation needs? Our team is available 24/7 for emergency services and during business hours for consultations.
            </p>
          </CinematicReveal>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="w-full bg-[#0A1628] section-padding">
        <div className="content-max">
          <div className="grid lg:grid-cols-[60%_40%] gap-12 lg:gap-16">
            {/* Left — Form */}
            <CinematicReveal type="fade-left" duration={1.4}>
              <div className="bg-[#0F1D32] border border-[#1E3A5F]/50 rounded-xl p-6 md:p-10 lg:p-12"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
              >
                <h2 className="text-2xl font-medium text-[#F0F4F8]">Send Us a Message</h2>
                <p className="mt-2 text-sm text-[#8BA3BE]">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="mt-8 flex items-center gap-3 p-4 rounded-lg bg-[#2E8FD4]/10 border border-[#2E8FD4]/40">
                    <CheckCircle size={20} className="text-[#2E8FD4] shrink-0" />
                    <span className="text-sm font-medium text-[#2E8FD4]">
                      Thank you! We'll be in touch within 24 hours.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.08em] text-[#8BA3BE] mb-2">Full Name *</label>
                      <input type="text" required placeholder="John Smith"
                        className="w-full bg-[#0A1628] border border-[#1E3A5F] rounded-lg px-4 py-3.5 text-[#F0F4F8] placeholder:text-[#8BA3BE]/40 focus:border-[#2E8FD4] focus:shadow-[0_0_0_3px_rgba(46,143,212,0.12)] outline-none transition-all duration-300" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.08em] text-[#8BA3BE] mb-2">Email Address *</label>
                        <input type="email" required placeholder="john@company.com"
                          className="w-full bg-[#0A1628] border border-[#1E3A5F] rounded-lg px-4 py-3.5 text-[#F0F4F8] placeholder:text-[#8BA3BE]/40 focus:border-[#2E8FD4] focus:shadow-[0_0_0_3px_rgba(46,143,212,0.12)] outline-none transition-all duration-300" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-[0.08em] text-[#8BA3BE] mb-2">Phone Number *</label>
                        <input type="tel" required placeholder="(555) 123-4567"
                          className="w-full bg-[#0A1628] border border-[#1E3A5F] rounded-lg px-4 py-3.5 text-[#F0F4F8] placeholder:text-[#8BA3BE]/40 focus:border-[#2E8FD4] focus:shadow-[0_0_0_3px_rgba(46,143,212,0.12)] outline-none transition-all duration-300" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.08em] text-[#8BA3BE] mb-2">Company Name</label>
                      <input type="text" placeholder="Your Food Processing Inc."
                        className="w-full bg-[#0A1628] border border-[#1E3A5F] rounded-lg px-4 py-3.5 text-[#F0F4F8] placeholder:text-[#8BA3BE]/40 focus:border-[#2E8FD4] focus:shadow-[0_0_0_3px_rgba(46,143,212,0.12)] outline-none transition-all duration-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.08em] text-[#8BA3BE] mb-2">Service Required *</label>
                      <select required
                        className="w-full bg-[#0A1628] border border-[#1E3A5F] rounded-lg px-4 py-3.5 text-[#F0F4F8] focus:border-[#2E8FD4] focus:shadow-[0_0_0_3px_rgba(46,143,212,0.12)] outline-none transition-all duration-300 appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238BA3BE' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                        <option value="">Select a service...</option>
                        <option>Food Plant Sanitation</option>
                        <option>Commercial Kitchen Cleaning</option>
                        <option>Industrial Sanitation</option>
                        <option>UV & Ozone Disinfection</option>
                        <option>Electrostatic Spraying</option>
                        <option>Emergency Response</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.08em] text-[#8BA3BE] mb-2">Message *</label>
                      <textarea required placeholder="Tell us about your facility and sanitation needs..." rows={5}
                        className="w-full bg-[#0A1628] border border-[#1E3A5F] rounded-lg px-4 py-3.5 text-[#F0F4F8] placeholder:text-[#8BA3BE]/40 focus:border-[#2E8FD4] focus:shadow-[0_0_0_3px_rgba(46,143,212,0.12)] outline-none transition-all duration-300 resize-y min-h-[120px]" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-4 bg-[#2E8FD4] text-[#F0F4F8] text-sm font-semibold uppercase tracking-[0.1em] rounded-lg transition-all duration-500 hover:bg-[#4DB8FF] hover:shadow-[0_8px_30px_rgba(46,143,212,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden group">
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-[#F0F4F8] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="relative z-10">Send Message</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </CinematicReveal>

            {/* Right — Info */}
            <CinematicReveal type="fade-right" duration={1.4}>
              <div className="space-y-8">
                {[
                  { icon: MapPin, title: 'Office Address', content: <span className="text-sm text-[#8BA3BE]">301-1632 Upper James St.<br />Hamilton, ON L9B 1K4</span> },
                  { icon: Phone, title: 'Phone Numbers', content: <div className="space-y-1"><a href="tel:18887147264" className="block text-[#D4AF37] gold-glow hover:underline">1-888-714-7264</a><a href="tel:12896747265" className="block text-[#D4AF37] gold-glow hover:underline">1-289-674-7265</a></div> },
                  { icon: Mail, title: 'Email', content: <a href="mailto:info@sanixperts.ca" className="text-sm text-[#2E8FD4] hover:underline">info@sanixperts.ca</a> },
                  { icon: Clock, title: 'Business Hours', content: <div><p className="text-sm text-[#8BA3BE]">Monday – Friday: 8:00 AM – 6:00 PM</p><p className="mt-1 text-sm text-[#2E8FD4]">Emergency Service: 24/7 Available</p></div> },
                ].map((block, i) => {
                  const Icon = block.icon
                  return (
                    <CinematicReveal key={i} type="fade-up" delay={i * 0.12} duration={0.8}>
                      <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-[#162544] border border-[#1E3A5F]/50 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-[#2E8FD4]/50 group-hover:shadow-[0_0_15px_rgba(46,143,212,0.1)]">
                          <Icon size={18} className="text-[#2E8FD4]" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-[#F0F4F8]">{block.title}</h3>
                          <div className="mt-1">{block.content}</div>
                        </div>
                      </div>
                    </CinematicReveal>
                  )
                })}

                {/* Map */}
                <CinematicReveal type="scale-up" delay={0.5}>
                  <div className="mt-6 rounded-lg overflow-hidden border border-[#1E3A5F]/50"
                    style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                    <iframe
                      title="SaniXperts Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.3!2d-79.9!3d43.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDEyJzAwLjAiTiA3OcKwNTQnMDAuMCJX!5e0!3m2!1sen!2sca!4v1"
                      width="100%" height="240"
                      style={{ border: 0, filter: 'grayscale(60%) brightness(0.7)' }}
                      allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CinematicReveal>
              </div>
            </CinematicReveal>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="w-full py-14 md:py-16 text-center relative overflow-hidden"
        style={{ background: 'rgba(46, 143, 212, 0.06)', borderTop: '1px solid rgba(46, 143, 212, 0.15)', borderBottom: '1px solid rgba(46, 143, 212, 0.15)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
        />
        <div className="content-max relative z-10">
          <CinematicReveal type="scale-up">
            <Phone size={32} className="text-[#2E8FD4] mx-auto" />
          </CinematicReveal>
          <CinematicReveal type="blur-focus" delay={0.15}>
            <h2 className="mt-4 text-2xl md:text-[28px] font-medium text-[#F0F4F8]">
              24/7 Emergency Sanitation Service
            </h2>
          </CinematicReveal>
          <CinematicReveal type="fade-up" delay={0.3}>
            <a href="tel:18887147264" className="inline-block mt-4 text-[clamp(28px,3vw,40px)] font-light text-[#D4AF37] gold-glow hover:underline">
              1-888-714-7264
            </a>
          </CinematicReveal>
          <CinematicReveal type="blur-focus" delay={0.45}>
            <p className="mt-3 text-sm text-[#8BA3BE]">
              For contamination events, food recalls, and urgent sanitation needs across Ontario.
            </p>
          </CinematicReveal>
        </div>
      </section>
    </main>
  )
}
