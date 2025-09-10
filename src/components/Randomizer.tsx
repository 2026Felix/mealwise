import { useCallback, useMemo, useState } from 'react'
import { useRecipeContext } from '../context/AppState'
import { DAYS_OF_WEEK } from '../constants'
import type { Recipe } from '../types'
import { buttonStyles, commonClasses, responsiveText, textColors, spacing } from '../utils/uiStyles'
import { CookingPot, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import RecipeModal from './RecipeModal'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const getRandomSample = (arr: any[], count: number): any[] => {
  const n = clamp(count, 0, arr.length)
  // Fisher–Yates shuffle (partial)
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

const Randomizer: React.FC = () => {
  const { state, dispatch } = useRecipeContext()
  const [mealCount, setMealCount] = useState<number>(3)
  const [results, setResults] = useState<Recipe[]>([])
  const [restaurantResults, setRestaurantResults] = useState<string[]>([])
  const [selectedDays, setSelectedDays] = useState<Record<string, string>>({})
  const [showQuestions, setShowQuestions] = useState<boolean>(true)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState<boolean>(false)
  const [preferences, setPreferences] = useState<{
    location: 'home' | 'restaurant' | null
    filters: Set<string>
  }>({
    location: null,
    filters: new Set()
  })

  const maxSelectable = useMemo(() => Math.min(7, state.recipeLibrary.length), [state.recipeLibrary.length])

  const restaurantCategories = useMemo(() => {
    const baseCategories = [
      'Pizza', 'Thai', 'Kina', 'Steakhouse', 'Italienskt', 'Mexikanskt', 
      'Indiskt', 'Japanskt', 'Sushi', 'Grekiskt', 'Franskt', 'Svenskt',
      'Hamburgare', 'Fisk', 'Vegetariskt', 'Mellanöstern', 'Koreanskt'
    ]
    
    if (preferences.filters.has('vegetarisk')) {
      return baseCategories.filter(cat => 
        ['Vegetariskt', 'Indiskt', 'Thai', 'Kina', 'Grekiskt', 'Mellanöstern'].includes(cat)
      )
    } else if (preferences.filters.has('vegansk')) {
      return baseCategories.filter(cat => 
        ['Vegetariskt', 'Indiskt', 'Thai', 'Kina', 'Grekiskt', 'Mellanöstern'].includes(cat)
      )
    }
    
    return baseCategories
  }, [preferences.filters])

  const filteredRecipes = useMemo(() => {
    if (preferences.location !== 'home') return []
    
    return state.recipeLibrary.filter(recipe => {
      // Apply the same filter logic as PlanningPage
      if (preferences.filters.has('snabb') && recipe.prepTime > 30) return false
      if (preferences.filters.has('vegetarisk') && recipe.category === 'protein') return false
      if (preferences.filters.has('vegansk') && !(recipe.tags?.includes('Vegansk'))) return false
      if (preferences.filters.has('vardagsmiddag') && !(recipe.tags?.includes('Vardagsmiddag'))) return false
      if (preferences.filters.has('fest') && !(recipe.tags?.includes('Fest'))) return false

      return true
    })
  }, [state.recipeLibrary, preferences.filters])

  const randomize = useCallback(() => {
    if (preferences.location === 'home') {
      const sample = getRandomSample(filteredRecipes, mealCount)
      setResults(sample)
      setRestaurantResults([])
      // Förifyll dag-val till första dagen i listan
      const defaultDay = DAYS_OF_WEEK[0]
      const next: Record<string, string> = {}
      sample.forEach(r => { next[String(r.id)] = defaultDay })
      setSelectedDays(next)
    } else if (preferences.location === 'restaurant') {
      const sample = getRandomSample(restaurantCategories, 1) // Always 1 for "Restaurang"
      setRestaurantResults(sample)
      setResults([])
    }
    setShowQuestions(false)
  }, [mealCount, filteredRecipes, restaurantCategories, preferences.location])

  const resetQuestions = useCallback(() => {
    setShowQuestions(true)
    setCurrentQuestion(0)
    setResults([])
    setRestaurantResults([])
    setPreferences({ location: null, filters: new Set() })
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentQuestion < 2) {
      setCurrentQuestion(prev => prev + 1)
    }
  }, [currentQuestion])

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }, [currentQuestion])

  const canProceed = useMemo(() => {
    if (currentQuestion === 0) return preferences.location !== null
    if (currentQuestion === 1) return preferences.filters.size > 0 || preferences.location === 'restaurant'
    if (currentQuestion === 2) return preferences.location === 'home' // Only show meal count for home
    return false
  }, [currentQuestion, preferences])

  const addToDay = useCallback((recipe: Recipe) => {
    const day = selectedDays[String(recipe.id)] || DAYS_OF_WEEK[0]
    dispatch({ type: 'ADD_RECIPE_TO_DAY', day, recipe })
  }, [dispatch, selectedDays])

  const handleShowRecipeDetails = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetails(true)
  }, [])

  const handleCloseRecipeDetails = useCallback(() => {
    setShowRecipeDetails(false)
    setSelectedRecipe(null)
  }, [])

  const changeMealCount = useCallback((delta: number) => {
    setMealCount(prev => clamp(prev + delta, 1, maxSelectable))
  }, [maxSelectable])

  return (
    <div className={`${commonClasses.container} ${spacing.section}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 max-w-xl mx-auto">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <h1 className={`${responsiveText.h2} font-semibold ${textColors.primary} text-center`}>Slumpa måltider</h1>
        </div>

        {showQuestions ? (
          <div className="relative overflow-hidden">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      step <= currentQuestion ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Card container with sliding animation */}
            <div className="relative">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentQuestion * 100}%)` }}
              >
                {/* Question 1: Location */}
                <div className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-50 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Var vill du äta?</h3>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => {
                          setPreferences(prev => ({ ...prev, location: 'home' }))
                          setTimeout(nextQuestion, 300)
                        }}
                        className={`px-8 py-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.location === 'home'
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <div className="text-3xl mb-2">🏠</div>
                        <div className="font-medium">Hemma</div>
                      </button>
                      <button
                        onClick={() => {
                          setPreferences(prev => ({ ...prev, location: 'restaurant' }))
                          setTimeout(nextQuestion, 300)
                        }}
                        className={`px-8 py-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.location === 'restaurant'
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <div className="text-3xl mb-2">🍽️</div>
                        <div className="font-medium">Restaurang</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question 2: Filter options (only for home) */}
                {preferences.location === 'home' && (
                  <div className="w-full flex-shrink-0 px-4">
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Vad föredrar du?</h3>
                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                        {[
                          { key: 'vegetarisk', label: 'Vegetarisk', icon: '🥬' },
                          { key: 'vegansk', label: 'Vegansk', icon: '🌱' },
                          { key: 'snabb', label: 'Snabb', icon: '⚡' },
                          { key: 'vardagsmiddag', label: 'Vardagsmiddag', icon: '🍽️' },
                          { key: 'fest', label: 'Fest', icon: '🎉' }
                        ].map(({ key, label, icon }) => (
                          <button
                            key={key}
                            onClick={() => {
                              const newFilters = new Set(preferences.filters)
                              if (newFilters.has(key)) {
                                newFilters.delete(key)
                              } else {
                                newFilters.add(key)
                              }
                              setPreferences(prev => ({ ...prev, filters: newFilters }))
                            }}
                            className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                              preferences.filters.has(key)
                                ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                            }`}
                          >
                            <div className="text-2xl mb-1">{icon}</div>
                            <div className="text-sm font-medium">{label}</div>
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-4">Välj en eller flera alternativ</p>
                    </div>
                  </div>
                )}

                {/* Question 3: Number of meals (only for home) */}
                {preferences.location === 'home' && (
                  <div className="w-full flex-shrink-0 px-4">
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Hur många måltider?</h3>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => changeMealCount(-1)}
                          disabled={mealCount <= 1}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            mealCount <= 1
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                          }`}
                          aria-label="Minska antal måltider"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="bg-white border-2 border-gray-300 rounded-xl px-6 py-3 min-w-[60px]">
                          <span className="text-2xl font-bold text-gray-900">{mealCount}</span>
                        </div>
                        
                        <button
                          onClick={() => changeMealCount(1)}
                          disabled={mealCount >= maxSelectable}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            mealCount >= maxSelectable
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
                          }`}
                          aria-label="Öka antal måltider"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentQuestion === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {currentQuestion === 2 || (currentQuestion === 1 && preferences.location === 'restaurant') ? (
                <button
                  onClick={randomize}
                  className={buttonStyles.gradientCompact}
                  aria-label="Slumpa måltider"
                >
                  Slumpa måltider
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={!canProceed}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    canProceed
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Nästa
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personalized results header */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {preferences.location === 'home' 
                  ? `Här är dina ${mealCount} slumpade recept!` 
                  : 'Här är din slumpade restaurang!'
                }
              </h3>
            </div>

            {results.length > 0 ? (
              <div className="space-y-3 text-center">
                {results.map((recipe) => (
                  <div key={recipe.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
                    <button
                      onClick={() => handleShowRecipeDetails(recipe)}
                      className={buttonStyles.iconTransparentSmall}
                      title="Visa receptdetaljer"
                      aria-label={`Visa detaljer för ${recipe.name}`}
                    >
                      <CookingPot className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : restaurantResults.length > 0 ? (
              <div className="space-y-3 text-center">
                {restaurantResults.map((category, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600 text-center">Välj antal och klicka på Slumpa.</div>
            )}

            {/* Action buttons - moved below results */}
            <div className="flex gap-3">
              <button
                onClick={resetQuestions}
                className="w-[10%] min-w-[48px] py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                title="Byt preferenser"
                aria-label="Byt preferenser"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={randomize} 
                className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                aria-label="Slumpa recept"
              >
                Slumpa igen
              </button>
            </div>
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && showRecipeDetails && (
          <RecipeModal
            recipe={selectedRecipe}
            isOpen={showRecipeDetails}
            onClose={handleCloseRecipeDetails}
          />
        )}
      </div>
    </div>
  )
}

export default Randomizer


