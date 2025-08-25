import { useRecipeContext } from '../context/RecipeContext'
import { useState, useMemo, useCallback, memo } from 'react'
import { Brain, ChevronDown, ChevronUp } from 'lucide-react'
import RecipeCard from './RecipeCard'
import RecipeDetailModal from './RecipeDetailModal'
import { buttonStyles } from '../utils/commonStyles'
import { FilterType } from '../hooks/useRecipeFilters'
import { useScrollLock } from '../hooks/useScrollLock'

interface SmartRecommendationsProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = memo(({ 
  activeFilters, 
  onToggleFilter, 
  onClearFilters, 
  filterButtons 
}) => {
  const { state, dispatch } = useRecipeContext()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [showDaySelector, setShowDaySelector] = useState(false)

  // Lås scroll när day selector modalen är öppen
  useScrollLock(showDaySelector)

  // Beräkna smarta rekommendationer baserat på gemensamma ingredienser
  const recommendations = useMemo(() => {
    if (!state.weekPlan.length) return []

    // Samla alla planerade ingredienser
    const plannedIngredients = new Set<string>()
    state.weekPlan.forEach(day => {
      day.recipes.forEach(mealInstance => {
        mealInstance.recipe.ingredients.forEach(ingredient => {
          plannedIngredients.add(ingredient.name.toLowerCase())
        })
      })
    })

    // Hitta recept som delar ingredienser med planerade måltider
    let recommendationsWithOverlap = state.recipeLibrary
      .filter(recipe => {
        // Exkludera redan planerade recept
        const isAlreadyPlanned = state.weekPlan.some(day =>
          day.recipes.some(mealInstance => mealInstance.recipe.id === recipe.id)
        )
        if (isAlreadyPlanned) return false

        // Beräkna överlapp med planerade ingredienser
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase())
        const overlap = recipeIngredients.filter(ing => plannedIngredients.has(ing))
        return overlap.length > 0
      })
      .map(recipe => {
        const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase())
        const overlap = recipeIngredients.filter(ing => plannedIngredients.has(ing))
        return {
          ...recipe,
          overlapCount: overlap.length,
          overlapIngredients: overlap
        }
      })
      .sort((a, b) => b.overlapCount - a.overlapCount) // Sortera efter mest överlapp

    // Applicera filter på rekommendationer
    if (activeFilters.size > 0) {
      recommendationsWithOverlap = recommendationsWithOverlap.filter(recipe => {
        // BILLIG - recept med färre ingredienser eller kortare tillagningstid
        if (activeFilters.has('billig') && !(
          recipe.ingredients.length <= 4 || recipe.prepTime <= 30
        )) return false

        // ENKEL - recept med låg svårighetsgrad
        if (activeFilters.has('enkel') && recipe.difficulty !== 'easy') return false

        // SNABB - recept med kort tillagningstid
        if (activeFilters.has('snabb') && recipe.prepTime > 30) return false

        // VEGETARISK - recept utan kött/fisk
        if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false

        return true
      })
    }

    return recommendationsWithOverlap
  }, [state.weekPlan, state.recipeLibrary, activeFilters])

  const hasRecommendations = recommendations.length > 0

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
                onShowDetails={handleShowRecipeDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal för receptdetaljer */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={showRecipeDetails}
          onClose={handleCloseRecipeDetails}
        />
      )}

      {/* Modal för att välja dag */}
      {showDaySelector && selectedRecipe && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <span className="text-sm font-normal text-gray-600">Välj dag för: </span>
              <span className="text-xl font-bold text-gray-900">{selectedRecipe.name}</span>
            </h3>
            
            <div className="space-y-3 mb-8">
              {state.weekPlan.map((day) => (
                <button
                  key={day.day}
                  onClick={() => handleAddToDay(selectedRecipe, day.day)}
                  className={`w-full text-left p-4 rounded-lg transition-colors touch-target ${
                    day.recipes.length > 0 
                      ? 'bg-gray-50 hover:bg-gray-100 border border-gray-300' 
                      : 'bg-white border border-dashed border-gray-300 hover:bg-gray-50'
                  }`}
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
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </>
  )
})

SmartRecommendations.displayName = 'SmartRecommendations'

export default SmartRecommendations
