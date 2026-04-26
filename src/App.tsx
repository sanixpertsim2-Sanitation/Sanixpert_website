/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Menu, X, ArrowRight, Shield, Activity, Droplet, Settings, FileText, CheckCircle2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { CLIENTS, SERVICES, PRODUCTS, TESTIMONIALS, PROCESS_STEPS } from './lib/data';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);
  
  return (
    <div className="relative min-h-screen bg-brand-dark text-brand-gray overflow-x-hidden pt-20" ref={containerRef}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/10 bg-brand-dark/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-cyan rounded-sm flex items-center justify-center font-black text-black">SX</div>
          <span className="text-xl font-bold tracking-tighter uppercase text-white">SaniXperts<span className="text-brand-cyan">.</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="#services" className="nav-link">Solutions</a>
          <a href="#catalog" className="nav-link">Equipment</a>
          <a href="#case-studies" className="nav-link">Case Studies</a>
          <a href="#clients" className="nav-link">Our Clients</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="btn-outline">CRM Portal</button>
          <a href="#contact" className="btn-solid">Get a Quote</a>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Hero Section - Elegant Split Layout */}
      <section className="relative min-h-[90vh] flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/20 via-transparent to-transparent z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row h-full w-full py-20 z-10">
          {/* Left Content */}
          <div className="lg:w-1/2 flex flex-col justify-center mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-[1px] bg-brand-cyan"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-brand-cyan font-bold">Industrial Food Sanitation</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-light leading-[1.0] text-white mb-8">
                Precision <br/><span className="font-extrabold italic text-gradient">Purity.</span>
              </h1>
              <p className="text-lg text-white/50 max-w-md leading-relaxed mb-10">
                Engineering specialized cleaning solutions and equipment for the world's leading food manufacturers. Ensuring compliance, safety, and operational excellence for decades.
              </p>
              
              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">500+</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Custom Formulas</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-white">24/7</span>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Expert Support</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Interactive Preview */}
          <div className="lg:w-1/2 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="w-full aspect-square max-w-[500px] border border-white/5 rounded-full flex items-center justify-center relative"
            >
              <div className="absolute inset-0 rounded-full border-[20px] border-brand-cyan/5 animate-pulse"></div>
              <div className="w-5/6 h-5/6 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 md:p-12 flex flex-col justify-between shadow-2xl relative z-10 overflow-hidden cinematic-shadow">
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-cyan/20 blur-[100px]"></div>
                 <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-cyan font-bold">Featured Solution</span>
                    <h3 className="text-3xl font-black text-white mt-2">San-X Industrial Scrubber</h3>
                    <p className="text-sm text-white/60 mt-3 font-medium">Model V-900 High-Pressure Sterilizer</p>
                 </div>
                 <div className="h-48 w-full bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                      alt="Equipment" 
                      className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                    />
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-2xl font-mono font-bold text-brand-cyan">$14,250.00</span>
                    <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase rounded-sm hover:bg-brand-cyan hover:text-white transition-all">View Catalog</button>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Client Bar (Theme Style) */}
        <div className="w-full h-24 bg-white/5 border-y border-white/10 px-6 md:px-12 flex items-center justify-between overflow-hidden">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold whitespace-nowrap mr-8">Trusted by Industry Giants</span>
          <div className="flex gap-12 grayscale opacity-40 hover:opacity-100 transition-opacity">
            {CLIENTS.map((client, i) => (
              <span key={i} className={`text-sm md:text-xl font-black text-white whitespace-nowrap ${i % 2 === 0 ? 'italic' : ''}`}>{client.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-brand-dark px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[1px] bg-brand-cyan"></div>
                <span className="text-brand-cyan text-[10px] uppercase tracking-[0.4em] font-bold">Our Solutions</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-light text-white leading-tight">
               Built for <span className="font-black italic">Compliance.</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-10 hover:border-brand-cyan/30 transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 border border-white/10 rounded-lg flex items-center justify-center mb-8 bg-white/5 group-hover:bg-brand-cyan group-hover:text-black transition-all">
                  {service.icon === 'ShieldCheck' && <Shield className="w-6 h-6" />}
                  {service.icon === 'Settings' && <Settings className="w-6 h-6" />}
                  {service.icon === 'Droplets' && <Droplet className="w-6 h-6" />}
                  {service.icon === 'FileText' && <FileText className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">{service.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm flex-grow mb-6">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                      <CheckCircle2 className="w-3 h-3 text-brand-cyan" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-cyan">Protocol {index + 1}</span>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-brand-cyan transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-32 relative">
        <div className="absolute inset-0 bg-brand-cyan/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
           <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 lg:mb-32">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-[1px] bg-brand-cyan"></div>
                  <span className="text-brand-cyan text-[10px] uppercase tracking-[0.4em] font-bold">Proof of Performance</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-light text-white leading-tight">Case <span className="font-black italic">Studies.</span></h2>
              </div>
              <p className="text-white/40 max-w-sm text-lg font-medium">Quantifiable results from North America's leading food production facilities.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {[
                { 
                  client: 'Ferrero Rocher', 
                  title: 'Microbiological Optimization', 
                  stat: '99.9%', 
                  label: 'Pathogen Reduction',
                  img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=1000' 
                },
                { 
                  client: 'Maple Leaf Foods', 
                  title: 'Rapid Line Changeover', 
                  stat: '45min', 
                  label: 'Efficiency Window',
                  img: 'https://images.unsplash.com/photo-1558444479-c8482933074e?w=800&h=1000' 
                }
              ].map((study, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="relative h-[650px] rounded-[3rem] overflow-hidden group cursor-pointer border border-white/5"
                >
                  <img src={study.img} alt={study.client} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 grayscale" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
                  <div className="absolute bottom-16 left-16 right-16">
                    <div className="text-brand-cyan text-[10px] font-black uppercase tracking-[0.2em] mb-4">{study.client}</div>
                    <h3 className="text-4xl font-black text-white mb-10 leading-tight uppercase tracking-tighter">{study.title}</h3>
                    <div className="flex items-center gap-8">
                       <div className="text-7xl font-black text-gradient font-display">{study.stat}</div>
                       <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 leading-tight border-l border-white/10 pl-8">
                         {study.label}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Sani-Flow Process Section */}
      <section className="py-32 bg-white/2 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
             <span className="text-brand-cyan text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">The Sani-Flow Process</span>
             <h2 className="text-5xl md:text-7xl font-light text-white leading-tight">Precision <span className="font-black italic text-gradient">Audit to Verify.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
             {/* Connector Line */}
             <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0"></div>
             
             {PROCESS_STEPS.map((step, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="glass-card p-8 relative z-10 hover:border-brand-cyan/50 transition-all group"
               >
                 <div className="text-6xl font-black text-white/5 mb-6 group-hover:text-brand-cyan/20 transition-colors uppercase tracking-widest">{step.step}</div>
                 <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{step.title}</h3>
                 <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
                 <div className="mt-8 w-2 h-2 rounded-full bg-white/10 group-hover:bg-brand-cyan transition-all"></div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Cinematic Process / Parallax Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 sticky top-0 h-screen overflow-hidden pointer-events-none">
           <motion.div 
             initial={{ scale: 1.2 }}
             whileInView={{ scale: 1 }}
             transition={{ duration: 2 }}
             className="absolute inset-0 z-0"
           >
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2670" 
                className="w-full h-full object-cover opacity-20 grayscale"
                referrerPolicy="no-referrer"
              />
           </motion.div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <span className="text-brand-cyan text-xs font-black uppercase tracking-[0.5em] mb-8 block">Cinematic Experience</span>
              <h2 className="text-5xl md:text-8xl font-black text-white mb-12 uppercase tracking-tighter italic">Precision in <span className="text-gradient">Motion.</span></h2>
              <button className="group flex items-center justify-center gap-6 mx-auto">
                 <div className="w-24 h-24 rounded-full border border-brand-cyan/30 flex items-center justify-center group-hover:bg-brand-cyan group-hover:text-black transition-all">
                    <Activity className="w-8 h-8" />
                 </div>
                 <span className="text-lg font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Play Reel</span>
              </button>
            </motion.div>
        </div>
      </section>

      {/* Catalog / Product Highlight */}
      <section id="catalog" className="py-32 bg-brand-dark px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[1px] bg-brand-cyan"></div>
                <span className="text-brand-cyan text-[10px] uppercase tracking-[0.4em] font-bold">Specialized Inventory</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-light text-white leading-tight">Advanced <span className="font-black italic">Catalog.</span></h2>
            </div>
            <button className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-brand-cyan hover:text-white transition-all cinematic-shadow">
              Explore Full Catalog
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-8 glass-card"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-8 relative border border-white/5">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                   <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white/50 px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                     {product.category}
                   </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{product.name}</h3>
                <p className="text-white/40 text-sm mb-6 font-medium">{product.description}</p>
                <div className="space-y-2 mb-8">
                  {product.specs?.map((spec, sIdx) => (
                    <div key={sIdx} className="text-[9px] font-black uppercase tracking-widest text-white/20 border border-white/5 px-3 py-1 rounded-sm inline-block mr-2">
                      {spec}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-2xl font-mono font-bold text-brand-cyan">${product.price.toLocaleString()}</span>
                  <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-cyan hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Footer Ribbon Style */}
      <footer className="bg-black border-t border-white/10 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-6 max-w-xl">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-cyan to-blue-800 flex-shrink-0 animate-pulse"></div>
            <div>
              <p className="text-sm md:text-base text-white/80 font-medium italic mb-2 leading-relaxed">
                "{TESTIMONIALS[0].quote}"
              </p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                {TESTIMONIALS[0].author}, {TESTIMONIALS[0].company}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_10px_brand-cyan]"></div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
          </div>

          <div className="text-[10px] text-white/20 uppercase tracking-widest space-y-1 text-right">
             <div className="font-black text-white/40">Serving North America</div>
             <div>Toronto • Vancouver • Montreal</div>
          </div>
        </div>
      </footer>

      {/* Final Bottom Bar */}
      <div className="bg-brand-dark py-8 px-6 md:px-12 border-t border-white/5 flex justify-between items-center opacity-30 text-[9px] uppercase font-black tracking-[0.3em]">
        <span>SaniXperts Industrial © {new Date().getFullYear()}</span>
        <div className="flex gap-8">
           <a href="#" className="hover:text-brand-cyan transition-colors">Privacy</a>
           <a href="#" className="hover:text-brand-cyan transition-colors">Compliance</a>
        </div>
      </div>
      
      {/* Contact Link Fixed (Mobile Toggle) */}
      <section id="contact" className="hidden"></section>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-[60] bg-brand-dark p-12 flex flex-col items-center justify-center gap-8"
        >
          <button className="absolute top-10 right-10 text-white" onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8" /></button>
          <div className="flex flex-col items-center gap-12">
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-4xl font-light text-white">Solutions</a>
            <a href="#catalog" onClick={() => setIsMenuOpen(false)} className="text-4xl font-light text-white">Equipment</a>
            <a href="#case-studies" onClick={() => setIsMenuOpen(false)} className="text-4xl font-light text-white">Case Studies</a>
            <button className="btn-solid text-lg px-12 py-4">Get a Quote</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

