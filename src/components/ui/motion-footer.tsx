"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { MapPin, Phone } from "lucide-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: 'Geist Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: rgba(46, 143, 212, 0.05);
  --pill-bg-2: rgba(46, 143, 212, 0.02);
  --pill-shadow: rgba(0, 0, 0, 0.3);
  --pill-highlight: rgba(46, 143, 212, 0.08);
  --pill-inset-shadow: rgba(10, 22, 40, 0.8);
  --pill-border: rgba(46, 143, 212, 0.12);
  --pill-bg-1-hover: rgba(46, 143, 212, 0.1);
  --pill-bg-2-hover: rgba(46, 143, 212, 0.04);
  --pill-border-hover: rgba(46, 143, 212, 0.3);
  --pill-shadow-hover: rgba(46, 143, 212, 0.15);
  --pill-highlight-hover: rgba(46, 143, 212, 0.15);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.6)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(46, 143, 212, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(46, 143, 212, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(46, 143, 212, 0.12) 0%, 
    rgba(124, 77, 255, 0.08) 40%, 
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: #F0F4F8;
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(46, 143, 212, 0.08);
  background: linear-gradient(180deg, rgba(46, 143, 212, 0.1) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, #F0F4F8 0%, rgba(140, 163, 190, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(46, 143, 212, 0.2));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    },[]);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Food Plant Sanitation</span> <span className="text-[#2E8FD4]/60">✦</span>
    <span>UV & Ozone Disinfection</span> <span className="text-[#7c4dff]/60">✦</span>
    <span>Emergency Response 24/7</span> <span className="text-[#2E8FD4]/60">✦</span>
    <span>Health Canada Certified</span> <span className="text-[#00e5ff]/60">✦</span>
    <span>BRC & USDA Compliant</span> <span className="text-[#2E8FD4]/60">✦</span>
    <span>Electrostatic Spraying</span> <span className="text-[#7c4dff]/60">✦</span>
    <span>15+ Years Experience</span> <span className="text-[#00e5ff]/60">✦</span>
    <span>99.9% Sterilization</span> <span className="text-[#2E8FD4]/60">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  },[]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer 
          className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden cinematic-footer-wrapper"
          style={{ 
            background: 'linear-gradient(180deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)',
            color: '#F0F4F8'
          }}
        >
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            SANIXPERTS
          </div>

          {/* 1. Diagonal Sleek Marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-[#1E3A5F]/30 py-4 z-10 -rotate-2 scale-110 shadow-2xl"
            style={{ background: 'rgba(6, 13, 26, 0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-[#8BA3BE] uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-7xl font-black footer-text-glow tracking-tighter mb-12 text-center"
            >
              Ready to begin?
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary CTAs */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton as="a" href="#/contact"
                  className="footer-glass-pill px-10 py-5 rounded-full text-[#F0F4F8] font-bold text-sm md:text-base flex items-center gap-3 group">
                  <Phone size={20} className="text-[#2E8FD4] group-hover:text-[#4DB8FF] transition-colors" />
                  Contact Us
                </MagneticButton>
                
                <MagneticButton as="a" href="#/services"
                  className="footer-glass-pill px-10 py-5 rounded-full text-[#F0F4F8] font-bold text-sm md:text-base flex items-center gap-3 group">
                  <MapPin size={20} className="text-[#2E8FD4] group-hover:text-[#4DB8FF] transition-colors" />
                  Our Services
                </MagneticButton>
              </div>

              {/* Secondary Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton as="a" href="#/why-us" className="footer-glass-pill px-6 py-3 rounded-full text-[#8BA3BE] font-medium text-xs md:text-sm hover:text-[#F0F4F8]">
                  Why SaniXperts
                </MagneticButton>
                <MagneticButton as="a" href="#/training" className="footer-glass-pill px-6 py-3 rounded-full text-[#8BA3BE] font-medium text-xs md:text-sm hover:text-[#F0F4F8]">
                  Training
                </MagneticButton>
                <MagneticButton as="a" href="#/" className="footer-glass-pill px-6 py-3 rounded-full text-[#8BA3BE] font-medium text-xs md:text-sm hover:text-[#F0F4F8]">
                  About Us
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <div className="text-[#8BA3BE] text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1">
              © 2025 SaniXperts Inc. All rights reserved.
            </div>

            {/* "Made with" Badge */}
            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default">
              <span className="text-[#8BA3BE] text-[10px] md:text-xs font-bold uppercase tracking-widest">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-[#D4AF37]">❤</span>
              <span className="text-[#8BA3BE] text-[10px] md:text-xs font-bold uppercase tracking-widest">in</span>
              <span className="text-[#F0F4F8] font-black text-xs md:text-sm tracking-normal ml-1">Hamilton, ON</span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-[#8BA3BE] hover:text-[#F0F4F8] group order-3"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}
