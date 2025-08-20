import WeekPlanner from './components/WeekPlanner'
import RecipeLibrary from './components/RecipeLibrary'
import CommonIngredientsDisplay from './components/CommonIngredientsDisplay'
import SmartRecommendations from './components/SmartRecommendations'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfUse from './components/TermsOfUse'
import Contact from './components/Contact'
import Feedback from './components/Feedback'
import { RecipeProvider } from './context/RecipeContext'

import ErrorBoundary from './components/ErrorBoundary'
import OnboardingTour from './components/OnboardingTour'
import DebugPanel from './components/DebugPanel'
import { useState, useEffect } from 'react'
import { secureStorage } from './utils/security'
import { logInfo } from './utils/logger'

// Main App Component
const AppContent: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [route, setRoute] = useState<string>(window.location.hash || '#/')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Kontrollera om användaren har sett onboarding tidigare
    const onboardingSeen = secureStorage.getItem('mealwise-onboarding-seen')
    if (!onboardingSeen) {
      // Visa inte onboarding automatiskt - låt användaren välja
      setShowOnboarding(false)
    }
  }, [])

  // Enkel hash-baserad router
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/')
    }
    window.addEventListener('hashchange', handleHashChange)
    if (!window.location.hash) {
      window.location.hash = '#/'
    }
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Stäng mobilmenyn vid ruttbyte
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [route])

  // Dev-only genväg för att toggla Debug Panel
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        setShowDebugPanel((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    secureStorage.setItem('mealwise-onboarding-seen', 'true')
  }

  const handleOnboardingSkip = () => {
    setShowOnboarding(false)
    secureStorage.setItem('mealwise-onboarding-seen', 'true')
  }

  // Återställning av onboarding kan aktiveras från andra ställen vid behov

  const startOnboarding = () => {
    setShowOnboarding(true)
    logInfo('User started onboarding', 'UserInteraction')
  }

  return (
    <div className="min-h-screen bg-white text-text">
      {/* Modern Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white">
        <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl md:text-2xl text-text tracking-wide">
                <a href="#/" aria-label="Gå till startsidan" className="flex items-baseline gap-0">
                  <span className="font-bold">MEAL</span>
                  <span className="font-light">WISE</span>
                </a>
              </h1>
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                BETA
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#/" className="text-text hover:text-text/80 transition-colors font-medium">
                Recept
              </a>
              <a href="#/feedback" className="text-text hover:text-text/80 transition-colors font-medium">
                Feedback
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text hover:text-text/80 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Öppna meny"
              onClick={() => setIsMobileMenuOpen(v => !v)}
            >
              {/* Hamburger icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        {/* Sträck under navigationen - följer med navigationen */}
        <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto border-t border-text/30"></div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-b border-text/10 shadow-sm">
            <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto py-2">
              <div className="flex flex-col gap-1 py-2">
                <a
                  href="#/"
                  className="block px-2 py-2 rounded-md text-text hover:text-text/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Recept
                </a>
                <a
                  href="#/feedback"
                  className="block px-2 py-2 rounded-md text-text hover:text-text/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Feedback
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Routes */}
      {route === '#/' && (
        <>
          {/* Hero Section - Centered on Page */}
          <section 
            id="hero-section"
            data-onboarding="hero-section"
            className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] text-center px-4"
          >
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4 sm:mb-6 leading-tight">
                <span className="text-text">Spara hundralappar</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  varje månad
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text/70 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
                Mealwise hjälper dig planera måltider och få inspiration. 
                Skapa måltidsplaner baserat på ingredienser du har hemma.
              </p>
              <button 
                onClick={startOnboarding}
                className="bg-text text-background px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-text/90 transition-all duration-300 transform hover:scale-105"
              >
                Kom igång med Mealwise
              </button>
            </div>
          </section>
          
          {/* Main Content */}
          <main id="main-content" className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
            {/* Layout: Stack på små skärmar, grid på stora skärmar */}
            <div className="flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Vänster sida: Veckoplan */}
              <div data-onboarding="week-planner" className="order-1 xl:order-1">
                <WeekPlanner />
              </div>
              
              {/* Höger sida: Alla recept + Smart rekommendationer + Alla ingredienser */}
              <div className="space-y-3 sm:space-y-4 order-2 xl:order-2">
                <div data-onboarding="recipe-library">
                  <RecipeLibrary />
                </div>
                <div data-onboarding="smart-recommendations">
                  <SmartRecommendations />
                </div>
                <div data-onboarding="common-ingredients">
                  <CommonIngredientsDisplay />
                </div>
              </div>
            </div>
          </main>
        </>
      )}
      {route === '#/privacy' && <PrivacyPolicy />}
      {route === '#/terms' && <TermsOfUse />}
      {route === '#/contact' && <Contact />}
      {route === '#/feedback' && <Feedback />}
      
      {/* Footer */}
      <footer className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto py-6 sm:py-8 mt-8 sm:mt-12 md:mt-16 border-t border-text/10">
        <div className="text-center">
          <p className="text-text/60 text-xs sm:text-sm">
            © 2024 Mealwise. Alla rättigheter förbehållna.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-3 sm:mt-4">
            <a href="#/privacy" className="text-text/60 hover:text-text transition-colors text-xs sm:text-sm">Integritetspolicy</a>
            <a href="#/terms" className="text-text/60 hover:text-text transition-colors text-xs sm:text-sm">Användarvillkor</a>
            <a href="#/contact" className="text-text/60 hover:text-text transition-colors text-xs sm:text-sm">Kontakta oss</a>
            <a href="#/feedback" className="text-text/60 hover:text-text transition-colors text-xs sm:text-sm">Feedback</a>
          </div>
          
          {/* Sociala ikoner dolda i beta tills riktiga profiler finns */}
        </div>
      </footer>

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      {/* Debug Panel endast i utvecklingsläge (Shift+D för att toggla) */}
      {import.meta.env.DEV && (
        <DebugPanel
          isVisible={showDebugPanel}
          onToggle={() => setShowDebugPanel(!showDebugPanel)}
        />
      )}
    </div>
  )
}

// Main App Component with Providers
function App() {
  return (
    <ErrorBoundary>
      <RecipeProvider>
        <AppContent />
      </RecipeProvider>
    </ErrorBoundary>
  )
}

export default App
