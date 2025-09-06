import { useRecipeContext } from '../context/RecipeContext'
import { useState, useMemo, useEffect, useCallback, memo, useRef } from 'react'
import { Search, X, Clock, Users, CookingPot } from 'lucide-react'
import { sanitizeUserInput } from '../utils/security'
import { commonClasses, buttonStyles } from '../utils/commonStyles'
import { FilterType } from '../hooks/useRecipeFilters'
import { Recipe as RecipeType } from '../types'
import { useScrollLock } from '../hooks/useScrollLock'
import { getCategoryColor } from '../utils/recipeUtils'
import RecipeDetailModal from './RecipeDetailModal'

// Performance monitoring
const usePerformanceMonitor = () => {
  const renderCount = useRef(0)
  
  useEffect(() => {
    renderCount.current += 1
    // Development logging (will be removed in production build)
    if (import.meta.env.DEV) {
      console.log(`Recipe component rendered ${renderCount.current} times`)
    }
  })
  
  return renderCount.current
}

interface RecipeProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

// Neutral färgkodning för receptkategorier - nu importerad från recipeUtils

// RecipeCard komponent
interface RecipeCardProps {
	recipe: RecipeType
	showOverlap?: boolean
	overlapCount?: number
	overlapIngredients?: string[]
	onAddToDay?: (recipe: RecipeType) => void
	onShowDetails?: (recipe: RecipeType) => void
}

