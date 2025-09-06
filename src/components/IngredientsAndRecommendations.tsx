import { useState, useMemo, useCallback, memo, useEffect } from 'react'
import { useRecipeContext } from '../context/RecipeContext'
import { ShoppingCart, X, Check, Brain, ChevronDown, ChevronUp, CookingPot } from 'lucide-react'
import { buttonStyles } from '../utils/commonStyles'
import { FilterType } from '../hooks/useRecipeFilters'
import { useScrollLock } from '../hooks/useScrollLock'
import RecipeDetailModal from './RecipeDetailModal'

// Enkel RecipeCard komponent för rekommendationer
const RecipeCard: React.FC<{
  recipe: any
  showOverlap?: boolean
  overlapCount?: number
  overlapIngredients?: string[]
  onAddToDay?: () => void
  onShowDetails?: () => void
}> = ({ 
  recipe, 
  showOverlap = false, 
  overlapCount = 0,
  onAddToDay,
  onShowDetails
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detektera om användaren är på mobil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (isMobile) return
    
    e.dataTransfer.setData('application/json', JSON.stringify(recipe))
    e.dataTransfer.effectAllowed = 'copy'
    setIsDragging(true)
  }, [isMobile, recipe])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    if (isMobile && onAddToDay) {
      onAddToDay()
    }
  }, [isMobile, onAddToDay])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isMobile && onAddToDay) {
        onAddToDay()
      }
    }
  }, [isMobile, onAddToDay])

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isMobile && onAddToDay ? 'cursor-pointer' : ''}`}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isMobile && onAddToDay ? "button" : "article"}
      tabIndex={isMobile && onAddToDay ? 0 : -1}
      aria-label={isMobile && onAddToDay ? `Lägg till ${recipe.name} i veckoplan` : `Rekommendation: ${recipe.name}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm leading-none">
            {recipe.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {showOverlap && (
            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
              overlapCount > 0 
                ? 'text-gray-600 bg-gray-100' 
                : 'text-gray-400 bg-gray-50'
            }`}>
              {overlapCount} gem.
            </span>
          )}
          
          {onShowDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation() // Stoppa event bubbling så att onAddToDay inte triggas
                onShowDetails()
              }}
              className={buttonStyles.iconTransparentSmall}
              title="Visa receptdetaljer"
            >
              <CookingPot className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop drag-indikator - lägre z-index så den inte täcker texten */}
      {!isMobile && (
        <div 
          className="absolute inset-0 bg-transparent group-hover:bg-gray-50 transition-colors rounded-lg pointer-events-none z-0"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

interface IngredientsAndRecommendationsProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

const IngredientsAndRecommendations: React.FC<IngredientsAndRecommendationsProps> = memo(({ 
  activeFilters, 
  onToggleFilter, 
  onClearFilters, 
  filterButtons 
}) => {
  const { getIngredientsWithQuantitiesFromContext, state, dispatch } = useRecipeContext()
  const baseIngredientsWithQuantities = getIngredientsWithQuantitiesFromContext()
  
  // State för ingredienser
  const [showDetailedList, setShowDetailedList] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'recipe' | 'shopping'>('shopping')
  const [portions, setPortions] = useState(4)
  
  // State för rekommendationer
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [showDaySelector, setShowDaySelector] = useState(false)

  // Lås scroll när modaler är öppna - använd useMemo för att stabilisera boolean
  const shouldLockScroll = useMemo(() => showDetailedList || showDaySelector, [showDetailedList, showDaySelector])
  useScrollLock(shouldLockScroll)

  // Beräkna ingredienser baserat på portions
  const ingredientsWithQuantities = baseIngredientsWithQuantities.map(ingredient => ({
    ...ingredient,
    totalQuantity: Math.round(ingredient.totalQuantity * (portions / 4) * 100) / 100 // Baserat på 4 portioner, avrundat till 2 decimaler
  }))

  const hasPlannedRecipes = ingredientsWithQuantities.length > 0

  // Hantera checkbox-klick
  const toggleIngredient = (ingredientName: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientName)) {
      newChecked.delete(ingredientName)
    } else {
      newChecked.add(ingredientName)
    }
    setCheckedIngredients(newChecked)
  }

  // Hantera portions-ändring
  const handlePortionChange = (newPortions: number) => {
    if (newPortions >= 1 && newPortions <= 8) {
      setPortions(newPortions)
    }
  }

  // Hämta ingredienser grupperade per recept
  const getIngredientsByRecipe = () => {
    const recipeGroups: { [key: string]: { recipe: any, ingredients: any[] } } = {}
    
    state.weekPlan.forEach(day => {
      day.recipes.forEach(mealInstance => {
        const recipeName = mealInstance.recipe.name
        if (!recipeGroups[recipeName]) {
          recipeGroups[recipeName] = {
            recipe: mealInstance.recipe,
            ingredients: []
          }
        }
        
        mealInstance.recipe.ingredients.forEach(ingredient => {
          recipeGroups[recipeName].ingredients.push(ingredient)
        })
      })
    })
    
    return Object.values(recipeGroups)
  }

  // Kategorisera ingredienser för inköpslista
  const getCategorizedIngredients = () => {
    const categories = {
      'Frukt & Grönt': ['tomat', 'lök', 'vitlök', 'morot', 'potatis', 'sallad', 'spenat', 'broccoli', 'paprika', 'gurka', 'äpple', 'banan', 'citron', 'lime', 'koriander', 'basilika', 'persilja', 'dill', 'timjan', 'rosmarin'],
      'Kött & Fisk': ['nötfärs', 'fläskfärs', 'kyckling', 'kalkon', 'lax', 'torsk', 'räkor', 'skinka', 'bacon', 'korv', 'wurst'],
      'Mejeri & Ägg': ['mjölk', 'grädde', 'yoghurt', 'ost', 'smör', 'ägg', 'kefir', 'crème fraîche'],
      'Torrvaror': ['ris', 'pasta', 'bulgur', 'quinoa', 'bönor', 'linser', 'kikärtor', 'nötter', 'frön', 'havregryn', 'müsli'],
      'Kryddor & Såser': ['salt', 'peppar', 'chili', 'curry', 'paprika', 'oregano', 'kardemumma', 'kanel', 'vanilj', 'soja', 'olja', 'vinäger', 'senap', 'ketchup'],
      'Fryst & Konserver': ['ärter', 'majs', 'ananas', 'tonfisk', 'sardiner', 'krossade tomater', 'kokosmjölk']
    }

    const categorized: { [key: string]: any[] } = {}
    
    ingredientsWithQuantities.forEach(ingredient => {
      let assigned = false
      
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => 
          ingredient.name.toLowerCase().includes(keyword.toLowerCase())
        )) {
          if (!categorized[category]) {
            categorized[category] = []
          }
          categorized[category].push(ingredient)
          assigned = true
          break
        }
      }
      
      // Om ingen kategori matchar, lägg i "Övrigt"
      if (!assigned) {
        if (!categorized['Övrigt']) {
          categorized['Övrigt'] = []
        }
        categorized['Övrigt'].push(ingredient)
      }
    })
    
    return categorized
  }

  // Beräkna smarta rekommendationer baserat på gemensamma ingredienser
  const recommendations = useMemo(() => {
    if (!state.weekPlan.length) return []

    // Använd centrala förslag och beräkna bara överlapp lokalt för UI
    const plannedIngredients = new Set<string>()
    state.weekPlan.forEach(day => {
      day.recipes.forEach(mealInstance => {
        mealInstance.recipe.ingredients.forEach(ingredient => {
          plannedIngredients.add(ingredient.name.toLowerCase())
        })
      })
    })

    let withOverlap = state.suggestions.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase())
      const overlap = recipeIngredients.filter(ing => plannedIngredients.has(ing))
      return { ...recipe, overlapCount: overlap.length, overlapIngredients: overlap }
    })

    // Applicera filter på rekommendationer
    if (activeFilters.size > 0) {
      withOverlap = withOverlap.filter(recipe => {
        if (activeFilters.has('billig') && !(recipe.ingredients.length <= 4 || recipe.prepTime <= 30)) return false
        if (activeFilters.has('enkel') && recipe.difficulty !== 'easy') return false
        if (activeFilters.has('snabb') && recipe.prepTime > 30) return false
        if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false
        return true
      })
    }

    // Sortera efter mest överlapp (sekundärt kan vi bevara context-ordningen som redan är viktad)
    return withOverlap.sort((a, b) => b.overlapCount - a.overlapCount)
  }, [state.weekPlan, state.suggestions, activeFilters])

  const hasRecommendations = recommendations.length > 0

  // Handlers för rekommendationer
  const handleShowRecipeDetails = useCallback((recipe: any) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetails(true)
  }, [])

  const handleCloseRecipeDetails = useCallback(() => {
    setShowRecipeDetails(false)
    setSelectedRecipe(null)
  }, [])

  const openDaySelector = useCallback((recipe: any) => {
    setSelectedRecipe(recipe)
    setShowDaySelector(true)
  }, [])

  const handleAddToDay = useCallback((recipe: any, day: string) => {
    dispatch({
      type: 'ADD_RECIPE_TO_DAY',
      day: day,
      recipe
    })
    setShowDaySelector(false)
    setShowRecipeDetails(false)
  }, [dispatch])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const closeDaySelector = useCallback(() => {
    setShowDaySelector(false)
  }, [])

  // Render ingredienser sektion
  const renderIngredientsSection = () => {
    if (!hasPlannedRecipes) {
      return (
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Inköpslista
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto px-2">
              Lägg till recept i veckoplanen
            </p>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          {/* Header med titel och detaljerad lista-knapp */}
          <div className="flex items-center justify-between mb-0"> 
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Inköpslista ({ingredientsWithQuantities.length})
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Visa detaljerad lista knapp */}
              <button
                onClick={() => setShowDetailedList(true)}
                className={buttonStyles.gradientSmall}
                title="Visa översikt över ingredienser"
              >
                visa
              </button>
            </div>
          </div>
        </div>

        {/* Modal för detaljerad ingredienslista */}
        {showDetailedList && (
          <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Överblick
                </h3>
                <button
                  onClick={() => setShowDetailedList(false)}
                  className={buttonStyles.iconTransparentClose}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
                <button
                  onClick={() => setViewMode('recipe')}
                  className={`${buttonStyles.tab} ${
                    viewMode === 'recipe'
                      ? buttonStyles.tabActive
                      : buttonStyles.tabInactive
                  }`}
                >
                  Veckans rätter
                </button>
                <button
                  onClick={() => setViewMode('shopping')}
                  className={`${buttonStyles.tab} ${
                    viewMode === 'shopping'
                      ? buttonStyles.tabActive
                      : buttonStyles.tabInactive
                  }`}
                >
                  Inköpslista
                </button>
              </div>

              {/* Portions-kontroll endast för Veckans rätter */}
              {viewMode === 'recipe' && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-900">
                      Portioner per rätt:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePortionChange(portions - 1)}
                        disabled={portions <= 1}
                        className="w-7 h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium text-gray-900 text-sm">
                        {portions}
                      </span>
                      <button
                        onClick={() => handlePortionChange(portions + 1)}
                        disabled={portions >= 8}
                        className="w-7 h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Innehåll baserat på vald vy */}
              {viewMode === 'recipe' ? (
                /* Vy 1: Grupperat per recept */
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {getIngredientsByRecipe().map((group, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {group.recipe.name}
                          </h4>
                          <span className="text-xs text-gray-600">
                            {portions} port.
                          </span>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {group.ingredients.map((ingredient, ingIndex) => {
                          const adjustedQuantity = Math.round(ingredient.quantity * (portions / 4) * 100) / 100
                          return (
                            <div key={ingIndex} className="flex items-center justify-between px-3 py-2">
                              <span className="text-gray-900 text-sm">{ingredient.name}</span>
                              <span className="text-gray-600 text-sm">
                                {adjustedQuantity} {ingredient.unit}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Vy 2: Inköpslista med checkboxes */
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {Object.entries(getCategorizedIngredients()).map(([category, ingredients]) => (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {category}
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {ingredients.map((ingredient, index) => (
                          <label key={index} className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            checkedIngredients.has(ingredient.name) ? 'line-through text-gray-400' : ''
                          }`}>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={checkedIngredients.has(ingredient.name)}
                                onChange={() => toggleIngredient(ingredient.name)}
                                className="sr-only"
                              />
                              <div className={`${buttonStyles.checkbox} ${
                                checkedIngredients.has(ingredient.name)
                                  ? buttonStyles.checkboxActive
                                  : buttonStyles.checkboxInactive
                              }`}>
                                {checkedIngredients.has(ingredient.name) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 font-medium text-gray-900">
                              {ingredient.name}
                            </div>
                            <div className="text-gray-900 text-sm">
                              {ingredient.totalQuantity} {ingredient.unit}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sammanfattning endast för inköpslistan */}
              {viewMode === 'shopping' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center text-sm">
                    {checkedIngredients.size >= ingredientsWithQuantities.length ? (
                      <span className="text-gray-900 font-medium">Du har allt!</span>
                    ) : (
                      <span className="text-gray-600">
                        Kvar: {ingredientsWithQuantities.length - checkedIngredients.size} av {ingredientsWithQuantities.length}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // Render rekommendationer sektion
  const renderRecommendationsSection = () => {
    if (!hasRecommendations) {
      return (
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Rekommendationer
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto px-2">
              Lägg till recept i veckoplanen för att få rekommendationer
            </p>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
          {/* Header med titel, collapse-knapp och filter */}
          <div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-3 sm:mb-4'}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Rekommendationer ({recommendations.length})
                </h2>
              </div>
            </div>
            
            {/* Collapse-knapp */}
            <button
              onClick={toggleCollapse}
              className="p-1.5 sm:p-2 hover:bg-white rounded-lg transition-colors duration-200 group inline-flex items-center justify-center"
              title={isCollapsed ? "Expandera" : "Vik ihop"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
              ) : (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
              )}
            </button>
          </div>
          
          {!isCollapsed && (
            <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
              {recommendations.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe}
                  showOverlap={true}
                  overlapCount={recipe.overlapCount}
                  overlapIngredients={recipe.overlapIngredients}
                  onAddToDay={() => openDaySelector(recipe)}
                  onShowDetails={() => handleShowRecipeDetails(recipe)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal för receptdetaljer - använder samma som Recipe.tsx */}
        {selectedRecipe && showRecipeDetails && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            isOpen={showRecipeDetails}
            onClose={handleCloseRecipeDetails}
          />
        )}

        {/* Modal för att välja dag - använder samma design som Recipe.tsx */}
        {showDaySelector && selectedRecipe && (
          <div 
            className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-selector-title"
            aria-describedby="day-selector-description"
          >
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 id="day-selector-title" className="text-lg font-semibold text-gray-900 mb-6">
                <span className="text-sm font-normal text-gray-600">Välj dag för: </span>
                <span className="text-xl font-bold text-gray-900">{selectedRecipe.name}</span>
              </h3>
              
              <div 
                className="space-y-3 mb-8"
                role="group"
                aria-labelledby="day-selector-title"
                id="day-selector-description"
              >
                {state.weekPlan.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => handleAddToDay(selectedRecipe, day.day)}
                    className={`w-full text-left p-4 rounded-lg transition-colors touch-target ${
                      day.recipes.length > 0 
                        ? 'bg-gray-50 hover:bg-gray-100 border border-gray-300' 
                        : 'bg-white border border-dashed border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={`Lägg till ${selectedRecipe.name} på ${day.day}`}
                  >
                    <span className="font-medium text-gray-900">{day.day}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      | {day.recipes.length === 0 ? 'Inga måltider planerade' : day.recipes.length === 1 ? '1 måltid planerad' : `${day.recipes.length} måltider planerade`}
                    </span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={closeDaySelector}
                className={buttonStyles.gradient}
                aria-label="Stäng dag-väljaren"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="space-y-4">
      {renderRecommendationsSection()}
      {renderIngredientsSection()}
    </div>
  )
})

IngredientsAndRecommendations.displayName = 'IngredientsAndRecommendations'

export default IngredientsAndRecommendations
