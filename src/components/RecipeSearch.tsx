import { useState, useMemo, useCallback, memo, useEffect, useRef } from 'react'
import { useRecipeContext } from '../context/AppState'
import { Search, ClipboardList, CookingPot, CheckCircle } from 'lucide-react'
import { buttonStyles } from '../utils/uiStyles'
import { rankRecipesByIngredientOverlap } from '../utils/recipeHelpers'
import { Recipe } from '../types'
import RecipeModal from './RecipeModal'

// Ingrediens-tag komponent - visuell representation av valda ingredienser
const IngredientTag: React.FC<{
  ingredient: string
  isSelected: boolean
  onToggle: () => void
}> = ({ ingredient, isSelected, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-white text-gray-900 border border-gray-300 shadow-sm'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      {ingredient}
    </button>
  )
}

// Receptkort för rekommendationer - använder samma stil som huvudkomponenten
// Stöder drag&drop på desktop och touch-interaktioner på mobil
const RecipeCard: React.FC<{
  recipe: Recipe
  matchCount: number
  onShowDetails: () => void
}> = ({ recipe, matchCount, onShowDetails }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detektera mobilvy för att anpassa interaktioner
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

  const handleShowDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onShowDetails()
  }, [onShowDetails])

  return (
    <div 
      className={`bg-white border-2 border-solid rounded-lg p-2 sm:p-3 transition-colors duration-200 hover:bg-gray-50 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } h-12 sm:h-16 relative group touch-manipulation`}
      style={{
        borderColor: '#e5e7eb'
      }}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between h-full relative z-10">
        {/* Innehållssektion */}
        <div className="flex-1 min-w-0 flex items-center">
          {/* Receptnamn */}
          <h3 className="font-medium text-gray-900 text-sm leading-none">
            {recipe.name}
          </h3>
        </div>

        {/* Knappar och info i samma rad */}
        <div className="flex items-center gap-2 ml-2">
          {/* Match-antal */}
          <span 
            className="text-xs px-2 py-1 rounded-full whitespace-nowrap text-green-700 bg-green-100"
            aria-label={`${matchCount} matchande ingredienser`}
          >
            {matchCount} match
          </span>
          
          {/* Visa detaljer knapp */}
          <button
            onClick={handleShowDetails}
            className={buttonStyles.iconTransparentSmall}
            title="Visa receptdetaljer"
            aria-label={`Visa detaljer för ${recipe.name}`}
          >
            <CookingPot className="w-4 h-4 text-gray-600" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop hover-indikator - lägre z-index så den inte täcker texten */}
      {!isMobile && (
        <div 
          className="absolute inset-0 bg-transparent group-hover:bg-gray-50 transition-colors rounded-lg pointer-events-none z-0"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

const RecipeFinder: React.FC = memo(() => {
  const { state } = useRecipeContext()
  
  // State för ingrediensval, sökning och modaler
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Hämta alla unika ingredienser från receptbiblioteket
  // Skapar en sorterad lista av alla tillgängliga ingredienser
  const allIngredients = useMemo(() => {
    const ingredients = new Set<string>()
    state.recipeLibrary.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredients.add(ingredient.name.toLowerCase())
      })
    })
    return Array.from(ingredients).sort()
  }, [state.recipeLibrary])

  // Populära ingredienser baserat på frekvens i receptbiblioteket
  // Visar de 12 mest använda ingredienserna för snabbare val
  const popularIngredients = useMemo(() => {
    const ingredientCount = new Map<string, number>()
    
    // Räkna frekvens för varje ingrediens
    state.recipeLibrary.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const name = ingredient.name.toLowerCase()
        ingredientCount.set(name, (ingredientCount.get(name) || 0) + 1)
      })
    })
    
    // Sortera efter frekvens och ta de 12 mest populära
    return Array.from(ingredientCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([ingredient]) => ingredient)
  }, [state.recipeLibrary])

  // Filtrera ingredienser baserat på sökfältet
  // Visar endast ingredienser som matchar söktermen
  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) return allIngredients
    
    return allIngredients.filter(ingredient =>
      ingredient.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [allIngredients, searchQuery])

  // Beräkna rekommendationer baserat på valda ingredienser
  // Använder algoritm för att ranka recept efter ingrediensöverlapp
  const recommendations = useMemo(() => {
    if (selectedIngredients.size === 0) return []
    return rankRecipesByIngredientOverlap(state.recipeLibrary, selectedIngredients)
  }, [state.recipeLibrary, selectedIngredients])

  // Event handlers för ingrediensval och UI
  const toggleIngredient = useCallback((ingredient: string) => {
    const newSelected = new Set(selectedIngredients)
    if (newSelected.has(ingredient)) {
      // Ta bort ingrediens - behåll sökfältet
      newSelected.delete(ingredient)
    } else {
      // Lägg till ny ingrediens - rensa sökfältet och stäng dropdown
      newSelected.add(ingredient)
      setSearchQuery('')
      setIsSearchFocused(false) // Stäng dropdown när ingrediens väljs
      // Tappa fokus så användaren kan klicka igen för att öppna dropdown
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
    setSelectedIngredients(newSelected)
  }, [selectedIngredients])

  const clearAll = useCallback(() => {
    setSelectedIngredients(new Set())
    setSearchQuery('') // Rensa sökfältet när alla ingredienser rensas
  }, [])

  const handleShowRecipeDetails = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetails(true)
  }, [])

  const handleCloseRecipeDetails = useCallback(() => {
    setShowRecipeDetails(false)
    setSelectedRecipe(null)
  }, [])

    return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      
      {/* Header */}
      <div className="text-center relative z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Lägg in vad du har hemma...
        </h1>
        <p className="text-gray-900 text-sm sm:text-base">
          och få rekommendationer på rätter som passar.
        </p>
      </div>

                    {/* Sökfält med dropdown för ingrediensval */}
       <div className="relative z-40">
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
         <input
           ref={inputRef}
           type="text"
           placeholder="Pasta? Lök? Ägg?"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           onFocus={() => setIsSearchFocused(true)}
           onBlur={() => setIsSearchFocused(false)}
           className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900"
         />
         
         {/* Dropdown med sökresultat och populära ingredienser */}
         {isSearchFocused && (
           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-60 overflow-y-auto">
             <div className="py-2">
               {/* Sökresultat - visas bara när användaren skriver */}
               {searchQuery.trim() && filteredIngredients.length > 0 && (
                 <>
                   <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                     Sökresultat
                   </div>
                   {filteredIngredients.map((ingredient, index) => (
                     <div key={ingredient}>
                       <button
                         onMouseDown={(e) => {
                           e.preventDefault()
                           toggleIngredient(ingredient)
                         }}
                         className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                           selectedIngredients.has(ingredient) ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                         }`}
                       >
                         {ingredient}
                       </button>
                       {index < filteredIngredients.length - 1 && (
                         <div className="border-t border-gray-100"></div>
                       )}
                     </div>
                   ))}
                 </>
               )}
               
               {/* Populära ingredienser - visas bara när sökfältet är tomt */}
               {popularIngredients.length > 0 && !searchQuery.trim() && (
                 <>
                   <div className="px-4 py-2 text-xs font-semibold text-black-500 tracking-wide">
                     Finns ofta hemma
                   </div>
                   {popularIngredients.map((ingredient, index) => (
                     <div key={`popular-${ingredient}`}>
                       <button
                         onMouseDown={(e) => {
                           e.preventDefault()
                           toggleIngredient(ingredient)
                         }}
                         className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                           selectedIngredients.has(ingredient) ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                         }`}
                       >
                         {ingredient}
                       </button>
                       {index < popularIngredients.length - 1 && (
                         <div className="border-t border-gray-100"></div>
                       )}
                     </div>
                   ))}
                 </>
               )}
               
               {searchQuery.trim() && filteredIngredients.length === 0 && (
                 <p className="text-center text-gray-500 text-sm py-4">
                   Inga ingredienser hittades
                 </p>
               )}
             </div>
           </div>
         )}
       </div>



         {/* Valda ingredienser - visar taggar för alla valda ingredienser */}
         {selectedIngredients.size > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Vad du har hemma
                </h3>
              </div>
              <button
                onClick={clearAll}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
              >
                Rensa
              </button>
            </div>
           <div className="flex flex-wrap gap-2">
             {Array.from(selectedIngredients).map(ingredient => (
               <IngredientTag
                 key={ingredient}
                 ingredient={ingredient}
                 isSelected={true}
                 onToggle={() => toggleIngredient(ingredient)}
               />
             ))}
           </div>
           </div>
         )}

       {/* Rekommendationer - sorterade efter matchande ingredienser */}
       {recommendations.length > 0 && (
         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative z-10">
           <h3 className="font-medium text-gray-900 mb-4">
             Rekommendationer
           </h3>
           <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
             {recommendations.map((recipe) => (
               <RecipeCard
                 key={recipe.id}
                 recipe={recipe}
                 matchCount={recipe.matchCount}
                 onShowDetails={() => handleShowRecipeDetails(recipe)}
               />
             ))}
           </div>
         </div>
       )}

      {/* Tom state - när inga recept matchar valda ingredienser */}
      {selectedIngredients.size > 0 && recommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Inga recept hittades
          </h3>
          <p className="text-gray-600 text-sm">
            Prova att lägga till fler ingredienser eller ta bort några
          </p>
        </div>
      )}

      {/* Starta state - när inga ingredienser är valda */}
      {selectedIngredients.size === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            Inga ingredienser valda
          </h3>
        </div>
      )}

      {/* Modal för receptdetaljer - visar fullständig receptinformation */}
      {selectedRecipe && showRecipeDetails && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={showRecipeDetails}
          onClose={handleCloseRecipeDetails}
        />
      )}
    </div>
  )
})

RecipeFinder.displayName = 'RecipeFinder'

export default RecipeFinder
