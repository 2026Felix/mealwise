import { useState, useMemo } from 'react'
import { useRecipeContext } from '../context/AppState'
import { useRecipeFilters } from '../hooks/useFiltering'
import { commonClasses, responsiveText, spacing, buttonStyles } from '../utils/uiStyles'
import { sanitizeUserInput } from '../utils/validation'
import { Search, ImageOff, Users } from 'lucide-react'
import RecipeModal from './RecipeModal'
import type { Recipe } from '../types'

const RecipesPage: React.FC = () => {
  const { state } = useRecipeContext()
  const { activeFilters, toggleFilter, clearFilters, filterButtons } = useRecipeFilters()
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(12) // Visa 12 recept initialt
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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
        // SNABB - heuristik: prepTime <= 30
        if (activeFilters.has('snabb') && recipe.prepTime > 30) return false

        // VEGETARISK - recept utan kött/fisk
        if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false

        // VEGANSK - kräver tagg eftersom vi inte härleder från ingredienser
        if (activeFilters.has('vegansk') && !(recipe.tags?.includes('Vegansk'))) return false

        // VARDAGSMIDDAG - kräver tagg
        if (activeFilters.has('vardagsmiddag') && !(recipe.tags?.includes('Vardagsmiddag'))) return false

        // FEST - kräver tagg
        if (activeFilters.has('fest') && !(recipe.tags?.includes('Fest'))) return false

        return true
      })
    }

    return recipes
  }, [state.recipeLibrary, searchQuery, activeFilters])
  
  const totalRecipes = filteredRecipes.length
  const visibleRecipes = filteredRecipes.slice(0, visibleCount)
  const hasMore = visibleCount < totalRecipes

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, totalRecipes))
  }

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsModalOpen(true)
  }

  const closeRecipeModal = () => {
    setIsModalOpen(false)
    setSelectedRecipe(null)
  }

  return (
    <div className={`${commonClasses.container} ${spacing.section}`}>
      <div className="py-6 sm:py-8 lg:py-10">

        
        {/* Sök och filter - Centrerat och 50% bredd */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md">
            {/* Rubrik */}
            <div className="text-center mb-6">
              <h1 className={`${responsiveText.h2} font-semibold text-gray-900 mb-2`}>Hitta det perfekta receptet för dig</h1>
            </div>
            {/* Sökfält */}
            <div className="mb-4">
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Sök recept eller ingredienser..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.slice(0, 50))}
                  className={`${commonClasses.input} pl-9`}
                  maxLength={50}
                  aria-label="Sök recept eller ingredienser"
                />
              </div>
            </div>

            {/* Filter-knappar */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filtrera recept">
                {filterButtons.map(({ key, label, description }) => (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className={`${buttonStyles.filterTag} ${
                      activeFilters.has(key) 
                        ? buttonStyles.filterTagActive
                        : ''
                    }`}
                    title={description}
                    aria-pressed={activeFilters.has(key)}
                    aria-describedby={`filter-${key}-description`}
                  >
                    {label}
                    <span id={`filter-${key}-description`} className="sr-only">
                      {description}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Rensa filter länk */}
              {activeFilters.size > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-gray-700 hover:text-gray-900 underline text-sm transition-colors"
                >
                  Rensa filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inga resultat meddelande */}
        {filteredRecipes.length === 0 && (searchQuery.trim() || activeFilters.size > 0) ? (
          <div className="text-center py-8" role="status" aria-live="polite">
            <p className="text-gray-600 text-sm">
              {searchQuery.trim() 
                ? `Inga recept hittades för "${sanitizeUserInput(searchQuery, 50)}"`
                : 'Inga recept matchar de valda filtren'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                clearFilters()
              }}
              className="mt-2 text-gray-700 hover:text-gray-900 underline text-sm"
              aria-label="Rensa sökning och filter för att visa alla recept"
            >
              Rensa sökning och filter
            </button>
          </div>
        ) : (
          <>
            {/* Receptkort grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-x-5 gap-y-10">
          {visibleRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-lg"
              role="button"
              tabIndex={0}
              aria-label={`Öppna ${recipe.name}`}
              onClick={() => openRecipeModal(recipe)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openRecipeModal(recipe)
                }
              }}
            >
              {/* Bild / Placeholder */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-[3/4] bg-gray-200 relative">
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  )}
                  {!recipe.image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageOff aria-hidden="true" className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recept info - utanför kortet */}
              <div className="mt-2">
                <div className="text-xs font-semibold text-gray-900 mb-2">
                  {recipe.totalTime} MIN
                </div>
                <div className="text-base font-semibold text-gray-900 leading-tight">
                  {recipe.name}
                </div>
              </div>
            </div>
          ))}
        </div>

            {/* Visa fler knapp */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Visa fler ({totalRecipes - visibleCount} kvar)
                </button>
              </div>
            )}
          </>
        )}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            isOpen={isModalOpen}
            onClose={closeRecipeModal}
          />
        )}
      </div>
    </div>
  )
}

export default RecipesPage