const RecipeCard: React.FC<RecipeCardProps> = memo(({ 
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

	const handleAddToDay = useCallback(() => {
		if (onAddToDay) {
			onAddToDay(recipe)
		}
	}, [onAddToDay, recipe])

	const handleShowDetails = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		if (onShowDetails) {
			onShowDetails(recipe)
		}
	}, [onShowDetails, recipe])

	const handleClick = useCallback(() => {
		if (isMobile && onAddToDay) {
			handleAddToDay()
		}
	}, [isMobile, onAddToDay, handleAddToDay])

	// Keyboard navigation support
	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (onAddToDay) {
				handleAddToDay()
			}
		}
	}, [onAddToDay, handleAddToDay])

	const categoryColor = getCategoryColor(recipe.category)
	
	return (
		<div 
			className={`bg-white border-2 border-solid rounded-lg p-2 sm:p-3 transition-colors duration-200 hover:bg-gray-50 ${
				isDragging ? 'opacity-50 scale-95' : ''
			} h-12 sm:h-16 relative group touch-manipulation ${isMobile && onAddToDay ? 'cursor-pointer' : ''}`}
			style={{
				borderColor: categoryColor !== 'transparent' ? categoryColor : '#e5e7eb'
			}}
			draggable={!isMobile}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role={onAddToDay ? "button" : "article"}
			tabIndex={onAddToDay ? 0 : -1}
			aria-label={`${recipe.name}${onAddToDay ? ', klicka för att lägga till i veckoplan' : ''}`}
			aria-describedby={`recipe-${recipe.id}-description`}
		>
			<div className="flex items-center justify-between h-full relative z-10">
				{/* Innehållssektion */}
				<div className="flex-1 min-w-0 flex flex-col justify-center">
					{/* Receptnamn */}
					<h3 className="font-medium text-gray-900 text-sm leading-none">
						{recipe.name}
					</h3>
					{/* Hidden description for screen readers */}
					<div id={`recipe-${recipe.id}-description`} className="sr-only">
						{recipe.description || `Recept för ${recipe.name}`}
					</div>
				</div>

				{/* Knappar och info i samma rad */}
				<div className="flex items-center gap-2 ml-2">
					{/* Antal gemensamma ingredienser - förenklad */}
					{showOverlap && (
						<span 
							className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
								overlapCount > 0 
									? 'text-gray-600 bg-gray-100' 
									: 'text-gray-400 bg-gray-50'
							}`}
							aria-label={`${overlapCount} gemensamma ingredienser med planerade måltider`}
						>
							{overlapCount} gem.
						</span>
					)}
					
					{/* Visa detaljer knapp */}
					{onShowDetails && (
						<button
							onClick={handleShowDetails}
							className={buttonStyles.iconTransparentSmall}
							title="Visa receptdetaljer"
							aria-label={`Visa detaljer för ${recipe.name}`}
						>
							<CookingPot className="w-4 h-4 text-gray-600" aria-hidden="true" />
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
})

RecipeCard.displayName = 'RecipeCard'



// Huvudkomponenten Recipe (tidigare RecipeLibrary)
const Recipe: React.FC<RecipeProps> = ({
  activeFilters,
  onToggleFilter,
  onClearFilters,
  filterButtons
}) => {
  const { state, dispatch } = useRecipeContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showDaySelector, setShowDaySelector] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Lås scroll när dag-väljaren är öppen
  useScrollLock(showDaySelector)
  
  // Performance monitoring
  usePerformanceMonitor()

  // Debounced search query för bättre performance
  const debouncedSearchQuery = useMemo(() => {
    const timeoutId = setTimeout(() => searchQuery, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Filtrera recept baserat på sökfältet och aktiva filter
  const filteredRecipes = useMemo(() => {
    let recipes = state.recipeLibrary

    // Sökfilter med debouncing
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
    setIsLoading(true)
    try {
      dispatch({
        type: 'ADD_RECIPE_TO_DAY',
        day: day,
        recipe
      })
      setSelectedDay(null)
      setShowDaySelector(false)
    } catch (error) {
      console.error('Kunde inte lägga till recept:', error)
      // Här kan du lägga till användarfeedback om det behövs
    } finally {
      setIsLoading(false)
    }
  }

  const openDaySelector = (recipe: any) => {
    setSelectedDay(recipe.id)
    setShowDaySelector(true)
  }

  const handleShowRecipeDetails = (recipe: RecipeType) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetails(true)
  }

  const handleCloseRecipeDetails = () => {
    setShowRecipeDetails(false)
    setSelectedRecipe(null)
  }

     return (
     <section 
       id="recipe-library" 
       className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200"
       aria-labelledby="recipe-library-title"
       aria-describedby="recipe-library-description"
     >
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
         <div className="flex items-center justify-between sm:block">
           <h2 id="recipe-library-title" className="text-xl font-semibold text-gray-900">
             Alla recept
           </h2>
           <p id="recipe-library-description" className="sr-only">
             Bläddra och sök bland alla tillgängliga recept. Använd filter för att hitta specifika typer av recept.
           </p>
          
          {/* Rensa filter länk - endast synlig på mobil, i linje med titeln */}
          {activeFilters.size > 0 && filteredRecipes.length > 0 && (
            <div className="sm:hidden">
              <button
                onClick={onClearFilters}
                className="text-gray-700 hover:text-gray-900 underline text-sm transition-colors"
              >
                Rensa filter
              </button>
            </div>
          )}
        </div>
        
        {/* Höger sida: Sökfält */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
                     {/* Sökfält */}
           <div className="relative w-full sm:w-64">
             <label htmlFor="recipe-search" className="sr-only">
               Sök recept eller ingredienser
             </label>
             <input
               id="recipe-search"
               type="search"
               placeholder="Sök recept eller ingredienser..."
               value={searchQuery}
               onChange={(e) => {
                 // Begränsa input-längd direkt vid inmatning
                 const value = e.target.value.slice(0, 50)
                 setSearchQuery(value)
               }}
               className={commonClasses.input}
               aria-describedby="search-help"
               maxLength={50}
             />
             <Search 
               className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
               aria-hidden="true"
             />
             <div id="search-help" className="sr-only">
               Ange receptnamn eller ingrediens för att söka. Max 50 tecken.
             </div>
           </div>
        </div>
      </div>

      {/* Filter-knappar */}
      <div className={commonClasses.filter.container}>
                 <div className="flex flex-wrap gap-2 flex-1" role="group" aria-label="Filtrera recept">
           {filterButtons.map(({ key, label, description }) => (
             <button
               key={key}
               onClick={() => onToggleFilter(key)}
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
        
        {/* Rensa filter länk - flyttad till höger sida av filter-taggarna, endast synlig på desktop */}
        {activeFilters.size > 0 && filteredRecipes.length > 0 && (
          <div className="hidden sm:block">
            <button
              onClick={onClearFilters}
              className="text-gray-700 hover:text-gray-900 underline text-sm transition-colors whitespace-nowrap"
            >
              Rensa filter
            </button>
          </div>
        )}
      </div>
      
             {filteredRecipes.length === 0 && (searchQuery.trim() || activeFilters.size > 0) ? (
         <div className="text-center py-6 sm:py-8" role="status" aria-live="polite">
           <p className="text-gray-600 text-sm">
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
             className="mt-2 text-gray-700 hover:text-gray-900 underline text-sm"
             aria-label="Rensa sökning och filter för att visa alla recept"
           >
             Rensa sökning och filter
           </button>
         </div>
       ) : (
                 <div 
           className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto"
           role="list"
           aria-label={`${filteredRecipes.length} recept hittades`}
           aria-live="polite"
         >
           {filteredRecipes.map((recipe) => (
             <div key={recipe.id} role="listitem">
               <RecipeCard 
                 recipe={recipe}
                 onAddToDay={() => openDaySelector(recipe)}
                 onShowDetails={handleShowRecipeDetails}
               />
             </div>
           ))}
         </div>
      )}

             {/* Mobil dag-väljare */}
       {showDaySelector && selectedDay && (
         <>
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
               <span className="text-xl font-bold text-gray-900">{state.recipeLibrary.find(r => r.id === selectedDay)?.name}</span>
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
                       onClick={() => {
                         const recipe = state.recipeLibrary.find(r => r.id === selectedDay)
                         if (recipe) {
                           handleAddToDay(recipe, day.day)
                         }
                       }}
                       disabled={isLoading}
                       className={`w-full text-left p-4 rounded-lg transition-colors touch-target ${
                         day.recipes.length > 0 
                           ? 'bg-gray-50 hover:bg-gray-100 border border-gray-300' 
                           : 'bg-white border border-dashed border-gray-300 hover:bg-gray-50'
                       } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                       aria-label={`Lägg till ${state.recipeLibrary.find(r => r.id === selectedDay)?.name} på ${day.day}`}
                     >
                       <span className="font-medium text-gray-900">{day.day}</span>
                       <span className="text-sm text-gray-600 ml-2">
                         | {day.recipes.length === 0 ? 'Inga måltider planerade' : day.recipes.length === 1 ? '1 måltid planerad' : `${day.recipes.length} måltider planerade`}
                       </span>
                       {isLoading && (
                         <div className="mt-2 text-xs text-gray-500">
                           Lägger till...
                         </div>
                       )}
                     </button>
               ))}
             </div>
            
                         <button
               onClick={() => setShowDaySelector(false)}
               className={buttonStyles.gradient}
               aria-label="Stäng dag-väljaren"
             >
               Avbryt
             </button>
          </div>
        </div>
          </>
      )}

      {/* Receptdetaljer modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={showRecipeDetails}
          onClose={handleCloseRecipeDetails}
        />
      )}
    </section>
  )
}

export default Recipe
