import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Linkedin, Facebook } from 'lucide-react'
import WaveText from './WaveText'
import CinematicReveal from './CinematicReveal'

const serviceLinks = [
  { label: 'Food Plant Sanitation', path: '/services' },
  { label: 'Commercial Kitchen', path: '/services' },
  { label: 'Industrial Sanitation', path: '/services' },
  { label: 'UV Disinfection', path: '/services' },
  { label: 'Emergency Response', path: '/services' },
]

const companyLinks = [
  { label: 'About Us', path: '/' },
  { label: 'Why SaniXperts', path: '/why-us' },
  { label: 'Our Process', path: '/why-us' },
  { label: 'Training & Certifications', path: '/training' },
]

export default function Footer() {
  return (
    <footer className="w-full bg-[#070F1C] pt-20 pb-10 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(ellipse, rgba(46,143,212,0.2) 0%, transparent 70%)' }}
      />

      <div className="content-max relative z-10">
        {/* Top Row */}
        <CinematicReveal stagger={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-0 group">
                <span className="text-lg font-semibold text-[#2E8FD4] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(46,143,212,0.5)]">Sani</span>
                <span className="text-lg font-semibold text-[#F0F4F8]">Xperts</span>
              </Link>
              <p className="mt-4 text-sm text-[#8BA3BE] leading-relaxed">
                Professional sanitation services for food plants across Ontario, Canada.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-base font-medium text-[#F0F4F8] mb-4">Services</h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-[#8BA3BE] hover:text-[#2E8FD4] transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-base font-medium text-[#F0F4F8] mb-4">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-[#8BA3BE] hover:text-[#2E8FD4] transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base font-medium text-[#F0F4F8] mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#2E8FD4] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#8BA3BE]">301-1632 Upper James St.<br />Hamilton, ON L9B 1K4</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#2E8FD4] shrink-0" />
                  <div className="text-sm">
                    <span className="text-[#D4AF37] block">1-888-714-7264</span>
                    <span className="text-[#D4AF37]">1-289-674-7265</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#2E8FD4] shrink-0" />
                  <a href="mailto:info@sanixperts.ca" className="text-sm text-[#2E8FD4] hover:underline">info@sanixperts.ca</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#2E8FD4] shrink-0" />
                  <span className="text-sm text-[#8BA3BE]">24/7 Emergency Service</span>
                </div>
              </div>
            </div>
          </div>
        </CinematicReveal>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#1E3A5F]/60 to-transparent my-10" />

        {/* Bottom Row */}
        <CinematicReveal type="fade-up">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[#8BA3BE]">
              © 2025 SaniXperts Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-[#8BA3BE] hover:text-[#2E8FD4] transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-[#8BA3BE] hover:text-[#2E8FD4] transition-all duration-300 hover:scale-110" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </CinematicReveal>
      </div>

      {/* Wave Text */}
      <WaveText text="SANIXPERTS" />
    </footer>
  )
}
