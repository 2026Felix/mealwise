import { useRecipeContext } from '../context/RecipeContext'
import { useState, useMemo, useEffect } from 'react'
import RecipeCard from './RecipeCard'
import RecipeDetailModal from './RecipeDetailModal'
import { Search } from 'lucide-react'
import { sanitizeUserInput } from '../utils/security'
import { commonClasses } from '../utils/commonStyles'
import { FilterType } from '../hooks/useRecipeFilters'
import { Recipe } from '../types'

interface RecipeLibraryProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

const RecipeLibrary: React.FC<RecipeLibraryProps> = ({
  activeFilters,
  onToggleFilter,
  onClearFilters,
  filterButtons
}) => {
  const { state, dispatch } = useRecipeContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showDaySelector, setShowDaySelector] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)

  // Filtrera recept baserat på sökfältet och aktiva filter
  const filteredRecipes = useMemo(() => {
    let recipes = state.recipeLibrary

    // Sökfilter
    if (searchQuery.trim()) {
      const sanitizedQuery = sanitizeUserInput(searchQuery, 50).toLowerCase()
      if (sanitizedQuery) {
        recipes = recipes.filter(recipe => 
          recipe.name.toLowerCase().includes(sanitizedQuery) ||
          recipe.ingredients.some(ingredient => 
            ingredient.name.toLowerCase().includes(sanitizedQuery)
          )
        )
      }
    }

    // Filter-logik
    if (activeFilters.size > 0) {
      recipes = recipes.filter(recipe => {
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

    return recipes
  }, [state.recipeLibrary, searchQuery, activeFilters])

  // Töm sökfältet när veckoplanen uppdateras (när recept läggs till)
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchQuery('')
    }
  }, [state.weekPlan])

  const handleAddToDay = (recipe: any, day: string) => {
    dispatch({
      type: 'ADD_RECIPE_TO_DAY',
      day: day,
      recipe
    })
    setSelectedDay(null)
    setShowDaySelector(false)
  }

  const openDaySelector = (recipe: any) => {
    setSelectedDay(recipe.id)
    setShowDaySelector(true)
  }

  const handleShowRecipeDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetails(true)
  }

  const handleCloseRecipeDetails = () => {
    setShowRecipeDetails(false)
    setSelectedRecipe(null)
  }

  return (
    <div className="bg-component rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text">
          Alla recept
        </h2>
        
        {/* Höger sida: Sökfält och Rensa filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Sökfält */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Sök recept eller ingredienser..."
              value={searchQuery}
              onChange={(e) => {
                // Begränsa input-längd direkt vid inmatning
                const value = e.target.value.slice(0, 50)
                setSearchQuery(value)
              }}
              className={commonClasses.input}
            />
            <Search 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text/40" 
            />
          </div>
          
          {/* Rensa filter knapp */}
          {activeFilters.size > 0 && (
            <button
              onClick={onClearFilters}
              className="text-text/70 hover:text-text underline text-sm whitespace-nowrap"
            >
              Rensa filter
            </button>
          )}
        </div>
      </div>

      {/* Filter-knappar */}
      <div className={commonClasses.filter.container}>
        {filterButtons.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => onToggleFilter(key)}
            className={`${commonClasses.filter.button.base} ${
              activeFilters.has(key) 
                ? commonClasses.filter.button.active 
                : commonClasses.filter.button.inactive
            }`}
            title={description}
          >
            {label}
          </button>
        ))}
      </div>
      
      {filteredRecipes.length === 0 && (searchQuery.trim() || activeFilters.size > 0) ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-text/60 text-sm">
            {searchQuery.trim() 
              ? `Inga recept hittades för "${sanitizeUserInput(searchQuery, 50)}"`
              : 'Inga recept matchar de valda filtren'
            }
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              onClearFilters()
            }}
            className="mt-2 text-text/80 hover:text-text underline text-sm"
          >
            Rensa sökning och filter
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
              showAddButton={true}
              onAddToDay={() => openDaySelector(recipe)}
              onShowDetails={handleShowRecipeDetails}
            />
          ))}
        </div>
      )}

      {/* Mobil dag-väljare */}
      {showDaySelector && selectedDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text mb-4">Välj dag</h3>
            
            <div className="space-y-2">
              {state.weekPlan.map((day) => (
                <button
                  key={day.day}
                  onClick={() => {
                    const recipe = state.recipeLibrary.find(r => r.id === selectedDay)
                    if (recipe) {
                      handleAddToDay(recipe, day.day)
                    }
                  }}
                  className="w-full text-left p-3 bg-component hover:bg-text/10 rounded-lg transition-colors touch-target"
                >
                  <span className="font-medium text-text">{day.day}</span>
                  <span className="text-sm text-text/60 ml-2">
                    ({day.recipes.length} recept)
                  </span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowDaySelector(false)}
              className="w-full mt-4 p-3 bg-text/10 hover:bg-text/20 text-text rounded-lg transition-colors touch-target"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Receptdetaljer modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={showRecipeDetails}
          onClose={handleCloseRecipeDetails}
        />
      )}
    </div>
  )
}

export default RecipeLibrary
