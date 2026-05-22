import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmoothScrollProvider from './components/SmoothScroll'
import Navigation from './components/Navigation'
import { CinematicFooter } from './components/ui/motion-footer'
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
      {!preloaderDone && (
        <CinematicPreloader onComplete={handlePreloaderComplete} />
      )}
      <FilmGrain />
      <CursorGlow />

      <div className="min-h-screen text-[#F0F4F8]" style={{ background: '#060d1a' }}>
        <ScrollToTop />
        <Navigation />

        <Routes>
          <Route path="/" element={<Home preloaderDone={preloaderDone} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/training" element={<Training />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <CinematicFooter />
      </div>
    </SmoothScrollProvider>
  )
}

export default App
