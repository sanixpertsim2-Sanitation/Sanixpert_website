import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmoothScrollProvider from './components/SmoothScroll'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import CursorGlow from './components/CursorGlow'
import FilmGrain from './components/FilmGrain'
import CinematicPreloader from './components/CinematicPreloader'
import Home from './pages/Home'
import Services from './pages/Services'
import WhyUs from './pages/WhyUs'
import Training from './pages/Training'
import Contact from './pages/Contact'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // Small delay to ensure smooth scroll is ready
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  }, [pathname])
  return null
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true)
  }, [])

  return (
    <SmoothScrollProvider>
      {/* Cinematic Preloader */}
      {!preloaderDone && (
        <CinematicPreloader onComplete={handlePreloaderComplete} />
      )}

      {/* Film grain overlay */}
      <FilmGrain />

      {/* Custom cursor glow */}
      <CursorGlow />

      <div className="min-h-screen bg-[#0A1628] text-[#F0F4F8]">
        <ScrollToTop />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home preloaderDone={preloaderDone} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/training" element={<Training />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </SmoothScrollProvider>
  )
}

export default App
