import { useRecipeContext } from '../context/RecipeContext'
import { useState } from 'react'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'

const CommonIngredientsDisplay: React.FC = () => {
  const { getIngredientsWithQuantitiesFromContext } = useRecipeContext()
  const ingredientsWithQuantities = getIngredientsWithQuantitiesFromContext()
  const hasPlannedRecipes = ingredientsWithQuantities.length > 0
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!hasPlannedRecipes) {
    return (
      <div className="bg-component rounded-xl p-3 sm:p-4 border border-gray-200">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-text/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-text/40" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-text mb-1">
            Alla ingredienser
          </h2>
          <p className="text-text/60 text-xs sm:text-sm max-w-md mx-auto px-2">
            Lägg till recept i veckoplanen
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-component rounded-xl p-3 sm:p-4 border border-gray-200">
      {/* Header med titel och collapse-knapp */}
      <div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-3 sm:mb-4'}`}> 
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-text/20 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-text" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-text">
              Alla ingredienser ({ingredientsWithQuantities.length})
            </h2>
          </div>
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          				className="p-1.5 sm:p-2 hover:bg-background rounded-lg transition-colors duration-200 group"
          title={isCollapsed ? "Expandera" : "Vik ihop"}
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-text/60 group-hover:text-text transition-colors duration-200" />
          ) : (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-text/60 group-hover:text-text transition-colors duration-200" />
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {ingredientsWithQuantities.map((ingredient, index) => (
            <span
              key={index}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-text text-xs sm:text-sm rounded-full border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              {ingredient.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommonIngredientsDisplay
