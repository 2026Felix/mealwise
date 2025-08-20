import { useRecipeContext } from '../context/RecipeContext'
import { useState, useMemo, useEffect } from 'react'
import RecipeCard from './RecipeCard'
import { Search } from 'lucide-react'
import { sanitizeUserInput } from '../utils/security'

const RecipeLibrary: React.FC = () => {
  const { state, dispatch } = useRecipeContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showDaySelector, setShowDaySelector] = useState(false)

  // Filtrera recept baserat på sökfältet
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return state.recipeLibrary
    
    // Sanitera sökfrågan för säkerhet
    const sanitizedQuery = sanitizeUserInput(searchQuery, 50).toLowerCase()
    if (!sanitizedQuery) return state.recipeLibrary
    
    return state.recipeLibrary.filter(recipe => 
      recipe.name.toLowerCase().includes(sanitizedQuery) ||
      recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(sanitizedQuery)
      )
    )
  }, [state.recipeLibrary, searchQuery])

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

  return (
    <div className="bg-component rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text">
          Alla recept
        </h2>
        
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
            className="w-full px-3 py-2 bg-background border border-text/20 rounded-lg text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-text/30 focus:border-transparent text-sm"
          />
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text/40" 
          />
        </div>
      </div>
      
      {filteredRecipes.length === 0 && searchQuery.trim() ? (
        <p className="text-center py-6 sm:py-8">
          <p className="text-text/60 text-sm">
            Inga recept hittades för "<span className="font-medium">{sanitizeUserInput(searchQuery, 50)}</span>"
          </p>
        </p>
      ) : (
        <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
              showAddButton={true}
              onAddToDay={() => openDaySelector(recipe)}
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
    </div>
  )
}

export default RecipeLibrary
