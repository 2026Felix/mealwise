import PlanningPage from './components/PlanningPage'
import RecipeSearch from './components/RecipeSearch'
import RecipeLibrary from './components/RecipeLibrary'
import { RecipeProvider } from './context/AppState'

import ErrorBoundary from './components/ErrorBoundary'

import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { commonClasses, responsiveText, textColors, spacing } from './utils/uiStyles'
import { useRecipeFilters } from './hooks/useFiltering'
import { useScrollLock } from './hooks/useScrollControl'

// Lazy load sidor som inte behövs direkt
const Legal = lazy(() => import('./components/Legal'))

const Feedback = lazy(() => import('./components/Feedback'))

// Reusable components
interface ToolCardProps {
  to: string
  title: string
  description: string
  ctaText: string
}

const ToolCard: React.FC<ToolCardProps> = ({ to, title, description, ctaText }) => {
  // Shared CTA component to avoid duplication
  const CTAButton = ({ className }: { className: string }) => (
    <span className={`inline-flex items-center ${className}`}>
      {ctaText}
      <svg className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  )

  return (
    <Link to={to} className="group block w-64 sm:w-72 flex-none snap-start mr-3 sm:mr-4 md:mr-0 md:w-full md:flex-1">
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow">
        <div className="h-[280px] sm:h-[333px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
      </div>
      <div className="pt-3 group">
        <h3 className={`${responsiveText.h4} font-semibold ${textColors.primary} mb-1`}>{title}</h3>
        <div className="h-16 relative">
          <p className={`${textColors.subtle} ${responsiveText.small} absolute inset-0 opacity-0 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1`}>
            {description}
          </p>
          <CTAButton className={`${responsiveText.small} font-medium ${textColors.primary} transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-1 absolute top-0 left-0`} />
        </div>
        <CTAButton className={`mt-1 ${responsiveText.small} font-medium ${textColors.primary} transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-1`} />
      </div>
    </Link>
  )
}

interface BenefitCardProps {
  number: string
  title: string
  description: string
}

const BenefitCard: React.FC<BenefitCardProps> = ({ number, title, description }) => (
  <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow group border border-gray-200">
    <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
        <span className="text-xl sm:text-2xl font-bold text-gray-900 underline decoration-2 underline-offset-4">
          {number}
        </span>
      </div>
      <div className="flex-1">
        <h3 className={`${responsiveText.h4} font-semibold ${textColors.primary} mb-2`}>
          {title}
        </h3>
        <p className={`${responsiveText.body} ${textColors.muted} leading-relaxed`}>
          {description}
        </p>
      </div>
    </div>
  </div>
)

// Navigation Component - Förenklad och förbättrad struktur
const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Lås scroll endast när mobile menu är öppet
  useScrollLock(isMobileMenuOpen)

  // Stäng mobilmeny vid ruttbyte
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(v => !v)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Navigation items - enkel lista utan dropdowns
  const navigationItems = [
    { to: '/plan', label: 'Veckoplan' },
    { to: '/what-do-you-have', label: 'Hemmafix' },
    { to: '/recipes', label: 'Recept' },
    { to: '/feedback', label: 'Feedback' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-transparent relative">
      <div className={`${commonClasses.container} py-3 sm:py-4 lg:py-6`}>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-md px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:h-16 lg:py-0">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className={`${responsiveText.h3} ${textColors.primary} tracking-wide`}>
              <Link to="/" aria-label="Gå till startsidan" className="flex items-baseline gap-0">
                <span className="font-bold">MEAL</span>
                <span className="font-light">WISE</span>
              </Link>
            </h1>
          </div>
          
          {/* Desktop Navigation - Höger-aligned för bättre balans */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.to)
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side: Dark mode toggle + Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark mode toggle */}
            <button
              type="button"
              className="hidden sm:inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label="Växla mellan ljust och mörkt tema"
              title="Dark mode kommer snart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-900 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
              onClick={toggleMobileMenu}
            >
              {/* Förenklad hamburger icon */}
              <div className="w-6 h-6 flex flex-col items-center justify-center gap-1">
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Förenklad slide-in från höger */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Panel */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="md:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Meny</h2>
                <button
                  type="button"
                  aria-label="Stäng meny"
                  onClick={closeMobileMenu}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Navigation Links - Förenklad lista */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive(item.to)
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive(item.to) && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer med dark mode toggle */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-center mb-4">
                  <button
                    type="button"
                    className="p-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    aria-label="Växla mellan ljust och mörkt tema"
                    title="Dark mode kommer snart"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    © 2025 Mealwise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

// Planning Page Component
const PlanningPageWrapper: React.FC = () => {
  const { 
    activeFilters, 
    toggleFilter, 
    clearFilters, 
    filterButtons, 
  } = useRecipeFilters()

  return (
    <PlanningPage 
      activeFilters={activeFilters}
      onToggleFilter={toggleFilter}
      onClearFilters={clearFilters}
      filterButtons={filterButtons}
    />
  )
}

// Home Page Component (Landing)
const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero section */}
      <section className={`${commonClasses.container} pt-16 pb-8 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-20`}>
        <div className="max-w-7xl xl:max-w-7xl 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <h1 className={`font-semibold ${responsiveText.h1} leading-[1.05] sm:leading-[1.08] text-gray-900 mb-4 sm:mb-6 lg:mb-8`}>
              <span className="block">Planera smart.</span>
              <span className="block">Ät bättre.</span>
              <span className="block">Spara tid.</span>
            </h1>
            <p className={`${textColors.muted} ${responsiveText.body} max-w-[60ch] mb-4 sm:mb-6`}>
              Ett roligare och smartare sätt att planera måltider. Recept, inköpslistor och smarta verktyg. Allt på ett och samma ställe.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button 
                onClick={() => {
                  const toolsSection = document.getElementById('tools-section')
                  if (toolsSection) {
                    const navHeight = 150 // Ungefärlig höjd på sticky navigation
                    const elementPosition = toolsSection.offsetTop - navHeight
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    })
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 text-white text-sm sm:text-base hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                Spännande, vi kör!
              </button>
            </div>
          </div>

          {/* Right: Stacked cards */}
          <div className="grid grid-cols-2 grid-rows-2 gap-5 sm:gap-7">
            <div className="col-span-1 row-span-2 rounded-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 shadow-sm h-[420px] lg:h-[460px]" />
            <div className="col-span-1 rounded-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 shadow-sm h-[200px] lg:h-[220px]" />
            <div className="col-span-1 rounded-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 shadow-sm h-[200px] lg:h-[220px]" />
          </div>
        </div>
      </section>

      {/* Tools showcase */}
      <section id="tools-section" className={`${commonClasses.container} py-8 sm:py-12 lg:py-16 mt-4 sm:mt-8 lg:mt-12`}>
        <div className="max-w-7xl xl:max-w-7xl 2xl:max-w-7xl mx-auto">
          <h1 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4 sm:mb-6 lg:mb-8`}>
            Något som passar dig
          </h1>
          <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide md:grid md:grid-cols-4 md:gap-8 md:overflow-hidden md:snap-none">
            <ToolCard 
              to="/plan"
              title="Veckoplan"
              description="Planera dina måltider och få smarta rekommendationer samt inköpslista."
              ctaText="Öppna verktyg"
            />
            <ToolCard 
              to="/what-do-you-have"
              title="Hemmafix"
              description="Välj ingredienser du har hemma och få recept som matchar."
              ctaText="Öppna verktyg"
            />
            <ToolCard 
              to="/feedback"
              title="Måltidstinder"
              description="Hitta recept som passar dig och din partner."
              ctaText="Lämna feedback"
            />
            <ToolCard 
              to="/recipes"
              title="Måltidsgambling"
              description="En snabb överblick över recept. Denna vy är under uppbyggnad."
              ctaText="Se alla"
            />
          </div>
        </div>
      </section>

      {/* What makes Mealwise unique */}
      <section className={`${commonClasses.container} pt-6 pb-8 sm:py-12 lg:py-16 mt-0 sm:mt-8 lg:mt-12`}>
        <div className="max-w-7xl xl:max-w-7xl 2xl:max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-3 sm:mb-4`}>
              Därför är det värdefullt
            </h2>
            <p className={`${responsiveText.body} ${textColors.muted} max-w-sm sm:max-w-3xl lg:max-w-3xl mx-auto`}>
              Planera veckans måltider kan vara dyrt och svårt, därför har vi tagit fram olika verktyg för att underlätta. Så du har mer över till det som betyder något. 
            </p>
          </div>

          {/* 2x2 Grid layout for 4 points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <BenefitCard 
              number="01"
              title="Spara tid"
              description="Planera och inhandla smart med olika verktyg. Mer tid till dig och vad som betyder något."
            />
            <BenefitCard 
              number="02"
              title="Spara pengar"
              description="Mindre matsvinn, smartare inköp och en mer flexibel plånbok. Ta hand om jordens och dina resurser."
            />
            <BenefitCard 
              number="03"
              title="Allt på ett ställe"
              description="Planera, recept, inköpslistor och rekommendationer. Allt på ett ställe, allt för att underlätta."
            />
            <BenefitCard 
              number="04"
              title="Inspiration"
              description="Upptäck nya favoriter och få smarta rekommendationer baserat på dina preferenser."
            />
          </div>
        </div>
      </section>
    </>
  )
}

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className={`${commonClasses.container} py-4 sm:py-6 lg:py-8 ${spacing.section} border-t border-gray-200`}>
      <div className="text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          © 2024 Mealwise. Alla rättigheter förbehållna.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-3 lg:mt-4">
          <Link to="/legal" className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm">Juridisk information</Link>

          <Link to="/feedback" className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm">Feedback</Link>
        </div>
        
        {/* Sociala ikoner dolda i beta tills riktiga profiler finns */}
      </div>
    </footer>
  )
}

// Main App Component with Providers
function App() {

  return (
    <ErrorBoundary>
      <RecipeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            <Navigation />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes" element={<RecipeLibrary />} />
                
                <Route path="/what-do-you-have" element={
                  <div className={`${commonClasses.container} ${spacing.section}`}>
                    <div className="py-6 sm:py-8 lg:py-10">
                      <RecipeSearch />
                    </div>
                  </div>
                } />
                <Route path="/plan" element={
                  <PlanningPageWrapper />
                } />
                <Route path="/legal" element={
                  <Suspense fallback={
                    <div className={commonClasses.loading.container}>
                      <div className="text-center">
                        <div className={commonClasses.loading.spinner}></div>
                        <p className={commonClasses.loading.text}>Laddar juridisk information...</p>
                      </div>
                    </div>
                  }>
                    <Legal />
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
            </main>
            
            <Footer />
          </div>
        </BrowserRouter>
      </RecipeProvider>
    </ErrorBoundary>
  )
}

export default App
