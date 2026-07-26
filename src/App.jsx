import { useLenis } from './lib/useLenis'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Walkthrough from './components/Walkthrough'
import Features from './components/Features'
import { PrinciplesIntro, SimpleByDesign } from './components/PrinciplesIntro'
import Principles from './components/Principles'
import Dashboard from './components/Dashboard'
import { Limits, Pricing, Faq, Footer } from './components/Closing'

export default function App() {
  useLenis()

  return (
    <div className="relative min-h-screen bg-void text-fg">
      <Background />
      <Navbar />
      <main className="relative z-10">
        {/* The argument, in order: what actually happens → the mechanism → the four
            channels → the three constraints everything follows from → what you look
            at day to day → what it does not do → what it costs → the objections. */}
        <Hero />
        <Problem />
        <Walkthrough />
        <Features />
        <PrinciplesIntro />
        <Principles />     {/* Secure by default · Privacy by architecture */}
        <SimpleByDesign />
        <Dashboard />
        <Limits />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
