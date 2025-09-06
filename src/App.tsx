import WeekPlanner from './components/WeekPlanner'
import Recipe from './components/Recipe'
import IngredientsAndRecommendations from './components/IngredientsAndRecommendations'
import RecipeFinder from './components/RecipeFinder'
import { RecipeProvider } from './context/RecipeContext'

import ErrorBoundary from './components/ErrorBoundary'

import DebugPanel from './components/DebugPanel'
import { useState, useEffect, lazy, Suspense, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { commonClasses, responsiveText, textColors, spacing } from './utils/commonStyles'
import { useRecipeFilters } from './hooks/useRecipeFilters'
import { useScrollLock } from './hooks/useScrollLock'

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

// Navigation Component
const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPlaneraDropdownOpen, setIsPlaneraDropdownOpen] = useState(false)
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false)

  // Lås scroll endast när mobile menu är öppet
  useScrollLock(isMobileMenuOpen)

  const location = useLocation()

  // Stäng alla menyer vid ruttbyte
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsPlaneraDropdownOpen(false)
    setIsMobileToolsOpen(false)
  }, [location.pathname])

  // Stäng dropdown när man klickar utanför
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPlaneraDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.planera-dropdown')) {
          setIsPlaneraDropdownOpen(false)
        }
      }
    }

    if (isPlaneraDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPlaneraDropdownOpen])


  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(v => !v)
    // Stäng dropdown när mobilmenyn öppnas/stängs
    if (!isMobileMenuOpen) {
      setIsPlaneraDropdownOpen(false)
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const togglePlaneraDropdown = useCallback(() => {
    setIsPlaneraDropdownOpen(prev => !prev)
  }, [])

  const closePlaneraDropdown = useCallback(() => {
    setIsPlaneraDropdownOpen(false)
  }, [])

  const toggleMobileTools = useCallback(() => {
    setIsMobileToolsOpen(prev => !prev)
  }, [])

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
          
          {/* Navigation Links - centered */}
          <div className="hidden md:flex items-center justify-center gap-8 lg:gap-10 flex-1">
            {/* Planera Dropdown */}
            <div className="relative planera-dropdown">
              <button
                onClick={togglePlaneraDropdown}
                className={`${commonClasses.button.link} flex items-center gap-1`}
              >
                Verktyg
                <svg 
                  className={`w-4 h-4 transition-transform ${isPlaneraDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isPlaneraDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] min-w-max">
                  <div className="py-2">
                    <Link
                      to="/plan"
                      onClick={closePlaneraDropdown}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap ${
                        location.pathname === '/plan' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      Veckoplan
                    </Link>
                    <Link
                      to="/what-do-you-have"
                      onClick={closePlaneraDropdown}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap ${
                        location.pathname === '/what-do-you-have' ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      Vad har du hemma?
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/recipes" className={commonClasses.button.link}>
              Recept
            </Link>
            <Link to="/feedback" className={commonClasses.button.link}>
              Feedback
            </Link>
          </div>

          {/* Right-side utilities: Beta badge + mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded-full border border-gray-200">
              BETA
            </span>
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
                <div className="w-[50%] h-[2px] bg-gray-900 rounded-sm transition-all duration-300 origin-center peer-checked:hidden"></div>
                <div className="w-[50%] h-[2px] bg-gray-900 rounded-sm transition-all duration-300 origin-left -translate-y-[0.45rem] peer-checked:rotate-45"></div>
              </div>
            </label>
          </button>
        </div>
      </div>
      </div>

      {/* Mobile menu: slide-in from left (mirrored design) */}
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
          <div className="h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-end p-4">
              <button
                type="button"
                aria-label="Stäng meny"
                onClick={closeMobileMenu}
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Navigation Links */}
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-0">
                {/* Verktyg section */}
                <div className="space-y-0">
                  <button
                    onClick={toggleMobileTools}
                    className="flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target w-full"
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-right">Verktyg</span>
                  </button>
                  <div className="h-px bg-gray-200"></div>
                  
                  {/* Expandable tools submenu */}
                  {isMobileToolsOpen && (
                    <div className="pl-4 space-y-0">
                      <Link 
                        to="/plan" 
                        className={`flex items-center justify-between py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/plan' ? 'bg-blue-50 text-blue-700' : ''}`}
                        onClick={closeMobileMenu}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="text-right">Veckoplan</span>
                      </Link>
                      <div className="h-px bg-gray-200"></div>
                      
                      <Link 
                        to="/what-do-you-have" 
                        className={`flex items-center justify-between py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/what-do-you-have' ? 'bg-blue-50 text-blue-700' : ''}`}
                        onClick={closeMobileMenu}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="text-right">Vad har du hemma?</span>
                      </Link>
                      <div className="h-px bg-gray-200"></div>
                    </div>
                  )}
                </div>
                
                {/* Recept */}
                <Link 
                  to="/recipes" 
                  className={`flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/recipes' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-right">Recept</span>
                </Link>
                <div className="h-px bg-gray-200"></div>
                
                {/* Feedback */}
                <Link 
                  to="/feedback" 
                  className={`flex items-center justify-between py-4 text-gray-900 hover:bg-gray-50 transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 touch-target ${location.pathname === '/feedback' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-right">Feedback</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </>
    </nav>
  )
}

// Planning Page Component
const PlanningPage: React.FC = () => {
  const { 
    activeFilters, 
    toggleFilter, 
    clearFilters, 
    filterButtons, 
  } = useRecipeFilters()

  return (
      <main id="main-content" className={`${commonClasses.container} ${spacing.content} ${spacing.section}`}>
        <div className={`flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8`}>
          <div data-onboarding="week-planner" className="order-1 xl:order-1">
            <WeekPlanner />
          </div>
          <div className="space-y-4 sm:space-y-6 order-2 xl:order-2">
            <div data-onboarding="recipe-library">
              <Recipe 
                activeFilters={activeFilters}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                filterButtons={filterButtons}
              />
            </div>
            <div data-onboarding="ingredients-and-recommendations">
              <IngredientsAndRecommendations 
                activeFilters={activeFilters}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                filterButtons={filterButtons}
              />
            </div>
          </div>
        </div>
      </main>
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
              <Link to="/what-do-you-have" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-900 text-sm sm:text-base hover:bg-gray-50 transition-colors w-full sm:w-auto">
                Läs mer
              </Link>
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
              title="Vad har du hemma?"
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
          <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            <Navigation />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes" element={
                  <div className={`${commonClasses.container} ${spacing.section}`}>
                    <div className="py-6 sm:py-8 lg:py-10">
                      <h1 className={`${responsiveText.h2} font-semibold text-gray-900 mb-4`}>Recept</h1>
                      <p className="text-gray-600">Här kommer alla recept i kortform.
                      </p>
                    </div>
                  </div>
                } />
                
                <Route path="/what-do-you-have" element={
                  <div className={`${commonClasses.container} ${spacing.section}`}>
                    <div className="py-6 sm:py-8 lg:py-10">
                      <RecipeFinder />
                    </div>
                  </div>
                } />
                <Route path="/plan" element={
                  <PlanningPage />
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
