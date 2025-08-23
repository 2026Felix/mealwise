import { useRecipeContext } from '../context/RecipeContext'
import { useState } from 'react'
import { ShoppingCart, ChevronDown, ChevronUp, X, Check } from 'lucide-react'

const CommonIngredientsDisplay: React.FC = () => {
  const { getIngredientsWithQuantitiesFromContext, state } = useRecipeContext()
  const baseIngredientsWithQuantities = getIngredientsWithQuantitiesFromContext()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showDetailedList, setShowDetailedList] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'recipe' | 'shopping'>('recipe')
  const [portions, setPortions] = useState(4)

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

  if (!hasPlannedRecipes) {
    return (
      <div className="bg-component rounded-xl p-3 sm:p-4 border border-gray-200">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-text/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-text/40" />
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
    <>
      <div className="bg-component rounded-xl p-3 sm:p-4 border border-gray-200">
        {/* Header med titel, collapse-knapp och detaljerad lista-knapp */}
        <div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-3 sm:mb-4'}`}> 
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-text/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-text" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-text">
                Alla ingredienser ({ingredientsWithQuantities.length})
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Visa detaljerad lista knapp */}
            <button
              onClick={() => setShowDetailedList(true)}
              className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors font-medium"
              title="Visa översikt över ingredienser"
            >
              Inköpslistan
            </button>
            
            {/* Collapse-knapp */}
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

      {/* Modal för detaljerad ingredienslista */}
      {showDetailedList && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-text">
                Överblick
              </h3>
              <button
                onClick={() => setShowDetailedList(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text/60" />
              </button>
            </div>

            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setViewMode('recipe')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'recipe'
                    ? 'bg-white text-text shadow-sm border border-gray-200'
                    : 'text-text/60 hover:text-text hover:bg-gray-50'
                }`}
              >
                Veckans rätter
              </button>
              <button
                onClick={() => setViewMode('shopping')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'shopping'
                    ? 'bg-white text-text shadow-sm border border-gray-200'
                    : 'text-text/60 hover:text-text hover:bg-gray-50'
                }`}
              >
                Inköpslista
              </button>
            </div>

            {/* Portions-kontroll endast för Veckans rätter */}
            {viewMode === 'recipe' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text">
                    Portioner per rätt:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePortionChange(portions - 1)}
                      disabled={portions <= 1}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-text">
                      {portions}
                    </span>
                    <button
                      onClick={() => handlePortionChange(portions + 1)}
                      disabled={portions >= 8}
                      className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <h4 className="font-medium text-text text-sm">
                          {group.recipe.name}
                        </h4>
                        <span className="text-xs text-text/60 bg-white px-2 py-1 rounded-full">
                          {portions} portioner
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {group.ingredients.map((ingredient, ingIndex) => {
                        const adjustedQuantity = Math.round(ingredient.quantity * (portions / 4) * 100) / 100
                        return (
                          <div key={ingIndex} className="flex items-center justify-between px-3 py-2">
                            <span className="text-text text-sm">{ingredient.name}</span>
                            <span className="text-text/60 text-sm">
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
                    <div className="bg-blue-50 px-3 py-2 border-b border-gray-200">
                      <h4 className="font-medium text-text text-sm">
                        {category}
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {ingredients.map((ingredient, index) => (
                        <label key={index} className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          checkedIngredients.has(ingredient.name) ? 'line-through text-text/40' : ''
                        }`}>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={checkedIngredients.has(ingredient.name)}
                              onChange={() => toggleIngredient(ingredient.name)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                              checkedIngredients.has(ingredient.name)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {checkedIngredients.has(ingredient.name) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 font-medium text-text">
                            {ingredient.name}
                          </div>
                          <div className="text-text text-sm">
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
                  <span className="text-text/60">
                    Kvar: {ingredientsWithQuantities.length - checkedIngredients.size} av {ingredientsWithQuantities.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CommonIngredientsDisplay
