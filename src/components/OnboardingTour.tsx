import { useState, useEffect } from 'react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: string
}

interface OnboardingTourProps {
  isOpen: boolean
  onComplete: () => void
  onSkip: () => void
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const steps: OnboardingStep[] = [
    {
      id: 'recipe-library',
      title: 'Inspiration',
      description: 'Hitta idéer för vad du kan laga. Sök efter ingredienser du har hemma eller rätter du gillar.',
      target: 'recipe-library',
      position: 'top',
      action: 'Sök efter "kyckling" eller "pasta"'
    },
    {
      id: 'drag-drop',
      title: 'Planera veckan',
      description: 'Skapa din veckoplan genom att dra idéer till veckodagarna. Enkelt att organisera måltider.',
      target: 'week-planner',
      position: 'top',
      action: 'Dra en idé till måndagen'
    },
    {
      id: 'smart-recommendations',
      title: 'Smarta förslag',
      description: 'Få inspiration baserat på vad du redan planerat. Sparar tid och ger nya idéer.',
      target: 'smart-recommendations',
      position: 'top'
    },
    {
      id: 'ingredients',
      title: 'Inköpslista',
      description: 'Se alla ingredienser du behöver för hela veckan. Perfekt för att planera inköpen.',
      target: 'common-ingredients',
      position: 'top'
    }
  ]

  useEffect(() => {
    if (isOpen) {
      // Ingen fördröjning - visa direkt
      setIsVisible(true)
      highlightCurrentStep()
    } else {
      setIsVisible(false)
      removeAllHighlights()
    }
  }, [isOpen, currentStep])

  const highlightCurrentStep = () => {
    removeAllHighlights()
    const step = steps[currentStep]
    const targetElement = document.querySelector(`[data-onboarding="${step.target}"]`)
    
    if (targetElement) {
      targetElement.classList.add('onboarding-highlight')
      // Snabbare scrollning
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      })
    }
  }

  const removeAllHighlights = () => {
    document.querySelectorAll('.onboarding-highlight').forEach(el => {
      el.classList.remove('onboarding-highlight')
    })
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepPosition = () => {
    // Fixerad position i mitten av skärmen
    return { top: '50%', left: '50%' }
  }

  if (!isOpen || !isVisible) return null

  const currentStepData = steps[currentStep]
  const position = getStepPosition()

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Tour tooltip */}
      <div 
        className="fixed z-50 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-4xl bg-white border-0 rounded-2xl shadow-lg p-4 sm:p-6 md:p-10 transition-colors duration-200"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
          </div>
          <button
            onClick={onSkip}
            className="text-xs sm:text-sm text-text hover:text-text/80 transition-colors font-medium"
          >
            Hoppa över
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-colors duration-200"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-left">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-3 sm:mb-4 md:mb-6">
            {currentStepData.title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            {currentStepData.description}
          </p>
          {currentStepData.action && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
                💡 <strong>Prova:</strong> {currentStepData.action}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`p-2 sm:p-3 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-text hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextStep}
            className="bg-text text-background px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg font-medium text-sm sm:text-base hover:bg-text/90 transition-colors duration-200"
          >
            {currentStep === steps.length - 1 ? 'Börja använda' : 'Nästa'}
          </button>
        </div>
      </div>
    </>
  )
}

export default OnboardingTour
