import type { DayPlan, Recipe } from '../types'
import { useRecipeContext } from '../context/RecipeContext'
import { safeDragDataParse } from '../utils/validation'
import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react'
import { ChevronDown, X, CookingPot, Plus, Search, Clock, Users, Brain } from 'lucide-react'
import { buttonStyles, commonClasses } from '../utils/commonStyles'
import { getCategoryColor } from '../utils/recipeUtils'
import { sanitizeUserInput } from '../utils/security'
import { useScrollLock } from '../hooks/useScrollLock'
import RecipeDetailModal from './RecipeDetailModal'

// DayCard komponent
interface DayCardProps {
	day: DayPlan
	isGlobalDragActive?: boolean
}

const DayCard: React.FC<DayCardProps> = memo(({ day, isGlobalDragActive = false }) => {
	const { dispatch } = useRecipeContext()
	const [isDragOver, setIsDragOver] = useState(false)
	const [dragCounter, setDragCounter] = useState(0)
	const [isMobile, setIsMobile] = useState(false)
	const [isLaptopPlus, setIsLaptopPlus] = useState(false)
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
	const [showRecipeDetails, setShowRecipeDetails] = useState(false)
	const [showRecipeSelector, setShowRecipeSelector] = useState(false)
	const dropZoneRef = useRef<HTMLDivElement>(null)

	// Scroll lock - MÅSTE vara före alla conditional returns
	useScrollLock(showRecipeDetails || showRecipeSelector)

	// Detektera skärmstorlek
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768)
			setIsLaptopPlus(window.innerWidth >= 1024) // Laptop+ (≥1024px)
		}
		
		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		
		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.types.includes('application/json')) {
			setIsDragOver(true)
		}
	}, [])

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.types.includes('application/json')) {
			setDragCounter(prev => prev + 1)
			setIsDragOver(true)
		}
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setDragCounter(prev => prev - 1)
		if (dragCounter <= 1) {
			setIsDragOver(false)
		}
	}, [dragCounter])

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragOver(false)
		setDragCounter(0)
		
		// Säker parsing av drag data
		const recipe = safeDragDataParse(e.dataTransfer)
		if (!recipe) {
			console.warn('Invalid recipe data dropped')
			return
		}
		
		const sourceDay = e.dataTransfer.getData('source-day')
		const sourceInstanceId = e.dataTransfer.getData('source-instance-id')
		
		// Om receptet kommer från en annan dag, flytta det istället för att lägga till
		if (sourceDay && sourceDay !== day.day && sourceInstanceId) {
			// Vi skickar med den fullständiga måltidsinstansen i drag-datan
			const mealInstanceData = e.dataTransfer.getData('meal-instance')
			if (mealInstanceData) {
				try {
					const mealInstanceToMove = JSON.parse(mealInstanceData)
					dispatch({
						type: 'MOVE_RECIPE_BETWEEN_DAYS',
						fromDay: sourceDay,
						toDay: day.day,
						mealInstance: mealInstanceToMove
					})
				} catch (error) {
					console.warn('Failed to parse meal instance data:', error)
				}
			}
		} else {
			// Lägg till nytt recept från biblioteket
			dispatch({
				type: 'ADD_RECIPE_TO_DAY',
				day: day.day,
				recipe
			})
		}
	}, [day.day, dispatch])

	const removeRecipe = useCallback((instanceId: string) => {
		dispatch({
			type: 'REMOVE_RECIPE_FROM_DAY',
			day: day.day,
			instanceId
		})
	}, [day.day, dispatch])

	const handleAddRecipe = useCallback((recipe: Recipe, dayName: string) => {
		dispatch({
			type: 'ADD_RECIPE_TO_DAY',
			day: dayName,
			recipe
		})
	}, [dispatch])

	// På mobil läggs recept till via receptlistan (RecipeLibrary); ingen dag-klick-funktion här
	const handleEmptyDayClick = useCallback(() => {
		if (!isMobile) return
		const el = document.getElementById('recipe-library')
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' })
			// Fokusera sökfältet efter en kort stund så användaren kan börja skriva direkt
			setTimeout(() => {
				const input = el.querySelector('input[type="text"]') as HTMLInputElement | null
				if (input) input.focus()
			}, 300)
		}
	}, [isMobile])

	const handleDayClick = useCallback(() => {
		if (isLaptopPlus) {
			setShowRecipeSelector(true)
		} else if (isMobile && day.recipes.length === 0) {
			handleEmptyDayClick()
		}
	}, [isLaptopPlus, isMobile, day.recipes.length, handleEmptyDayClick])

	const handleShowRecipeDetails = useCallback((recipe: Recipe) => {
		setSelectedRecipe(recipe)
		setShowRecipeDetails(true)
	}, [])

	const handleCloseRecipeDetails = useCallback(() => {
		setShowRecipeDetails(false)
		setSelectedRecipe(null)
	}, [])

	return (
		<div className="bg-gray-50 rounded-xl p-2">
			{/* Dag-header */}
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xs sm:text-sm font-semibold text-gray-900">{day.day}</h3>
				{/* Lägg till recept sker via receptlistan på mobil */}
			</div>

			{/* Drop-zon med förbättrad feedback */}
			<div
				ref={dropZoneRef}
				className={`min-h-[48px] sm:min-h-[64px] rounded-lg border-2 border-dashed transition-colors duration-200 ${
					isDragOver
						? 'border-gray-600 bg-gray-100 scale-[1.02] shadow-lg'
						: isGlobalDragActive
						? 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
						: 'border-gray-200 bg-gray-25 hover:border-gray-300 hover:bg-gray-50'
				} ${day.recipes.length === 0 ? 'flex items-center cursor-pointer' : ''}`}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				title={isMobile ? 'Lägg till via receptlistan' : isLaptopPlus ? 'Klicka för att välja recept' : 'Dra hit recept'}
				aria-label={isMobile ? 'Lägg till via receptlistan' : isLaptopPlus ? 'Klicka för att välja recept' : 'Dra hit recept'}
				onClick={handleDayClick}
			>
				{day.recipes.length === 0 ? (
					// Tom dag - visa hjälptext
					<div className={`h-full w-full flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-colors duration-200 ${
						isDragOver ? 'text-gray-900' : 'text-gray-600'
					}`}>
						{isDragOver ? (
							<>
								<ChevronDown className="w-4 sm:w-6 h-4 sm:h-6 mb-1 text-gray-900" />
								<p className="text-xs sm:text-sm font-medium">Släpp receptet här!</p>
							</>
						) : (
							<>
								{isMobile ? (
									<>
										<Plus className="w-4 h-4 text-gray-400" aria-hidden="true" />
										<span className="sr-only">Lägg till via receptlistan</span>
									</>
								) : isLaptopPlus ? (
									<p className="text-xs text-gray-400">Klicka för att välja recept</p>
								) : (
									<p className="text-xs text-gray-400">Dra hit recept</p>
								)}
							</>
						)}
					</div>
				) : (
					// Recept som redan finns - visa i grid-layout
					<div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[48px] sm:auto-rows-[64px] gap-1 sm:gap-1.5 p-1 sm:p-1.5">
						{day.recipes.map((mealInstance) => {
							const categoryColor = getCategoryColor(mealInstance.recipe.category)
							return (
								<div
									key={mealInstance.instanceId}
									className="bg-white rounded-lg p-1.5 sm:p-2 h-full cursor-move relative group hover:bg-gray-50 transition-colors duration-200 border touch-manipulation"
									style={{
										borderColor: categoryColor !== 'transparent' ? categoryColor : undefined,
										borderWidth: categoryColor !== 'transparent' ? '2px' : '1px'
									}}
									draggable={!isMobile}
									onClick={(e) => {
										// Stoppa event bubbling så att handleDayClick inte triggas
										e.stopPropagation()
									}}
									onDragStart={(e) => {
										if (isMobile) return
										e.dataTransfer.setData('application/json', JSON.stringify(mealInstance.recipe))
										e.dataTransfer.setData('source-day', day.day)
										e.dataTransfer.setData('source-instance-id', mealInstance.instanceId)
										e.dataTransfer.setData('meal-instance', JSON.stringify(mealInstance))
										e.dataTransfer.effectAllowed = 'move'
									}}
								>
									{/* Recept-innehåll */}
									<div className="flex items-center justify-start h-full relative">
										{/* Recept-info (endast namn) */}
										<div className="flex-1 min-w-0 text-left">
											<h4 className="font-medium text-gray-900 text-sm leading-none truncate" title={mealInstance.recipe.name}>
												{mealInstance.recipe.name}
											</h4>
										</div>
										
										{/* Knappar bredvid varandra i hörnet */}
										<div className="absolute -top-1.5 sm:top-1/2 sm:-translate-y-1/2 -right-1.5 flex items-center gap-1">
											{/* Visa detaljer knapp */}
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleShowRecipeDetails(mealInstance.recipe)
												}}
												className={buttonStyles.iconTransparentSmall}
												title="Visa receptdetaljer"
											>
												<CookingPot className="w-4 sm:w-4 h-4 sm:h-4 text-gray-600" />
											</button>
											
											{/* Ta bort-knapp */}
											<button
												onClick={(e) => {
													e.stopPropagation()
													removeRecipe(mealInstance.instanceId)
												}}
												className={buttonStyles.iconTransparentSmall}
												title="Ta bort recept"
											>
												<X className="w-4 sm:w-4 h-4 sm:h-4 text-gray-600" />
											</button>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			{/* Ingen mobil receptväljare här; använd RecipeLibrary för att välja dag */}

			{/* Receptdetaljer modal - använder samma som Recipe.tsx */}
			{selectedRecipe && showRecipeDetails && (
				<RecipeDetailModal
					recipe={selectedRecipe}
					isOpen={showRecipeDetails}
					onClose={handleCloseRecipeDetails}
				/>
			)}

			{/* Receptväljare modal för laptop+ */}
			<RecipeSelectorModal
				isOpen={showRecipeSelector}
				onClose={() => setShowRecipeSelector(false)}
				selectedDay={day.day}
				onAddRecipe={handleAddRecipe}
			/>
		</div>
	)
})

DayCard.displayName = 'DayCard'

// RecipeSelector modal komponent för laptop+
interface RecipeSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDay: string
  onAddRecipe: (recipe: Recipe, day: string) => void
}

const RecipeSelectorModal: React.FC<RecipeSelectorModalProps> = memo(({
  isOpen,
  onClose,
  selectedDay,
  onAddRecipe
}) => {
  const { state } = useRecipeContext()
  const [activeTab, setActiveTab] = useState<'recipes' | 'recommendations'>('recipes')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  // Persistent state för filter och tabs
  const [persistentState, setPersistentState] = useState<{
    activeTab: 'recipes' | 'recommendations'
    searchQuery: string
    activeFilters: Set<string>
  }>({
    activeTab: 'recipes',
    searchQuery: '',
    activeFilters: new Set()
  })

  // Scroll lock - MÅSTE vara före alla conditional returns
  useScrollLock(isOpen)

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
        if (activeFilters.has('billig') && !(
          recipe.ingredients.length <= 4 || recipe.prepTime <= 30
        )) return false
        if (activeFilters.has('enkel') && recipe.difficulty !== 'easy') return false
        if (activeFilters.has('snabb') && recipe.prepTime > 30) return false
        if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false
        return true
      })
    }

    return recipes
  }, [state.recipeLibrary, searchQuery, activeFilters])

  // Smart rekommendationer baserat på centrala suggestions + lokalt överlapp
  const smartRecommendations = useMemo(() => {
    const plannedIngredients = new Set<string>()
    state.weekPlan.forEach(day => {
      day.recipes.forEach(meal => {
        meal.recipe.ingredients.forEach(ingredient => {
          plannedIngredients.add(ingredient.name.toLowerCase())
        })
      })
    })

    let recommendations = state.suggestions.map(recipe => {
      const overlapCount = recipe.ingredients.filter(ingredient => 
        plannedIngredients.has(ingredient.name.toLowerCase())
      ).length
      return { recipe, overlapCount }
    })

    // Applicera sökfilter
    if (searchQuery.trim()) {
      const sanitizedQuery = sanitizeUserInput(searchQuery, 50).toLowerCase()
      if (sanitizedQuery) {
        recommendations = recommendations.filter(({ recipe }) => 
          recipe.name.toLowerCase().includes(sanitizedQuery) ||
          recipe.ingredients.some(ingredient => 
            ingredient.name.toLowerCase().includes(sanitizedQuery)
          )
        )
      }
    }

    // Applicera filter på rekommendationer
    if (activeFilters.size > 0) {
      recommendations = recommendations.filter(({ recipe }) => {
        if (activeFilters.has('billig') && !(recipe.ingredients.length <= 4 || recipe.prepTime <= 30)) return false
        if (activeFilters.has('enkel') && recipe.difficulty !== 'easy') return false
        if (activeFilters.has('snabb') && recipe.prepTime > 30) return false
        if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false
        return true
      })
    }

    // Contexten är redan viktad; sortera sekundärt på överlapp och begränsa
    return recommendations.sort((a, b) => b.overlapCount - a.overlapCount).slice(0, 6)
  }, [state.weekPlan, state.suggestions, searchQuery, activeFilters])

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(filter)) {
      newFilters.delete(filter)
    } else {
      newFilters.add(filter)
    }
    setActiveFilters(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters(new Set())
    setSearchQuery('')
  }

  // Nollställ allt när ett recept läggs till
  const handleAddRecipeAndReset = (recipe: Recipe, dayName: string) => {
    // Lägg till receptet
    onAddRecipe(recipe, dayName)
    
    // Spara nuvarande state som persistent
    setPersistentState({
      activeTab: activeTab,
      searchQuery: searchQuery,
      activeFilters: activeFilters
    })
    
    // Nollställ lokalt state
    setActiveTab('recipes')
    setSearchQuery('')
    setActiveFilters(new Set())
  }

  // Återställ persistent state när modalen öppnas
  useEffect(() => {
    if (isOpen) {
      setActiveTab(persistentState.activeTab)
      setSearchQuery(persistentState.searchQuery)
      setActiveFilters(persistentState.activeFilters)
    }
  }, [isOpen, persistentState])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Lägg till recept på {selectedDay}
            </h2>
            <p className="text-gray-600 mt-1">
              Välj från alla recept eller få smarta rekommendationer
            </p>
          </div>
          <button
            onClick={onClose}
            className={buttonStyles.iconTransparentClose}
            title="Stäng"
            aria-label="Stäng receptväljaren"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`${buttonStyles.tab} ${
                activeTab === 'recipes'
                  ? buttonStyles.tabActive
                  : buttonStyles.tabInactive
              }`}
            >
              Alla recept
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`${buttonStyles.tab} ${
                activeTab === 'recommendations'
                  ? buttonStyles.tabActive
                  : buttonStyles.tabInactive
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              Rekommendationer
            </button>
          </div>
        </div>

        {/* Innehåll */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Gemensam sök och filter för båda tabarna */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Sök recept eller ingredienser..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.slice(0, 50))}
                  className={commonClasses.input}
                  maxLength={50}
                  aria-label="Sök recept eller ingredienser"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'billig', label: 'Billig' },
                  { key: 'enkel', label: 'Enkel' },
                  { key: 'snabb', label: 'Snabb' },
                  { key: 'vegetarisk', label: 'Vegetarisk' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className={`${buttonStyles.filterTag} ${
                      activeFilters.has(key)
                        ? buttonStyles.filterTagActive
                        : ''
                    }`}
                    aria-pressed={activeFilters.has(key)}
                    aria-label={`Filtrera på ${label.toLowerCase()}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {(searchQuery.trim() || activeFilters.size > 0) && (
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 text-sm underline transition-colors"
                aria-label="Rensa sökning och filter"
              >
                Rensa sökning och filter
              </button>
            )}
          </div>

          {activeTab === 'recipes' && (
            <div>
              {/* Receptlista */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className={`${commonClasses.card} hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => {
                      handleAddRecipeAndReset(recipe, selectedDay)
                      onClose()
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        {recipe.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddRecipeAndReset(recipe, selectedDay)
                          onClose()
                        }}
                        className={buttonStyles.icon}
                        title="Lägg till recept"
                        aria-label={`Lägg till ${recipe.name} på ${selectedDay}`}
                      >
                        <CookingPot className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{recipe.totalTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{recipe.servings} portioner</span>
                      </div>
                    </div>

                    {recipe.description && (
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <p>Inga recept hittades</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Smart rekommendationer baserat på dina planerade måltider
                </h3>
                <p className="text-gray-600 text-sm">
                  Recept med gemensamma ingredienser kommer först
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartRecommendations.map(({ recipe, overlapCount }) => (
                  <div
                    key={recipe.id}
                    className={`${commonClasses.card} hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={() => {
                      handleAddRecipeAndReset(recipe, selectedDay)
                      onClose()
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        {recipe.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddRecipeAndReset(recipe, selectedDay)
                          onClose()
                        }}
                        className={buttonStyles.icon}
                        title="Lägg till recept"
                        aria-label={`Lägg till ${recipe.name} på ${selectedDay}`}
                      >
                        <CookingPot className="w-4 h-4" />
                      </button>
                    </div>

                    {overlapCount > 0 && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {overlapCount} gemensamma ingredienser
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{recipe.totalTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-4" />
                        <span>{recipe.servings} portioner</span>
                    </div>
                    </div>

                    {recipe.description && (
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {smartRecommendations.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <p>Inga rekommendationer tillgängliga just nu</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
      </>
  )
})

RecipeSelectorModal.displayName = 'RecipeSelectorModal'

// Huvudkomponenten WeekPlanner
const WeekPlanner: React.FC = memo(() => {
  const { state } = useRecipeContext()

  const [globalDragState, setGlobalDragState] = useState<{
    isDragging: boolean
    targetDay: string | null
  }>({ isDragging: false, targetDay: null })

  // Funktion för att beräkna aktuella veckan
  const getCurrentWeekInfo = useCallback(() => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
    
    // Hitta måndagen i aktuella veckan
    const monday = new Date(now)
    const dayOfWeek = now.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    monday.setDate(now.getDate() - daysToMonday)
    
    // Hitta söndagen i aktuella veckan
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    return {
      weekNumber,
      monday,
      sunday
    }
  }, [])

  const weekInfo = useMemo(() => getCurrentWeekInfo(), [getCurrentWeekInfo])

  // Global drag event handlers - definierade utanför useEffect
  const handleGlobalDragStart = useCallback((e: DragEvent) => {
    if (e.dataTransfer?.types.includes('application/json')) {
      setGlobalDragState({ isDragging: true, targetDay: null })
    }
  }, [])

  const handleGlobalDragEnd = useCallback(() => {
    setGlobalDragState({ isDragging: false, targetDay: null })
  }, [])

  // Global drag event handlers
  useEffect(() => {
    document.addEventListener('dragstart', handleGlobalDragStart)
    document.addEventListener('dragend', handleGlobalDragEnd)

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart)
      document.removeEventListener('dragend', handleGlobalDragEnd)
    }
  }, [handleGlobalDragStart, handleGlobalDragEnd])

  // Skapa en komplett vecka med alla dagar
  const completeWeek = useMemo(() => {
    const weekDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']
    return weekDays.map(dayName => {
      const existingDay = state.weekPlan.find(d => d.day === dayName)
      return existingDay || { day: dayName, recipes: [] }
    })
  }, [state.weekPlan])

  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
      {/* Header med veckoinfo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-baseline gap-2 sm:gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Veckoplan
          </h2>
          <div className="hidden sm:block w-0.5 h-6 bg-gray-300"></div>
          <span className="text-gray-600 text-sm font-normal">
            {weekInfo.monday.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')} - {weekInfo.sunday.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')}
          </span>
        </div>
      </div>
      
      {/* Veckoplan med dagar */}
      <div>
        {completeWeek.map((day) => (
          <div key={day.day}>
            <DayCard 
              day={day} 
              isGlobalDragActive={globalDragState.isDragging}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

WeekPlanner.displayName = 'WeekPlanner'

export default WeekPlanner
