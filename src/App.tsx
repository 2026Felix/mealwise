import WeekPlanner from './components/WeekPlanner'
import RecipeLibrary from './components/RecipeLibrary'
import CommonIngredientsDisplay from './components/CommonIngredientsDisplay'
import SmartRecommendations from './components/SmartRecommendations'
import { RecipeProvider } from './context/RecipeContext'

import ErrorBoundary from './components/ErrorBoundary'

import DebugPanel from './components/DebugPanel'
import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { commonClasses, responsiveText, textColors, spacing } from './utils/commonStyles'
import { useRecipeFilters } from './hooks/useRecipeFilters'
import { useScrollLock } from './hooks/useScrollLock'

// Lazy load sidor som inte behövs direkt
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const TermsOfUse = lazy(() => import('./components/TermsOfUse'))

const Feedback = lazy(() => import('./components/Feedback'))

// Navigation Component
const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Lås scroll när mobile menu är öppet
  useScrollLock(isMobileMenuOpen)

  const location = useLocation()

  // Stäng mobilmenyn vid ruttbyte
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Lås body-scroll när mobilmenyn är öppen
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarCompensation = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarCompensation > 0) {
      document.body.style.paddingRight = `${scrollbarCompensation}px`
    }
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(v => !v)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white relative">
      <div className={`${commonClasses.container} py-3 sm:py-4`}>
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className={`${responsiveText.h3} ${textColors.primary} tracking-wide`}>
              <Link to="/" aria-label="Gå till startsidan" className="flex items-baseline gap-0">
                <span className="font-bold">MEAL</span>
                <span className="font-light">WISE</span>
              </Link>
            </h1>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200">
              BETA
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={commonClasses.button.link}>
              Planera
            </Link>
            <Link to="/recipes" className={commonClasses.button.link}>
              Recept
            </Link>
            <Link to="/feedback" className={commonClasses.button.link}>
              Feedback
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-900 hover:text-gray-700 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
            onClick={toggleMobileMenu}
          >
            {/* Animated hamburger icon */}
            <label className="cursor-pointer">
              <div className="w-9 h-10 flex flex-col items-center justify-center">
                {/* hidden checkbox mirrors state for peer utility usage */}
                <input
                  className="hidden peer"
                  type="checkbox"
                  checked={isMobileMenuOpen}
                  onChange={toggleMobileMenu}
                  aria-hidden="true"
                />
                <div className="w-[50%] h-[2px] bg-gray-900 rounded-sm transition-all duration-300 origin-left translate-y-[0.45rem] peer-checked:-rotate-45"></div>
                <div className="w-[50%] h-[2px] bg-gray-900 rounded-md transition-all duration-300 origin-center peer-checked:hidden"></div>
                <div className="w-[50%] h-[2px] bg-gray-900 rounded-md transition-all duration-300 origin-left -translate-y-[0.45rem] peer-checked:rotate-45"></div>
              </div>
            </label>
          </button>
        </div>
      </div>
      {/* Sträck under navigationen - följer med navigationen */}
      {!isMobileMenuOpen && (
        <div className={`${commonClasses.container} border-t border-gray-300`}></div>
      )}

      {/* Mobile menu: full-screen slide-in from right */}
      <>
        {/* Backdrop */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-[1px] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
        {/* Panel */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={`md:hidden fixed inset-y-0 right-0 left-0 z-50 bg-white transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className={`${commonClasses.container} py-4 h-full flex flex-col`}>
            <div className="flex items-center justify-end mb-2">
              <button
                type="button"
                aria-label="Stäng meny"
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-900 hover:text-gray-700 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Navigation Links */}
            <nav className="flex-1 flex flex-col justify-center space-y-8">
              <Link 
                to="/" 
                className={`px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors text-base w-full text-right font-medium rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
                onClick={closeMobileMenu}
              >
                Planera
              </Link>
              <Link 
                to="/recipes" 
                className={`px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors text-base w-full text-right font-medium rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/recipes' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
                onClick={closeMobileMenu}
              >
                Recept
              </Link>
              <Link 
                to="/feedback" 
                className={`px-4 py-4 text-gray-900 hover:bg-gray-50 transition-colors text-base w-full text-right font-medium rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/feedback' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
                onClick={closeMobileMenu}
              >
                Feedback
              </Link>
            </nav>
            
            {/* Footer */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Mealwise Beta v0.1.0
              </p>
            </div>
          </div>
        </div>
      </>
    </nav>
  )
}

// Home Page Component
const HomePage: React.FC = () => {
  const [expandedQA, setExpandedQA] = useState<number | null>(null)
  
  // Delade filter för alla recept
  const { 
    activeFilters, 
    toggleFilter, 
    clearFilters, 
    filterButtons, 
  } = useRecipeFilters()

  const toggleQA = useCallback((index: number) => {
    setExpandedQA(expandedQA === index ? null : index)
  }, [expandedQA])

  return (
    <>
      {/* Main Content */}
      <main id="main-content" className={`${commonClasses.container} ${spacing.content} ${spacing.section}`}>
        {/* Layout: Stack på små skärmar, grid på stora skärmar */}
        <div className={`flex flex-col xl:grid xl:grid-cols-2 ${spacing.gap}`}>
          {/* Vänster sida: Veckoplan */}
          <div data-onboarding="week-planner" className="order-1 xl:order-1">
            <WeekPlanner />
          </div>
          
          {/* Höger sida: Alla recept + Smart rekommendationer + Alla ingredienser */}
          <div className="space-y-4 sm:space-y-6 order-2 xl:order-2">
            <div data-onboarding="recipe-library">
              <RecipeLibrary 
                activeFilters={activeFilters}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                filterButtons={filterButtons}
              />
            </div>
            <div data-onboarding="smart-recommendations">
              <SmartRecommendations 
                activeFilters={activeFilters}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                filterButtons={filterButtons}
              />
            </div>
            <div data-onboarding="common-ingredients">
              <CommonIngredientsDisplay />
            </div>
          </div>
        </div>
      </main>

      {/* Q&A Section - Replaced hero section */}
      <section 
        id="qa-section"
        className={`${commonClasses.container} py-16 sm:py-20`}
      >
        <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary}`}>
                Vanliga frågor
              </h2>
            </div>
          </div>
          
          <div className="space-y-0">
            {/* Q&A Item 1 */}
            <div className="overflow-hidden">
              <button
                onClick={() => toggleQA(0)}
                className="w-full p-6 sm:p-8 text-left hover:bg-gray-100 hover:rounded-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`${responsiveText.h4} font-semibold ${textColors.primary}`}>
                    Hur fungerar Mealwise?
                  </h3>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedQA === 0 ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {expandedQA === 0 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className={`${responsiveText.body} ${textColors.muted} leading-relaxed`}>
                    Du planerar din vecka med recept, får förslag med liknande ingredienser, och sedan får du hela veckans rätter samlade i en inköpslista. Det finns många recept, men de är inte helt testade just nu.
                  </p>
                </div>
              )}
            </div>

            {/* Q&A Item 2 */}
            <div className="overflow-hidden border-t border-gray-200">
              <button
                onClick={() => toggleQA(1)}
                className="w-full p-6 sm:p-8 text-left hover:bg-gray-100 hover:rounded-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`${responsiveText.h4} font-semibold ${textColors.primary}`}>
                    Kan jag spara pengar på Mealwise?
                  </h3>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedQA === 1 ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {expandedQA === 1 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className={`${responsiveText.body} ${textColors.muted} leading-relaxed`}>
                    Ja! Du sparar mycket tid och pengar på att planera veckan i förväg. Matsvinnet minskar också eftersom du använder alla ingredienser du köper.
                  </p>
                </div>
              )}
            </div>

            {/* Q&A Item 3 */}
            <div className="overflow-hidden border-t border-gray-200">
              <button
                onClick={() => toggleQA(2)}
                className="w-full p-6 sm:p-8 text-left hover:bg-gray-100 hover:rounded-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`${responsiveText.h4} font-semibold ${textColors.primary}`}>
                    Hur är det smarta rekommendationer?
                  </h3>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedQA === 2 ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {expandedQA === 2 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className={`${responsiveText.body} ${textColors.muted} leading-relaxed`}>
                    Rekommendationerna anpassas efter filter och liknande ingredienser från dina favoriträtter som du valt från den stora listan. Ju fler recept du planerar, desto smartare blir förslagen.
                  </p>
                </div>
              )}
            </div>

            {/* Q&A Item 4 - Ny fråga */}
            <div className="overflow-hidden border-t border-gray-200">
              <button
                onClick={() => toggleQA(3)}
                className="w-full p-6 sm:p-8 text-left hover:bg-gray-100 hover:rounded-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className={`${responsiveText.h4} font-semibold ${textColors.primary}`}>
                    Är tjänsten helt färdig?
                  </h3>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedQA === 3 ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {expandedQA === 3 && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-in slide-in-from-top-2 duration-200">
                  <p className={`${responsiveText.body} ${textColors.muted} leading-relaxed`}>
                    Nej, detta är under tidigt produktionsstadium. Kärnfunktionerna fungerar: veckoplanering, receptbibliotek och inköpslista. Feedback är mycket välkommet och många fler funktioner är planerade.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className={`${commonClasses.container} py-6 sm:py-8 ${spacing.section} border-t border-gray-200`}>
      <div className="text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          © 2024 Mealwise. Alla rättigheter förbehållna.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-3 sm:mt-4">
          <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm">Integritetspolicy</Link>
          <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm">Användarvillkor</Link>

          <Link to="/feedback" className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm">Feedback</Link>
        </div>
        
        {/* Sociala ikoner dolda i beta tills riktiga profiler finns */}
      </div>
    </footer>
  )
}

// Main App Component with Providers
function App() {
  const [showDebugPanel, setShowDebugPanel] = useState(false)

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

  return (
    <ErrorBoundary>
      <RecipeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white text-gray-900">
            <Navigation />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={
                <div className={`${commonClasses.container} ${spacing.section}`}>
                  <main className="py-10">
                    <h1 className={`${responsiveText.h2} font-semibold text-gray-900 mb-4`}>Recept</h1>
                    <p className="text-gray-600">Här kommer alla recept i kortform.
                    </p>
                  </main>
                </div>
              } />
              <Route path="/privacy" element={
                <Suspense fallback={
                  <div className={commonClasses.loading.container}>
                    <div className="text-center">
                      <div className={commonClasses.loading.spinner}></div>
                      <p className={commonClasses.loading.text}>Laddar integritetspolicy...</p>
                    </div>
                  </div>
                }>
                  <PrivacyPolicy />
                </Suspense>
              } />
              <Route path="/terms" element={
                <Suspense fallback={
                  <div className={commonClasses.container}>
                    <div className="text-center">
                      <div className={commonClasses.loading.spinner}></div>
                      <p className={commonClasses.loading.text}>Laddar användarvillkor...</p>
                    </div>
                  </div>
                }>
                  <TermsOfUse />
                </Suspense>
              } />

              <Route path="/feedback" element={
                <Suspense fallback={
                  <div className={commonClasses.loading.container}>
                    <div className="text-center">
                      <div className={commonClasses.loading.spinner}></div>
                      <p className={commonClasses.loading.text}>Laddar feedback-formulär...</p>
                    </div>
                  </div>
                }>
                  <Feedback />
                </Suspense>
              } />
            </Routes>
            
            <Footer />

            {/* Debug Panel endast i utvecklingsläge (Shift+D för att toggla) */}
            {import.meta.env.DEV && (
              <DebugPanel
                isVisible={showDebugPanel}
                onToggle={() => setShowDebugPanel(!showDebugPanel)}
              />
            )}
          </div>
        </BrowserRouter>
      </RecipeProvider>
    </ErrorBoundary>
  )
}

export default App
