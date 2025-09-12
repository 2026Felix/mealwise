import { useState, useMemo, useCallback, memo, useEffect, useRef } from 'react'
import { useRecipeContext } from '../context/AppState'
import { ShoppingCart, X, Check, Brain, ChevronDown, ChevronUp, CookingPot, Search, ChefHat, CalendarDays, Minus, Plus } from 'lucide-react'
import { buttonStyles, spacing, commonClasses } from '../utils/uiStyles'
import { FilterType } from '../hooks/useFiltering'
import { useScrollLock } from '../hooks/useScrollControl'
import { getCategoryColor, passesRecipeFilters } from '../utils/recipeHelpers'
import { sanitizeUserInput } from '../utils/validation'
import RecipeModal from './RecipeModal'
import type { DayPlan, Recipe } from '../types'
import { DAYS_OF_WEEK } from '../constants'

// Gemensam modal-komponent för att minska duplicering
// Hanterar både desktop och mobil layout med touch-optimering
const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}> = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-gray-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={`bg-white rounded-t-xl sm:rounded-xl max-w-2xl w-full h-[85vh] sm:h-[90vh] overflow-hidden shadow-2xl sm:shadow-2xl ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              onTouchEnd={(e) => {
                e.preventDefault()
                onClose()
              }}
              className={`${buttonStyles.iconTransparentClose} touch-manipulation`}
              aria-label="Stäng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// RecipeCard – radkomponent för receptlistor
// Stöder både drag&drop (desktop) och touch-interaktioner (mobil)
const RecipeCard: React.FC<{
  recipe: Recipe
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
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchMoved, setTouchMoved] = useState(false)
  const detailsBtnTouchStartY = useRef(0)
  const detailsBtnTouchMoved = useRef(false)

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

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Stoppa event bubbling om klicket kommer från en knapp
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    
    // På mobil: lägg till recept vid klick på kortet
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return
    
    const touch = e.touches[0]
    setTouchStartY(touch.clientY)
    setTouchMoved(false)
  }, [isMobile])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return
    
    const touch = e.touches[0]
    const deltaY = Math.abs(touch.clientY - touchStartY)
    
    // Om användaren har rört sig mer än 10px, räkna det som scrollning
    // Detta förhindrar oönskade klick när användaren scrollar
    if (deltaY > 10) {
      setTouchMoved(true)
    }
  }, [isMobile, touchStartY])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return
    
    // Stoppa event bubbling om touch kommer från en knapp
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    
    // Om användaren har scrollat, trigga inte onAddToDay
    // Detta förhindrar oönskade åtgärder vid scrollning
    if (touchMoved) {
      return
    }
    
    if (onAddToDay) {
      e.preventDefault()
      onAddToDay()
    }
  }, [isMobile, onAddToDay, touchMoved])

  const categoryColor = getCategoryColor(recipe.category)

  return (
    <div 
      className={`bg-white border-2 border-solid rounded-lg p-3 sm:p-4 transition-colors duration-200 hover:bg-gray-50 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } h-14 sm:h-18 relative group touch-manipulation ${isMobile && onAddToDay ? 'cursor-pointer active:bg-gray-100' : ''}`}
      style={{
        borderColor: categoryColor !== 'transparent' ? categoryColor : '#e5e7eb'
      }}
      draggable={!isMobile}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role={isMobile && onAddToDay ? "button" : "article"}
      tabIndex={isMobile && onAddToDay ? 0 : -1}
      aria-label={isMobile && onAddToDay ? `Lägg till ${recipe.name} i veckoplan` : `Rekommendation: ${recipe.name}`}
    >
      <div className="flex items-center justify-between h-full relative z-10">
        {/* Innehåll */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Namn */}
          <h3 className="font-medium text-gray-900 text-sm leading-none">
            {recipe.name}
          </h3>
        </div>

        {/* Snabbåtgärder */}
        <div className="flex items-center gap-2 ml-2">
          {/* Överlappande ingredienser (antal) */}
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
          
          {/* Visa detaljer */}
          {onShowDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation() // Stoppa event bubbling så att onAddToDay inte triggas
                e.preventDefault()
                onShowDetails()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                const touch = e.touches[0]
                detailsBtnTouchStartY.current = touch.clientY
                detailsBtnTouchMoved.current = false
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0]
                const deltaY = Math.abs(touch.clientY - detailsBtnTouchStartY.current)
                if (deltaY > 10) {
                  detailsBtnTouchMoved.current = true
                }
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                if (detailsBtnTouchMoved.current) {
                  return
                }
                e.preventDefault()
                onShowDetails()
              }}
              className={`${buttonStyles.iconTransparentSmall} touch-manipulation`}
              title="Visa receptdetaljer"
              aria-label={`Visa detaljer för ${recipe.name}`}
            >
              <CookingPot className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Hoverindikator (desktop) */}
      {!isMobile && (
        <div 
          className="absolute inset-0 bg-transparent group-hover:bg-gray-50 transition-colors rounded-lg pointer-events-none z-0"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// DayCard – en dags kolumn i veckoplanen
// Hanterar drag&drop, touch-interaktioner och recepthantering
interface DayCardProps {
  day: DayPlan
  isGlobalDragActive?: boolean
  onShowRecipeDetails: (recipe: Recipe) => void
  onCloseRecipeDetails: () => void
}

const DayCard: React.FC<DayCardProps> = memo(({ day, isGlobalDragActive = false, onShowRecipeDetails, onCloseRecipeDetails }) => {
  const { dispatch } = useRecipeContext()
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isLaptopPlus, setIsLaptopPlus] = useState(false)
  const [showRecipeSelector, setShowRecipeSelector] = useState(false)
  const detailsIconTouchStartY = useRef(0)
  const detailsIconTouchMoved = useRef(false)
  const removeIconTouchStartY = useRef(0)
  const removeIconTouchMoved = useRef(false)

  // Lås scroll när modal(er) är öppna för bättre UX
  useScrollLock(showRecipeSelector)

  // Skärmdetektering för att anpassa interaktioner
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
    
    // Läs drag-data från dataTransfer
    const recipe = JSON.parse(e.dataTransfer.getData('application/json'))
    if (!recipe) {
      console.warn('Invalid recipe data dropped')
      return
    }
    
    const sourceDay = e.dataTransfer.getData('source-day')
    const sourceInstanceId = e.dataTransfer.getData('source-instance-id')
    
    // Flytta mellan dagar om källan är annan dag, annars lägg till nytt recept
    if (sourceDay && sourceDay !== day.day && sourceInstanceId) {
      // Drag-data innehåller hela måltidsinstansen för flyttning
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
      // Lägg till nytt recept från receptlistan
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


  // På mobil: hänvisa till receptlistan vid tom dag
  // Scrollar till receptlistan och fokuserar sökfältet för bättre UX
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

  return (
    <div className="bg-gray-50 rounded-xl p-2">
      {/* Dag-header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">{day.day}</h3>
      </div>

      {/* Drop-zon med förbättrad visuell feedback */}
      <div
        className={`min-h-[56px] sm:min-h-[72px] rounded-lg border-2 border-dashed transition-colors duration-200 ${
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
          // Tom dag - visa hjälptext baserat på enhetstyp
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
                    <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
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
          // Recept som redan finns - visa i responsiv grid-layout
          <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[56px] sm:auto-rows-[72px] gap-1.5 sm:gap-2 p-1.5 sm:p-2">
            {day.recipes.map((mealInstance) => {
              const categoryColor = getCategoryColor(mealInstance.recipe.category)
              return (
                <div
                  key={mealInstance.instanceId}
                  className="bg-white rounded-lg p-2 sm:p-2.5 h-full cursor-move relative group hover:bg-gray-50 transition-colors duration-200 border touch-manipulation"
                  style={{
                    borderColor: categoryColor !== 'transparent' ? categoryColor : undefined,
                    borderWidth: categoryColor !== 'transparent' ? '2px' : '1px'
                  }}
                  draggable={!isMobile}
                  onClick={(e) => {
                    // Stoppa bubbling så klick inte triggar handleDayClick
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
                  {/* Innehåll */}
                  <div className="flex items-center justify-start h-full relative">
                    {/* Namn */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-medium text-gray-900 text-sm leading-none truncate" title={mealInstance.recipe.name}>
                        {mealInstance.recipe.name}
                      </h4>
                    </div>
                    
                    {/* Snabbåtgärder i hörnet - detaljer och ta bort */}
                    <div className="absolute -top-1.5 sm:top-1/2 sm:-translate-y-1/2 -right-1.5 flex items-center gap-1">
                      {/* Visa detaljer */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onShowRecipeDetails(mealInstance.recipe)
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation()
                          const touch = e.touches[0]
                          detailsIconTouchStartY.current = touch.clientY
                          detailsIconTouchMoved.current = false
                        }}
                        onTouchMove={(e) => {
                          const touch = e.touches[0]
                          const deltaY = Math.abs(touch.clientY - detailsIconTouchStartY.current)
                          if (deltaY > 10) {
                            detailsIconTouchMoved.current = true
                          }
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation()
                          if (detailsIconTouchMoved.current) return
                          e.preventDefault()
                          onShowRecipeDetails(mealInstance.recipe)
                        }}
                        className={buttonStyles.iconTransparentSmall}
                        title="Visa receptdetaljer"
                      >
                        <CookingPot className="w-4 sm:w-4 h-4 sm:h-4 text-gray-600" />
                      </button>
                      
                      {/* Ta bort */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeRecipe(mealInstance.instanceId)
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation()
                          const touch = e.touches[0]
                          removeIconTouchStartY.current = touch.clientY
                          removeIconTouchMoved.current = false
                        }}
                        onTouchMove={(e) => {
                          const touch = e.touches[0]
                          const deltaY = Math.abs(touch.clientY - removeIconTouchStartY.current)
                          if (deltaY > 10) {
                            removeIconTouchMoved.current = true
                          }
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation()
                          if (removeIconTouchMoved.current) return
                          e.preventDefault()
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

    </div>
  )
})

DayCard.displayName = 'DayCard'

// PlanningPage – huvudlayouten: veckoplan, alla recept, rekommendationer och inköpslista
// Central komponent som sammanbinder alla planeringsfunktioner
interface PlanningPageProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

const PlanningPage: React.FC<PlanningPageProps> = memo(({ 
  activeFilters, 
  onToggleFilter, 
  onClearFilters, 
  filterButtons 
}) => {
  const { state, dispatch } = useRecipeContext()
  
  // State för ingredienser och modaler
  const [showDetailedList, setShowDetailedList] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'recipe' | 'shopping'>('shopping')
  // Per-recept portionskontroll för "Veckans rätter"-vyn i modalen
  const [recipePortions, setRecipePortions] = useState<Record<string, number>>({})
  
  // State för användarens egna inköpslistobjekt
  const [customItems, setCustomItems] = useState<Array<{id: string, name: string}>>([])
  const [newItemName, setNewItemName] = useState('')
  const [showAddItemForm, setShowAddItemForm] = useState(false)

  // Hjälpare för portionsnyckel (föredra id om det finns)
  const getRecipeKey = (recipe: any): string => (recipe?.id ? String(recipe.id) : String(recipe?.name ?? ''))
  const getRecipePortions = (recipe: any): number => {
    const key = getRecipeKey(recipe)
    return recipePortions[key] ?? 2
  }
  const changeRecipePortions = (recipe: any, delta: number) => {
    const key = getRecipeKey(recipe)
    setRecipePortions(prev => {
      const current = prev[key] ?? 2
      const next = Math.min(8, Math.max(1, current + delta))
      return { ...prev, [key]: next }
    })
  }

  // State för rekommendationer och UI
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRecipeDetails, setShowRecipeDetails] = useState(false)
  const [showDaySelector, setShowDaySelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Lås scroll när modaler är öppna för bättre UX
  const shouldLockScroll = useMemo(() => showDetailedList || showDaySelector, [showDetailedList, showDaySelector])
  useScrollLock(shouldLockScroll)

  // Ingredienser justerade efter per‑recept portionsval
  // Beräknar totala mängder baserat på användarens portionsval
  const ingredientsWithQuantities = useMemo(() => {
    const ingredientMap = new Map<string, { totalQuantity: number, unit: string }>()
    state.weekPlan.forEach(day => {
      day.recipes.forEach(mealInstance => {
        const portion = (recipePortions[String(mealInstance.recipe.id ?? mealInstance.recipe.name)] ?? 2)
        const factor = portion / 4
        mealInstance.recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase()
          const existing = ingredientMap.get(key)
          const addQty = Math.round(ing.quantity * factor * 100) / 100
          if (existing) {
            existing.totalQuantity = Math.round((existing.totalQuantity + addQty) * 100) / 100
          } else {
            ingredientMap.set(key, { totalQuantity: addQty, unit: ing.unit })
          }
        })
      })
    })
    return Array.from(ingredientMap.entries())
      .map(([name, { totalQuantity, unit }]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        totalQuantity,
        unit
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [state.weekPlan, recipePortions])

  const hasPlannedRecipes = ingredientsWithQuantities.length > 0

  // Veckans datumintervall (mån–sön) - beräknar aktuell vecka
  const weekRange = useMemo(() => {
    const today = new Date()
    const jsDay = today.getDay() // 0 = sön, 1 = mån ... 6 = lör
    const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay
    const start = new Date(today)
    start.setHours(0, 0, 0, 0)
    start.setDate(today.getDate() + diffToMonday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
    if (sameMonth) {
      return `${start.getDate()}–${end.getDate()} ${months[end.getMonth()]}`
    }
    return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]}`
  }, [])

  // Toggle av inköpslistans checkboxar för att markera köpta ingredienser
  const toggleIngredient = (ingredientName: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientName)) {
      newChecked.delete(ingredientName)
    } else {
      newChecked.add(ingredientName)
    }
    setCheckedIngredients(newChecked)
  }

  // Hantera användarens egna inköpslistobjekt
  const addCustomItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: `custom-${Date.now()}`,
        name: newItemName.trim()
      }
      setCustomItems(prev => [...prev, newItem])
      setNewItemName('')
      setShowAddItemForm(false)
    }
  }

  const removeCustomItem = (itemId: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== itemId))
    // Ta också bort från checkedIngredients om det var markerat
    const item = customItems.find(item => item.id === itemId)
    if (item) {
      const newChecked = new Set(checkedIngredients)
      newChecked.delete(item.name)
      setCheckedIngredients(newChecked)
    }
  }

  const isCustomItem = (ingredientName: string): boolean => {
    return customItems.some(item => item.name === ingredientName)
  }


  // Ingredienser grupperade per recept (för modalens receptvy)
  // Organiserar ingredienser per recept för bättre översikt
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

  // Kategorisering av ingredienser (för modalens inköpslista)
  // Grupperar ingredienser i logiska kategorier för enklare handla
  const getCategorizedIngredients = () => {
    // Normaliserar strängar för säkrare jämförelser (små bokstäver, ta bort diakritiska tecken)
    const normalize = (value: string): string =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()

    const categories: { [key: string]: string[] } = {
      'Frukt & Grönt': [
        'tomat', 'lök', 'lok', 'vitlök', 'vitlok', 'morot', 'potatis', 'sallad', 'spenat', 'broccoli', 'paprika', 'gurka',
        'äpple', 'apple', 'banan', 'citron', 'lime', 'apelsin', 'chili', 'ingefära', 'koriander', 'basilika', 'persilja', 'dill', 'timjan', 'rosmarin',
        'avokado', 'avocado', 'zucchini', 'aubergine', 'aubergin', 'svamp', 'champinjon', 'champinjoner', 'purjolök', 'purjolok', 'rödlök', 'rodlok',
        'sötpotatis', 'sotpotatis', 'majs', 'ärter', 'arter', 'ruccola', 'rucola', 'kål', 'kal', 'vitkål', 'vitkal', 'rödkål', 'rodkal', 'grönkål', 'gronkal',
        'pepparrot', 'rädisor', 'raddisor', 'salladslök', 'salladslok', 'bladpersilja'
      ],
      'Kött & Fisk': [
        'nötfärs', 'notfars', 'fläskfärs', 'flaskfars', 'kyckling', 'kalkon', 'lax', 'torsk', 'räkor', 'rakor', 'skinka', 'bacon', 'korv', 'wurst',
        'oxfilé', 'oxfile', 'högrev', 'hogrev', 'entrecote', 'entrecôte', 'lamm', 'färs', 'fars', 'sill', 'strömming', 'stromming', 'tonfisk', 'sjötunga',
        'fisk', 'kött', 'kott'
      ],
      'Mejeri & Ägg': [
        'mjölk', 'mjolk', 'grädde', 'gradde', 'yoghurt', 'yoghurt', 'ost', 'smör', 'smor', 'ägg', 'agg', 'kefir', 'creme fraiche', 'crème fraîche',
        'kvarg', 'fil', 'gräddfil', 'graddfil', 'mozzarella', 'parmesan', 'feta', 'ricotta', 'gräddost', 'vispgrädde', 'matlagningsgrädde'
      ],
      'Torrvaror': [
        'ris', 'pasta', 'bulgur', 'quinoa', 'bönor', 'bonor', 'linser', 'kikärtor', 'kikartor', 'nötter', 'notter', 'frön', 'fron', 'havregryn', 'müsli', 'musli',
        'couscous', 'spaghetti', 'makaroner', 'penne', 'risnudlar', 'nudlar', 'vetemjöl', 'vetemjol', 'mjöl', 'mjol', 'socker', 'farinsocker', 'florsocker',
        'bakpulver', 'vaniljsocker', 'kakao', 'majsstärkelse', 'majsstarkelse', 'potatismjöl', 'potatismjol'
      ],
      'Kryddor & Såser': [
        'salt', 'peppar', 'chili', 'curry', 'paprika', 'oregano', 'kardemumma', 'kanel', 'vanilj', 'soja', 'sojasås', 'sojasas', 'olja', 'olivolja', 'rapsolja',
        'vinäger', 'vinager', 'senap', 'ketchup', 'majonnäs', 'majonnas', 'sriracha', 'tabasco', 'buljong', 'fond', 'fisksås', 'fisksas', 'teriyaki', 'bbq',
        'tahini', 'sesamolja'
      ],
      'Fryst & Konserver': [
        'ärter', 'arter', 'majs', 'ananas', 'tonfisk', 'sardiner', 'krossade tomater', 'passerade tomater', 'kokosmjölk', 'kokosmjolk', 'spenat fryst',
        'broccoli fryst', 'bär', 'bar', 'hallon', 'blåbär', 'blabar', 'jordgubbar'
      ]
    }

    const categorized: { [key: string]: any[] } = {}

    // Lägg till recept-ingredienser
    ingredientsWithQuantities.forEach(ingredient => {
      const name = normalize(ingredient.name)
      let assigned = false

      for (const [category, keywords] of Object.entries(categories)) {
        const match = keywords.some(keyword => name.includes(normalize(keyword)))
        if (match) {
          if (!categorized[category]) categorized[category] = []
          categorized[category].push(ingredient)
          assigned = true
          break
        }
      }

      // Om ingen kategori matchar, lägg i "Övrigt"
      if (!assigned) {
        if (!categorized['Övrigt']) categorized['Övrigt'] = []
        categorized['Övrigt'].push(ingredient)
      }
    })

    // Lägg till användarens egna objekt
    customItems.forEach(item => {
      const ingredient = {
        name: item.name,
        totalQuantity: '',
        unit: '',
        isCustom: true,
        id: item.id
      }
      
      const name = normalize(item.name)
      let assigned = false

      for (const [category, keywords] of Object.entries(categories)) {
        const match = keywords.some(keyword => name.includes(normalize(keyword)))
        if (match) {
          if (!categorized[category]) categorized[category] = []
          categorized[category].push(ingredient)
          assigned = true
          break
        }
      }

      // Om ingen kategori matchar, lägg i "Övrigt"
      if (!assigned) {
        if (!categorized['Övrigt']) categorized['Övrigt'] = []
        categorized['Övrigt'].push(ingredient)
      }
    })

    return categorized
  }

  // Rekommendationer baserade på överlapp mot planerade ingredienser
  // Sorterar recept efter antal gemensamma ingredienser
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
      withOverlap = withOverlap.filter(recipe => passesRecipeFilters(recipe, activeFilters))
    }

    // Sortera efter mest överlapp
    return withOverlap.sort((a, b) => b.overlapCount - a.overlapCount)
  }, [state.weekPlan, state.suggestions, activeFilters])

  const hasRecommendations = recommendations.length > 0

  // Filtrerad lista över alla recept (alltid synlig)
  // Tillämpar sökfilter och kategorifilter på receptbiblioteket
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

    // Filter-logik (samma som i rekommendationer och biblioteket)
    if (activeFilters.size > 0) {
      recipes = recipes.filter(recipe => passesRecipeFilters(recipe, activeFilters))
    }

    return recipes
  }, [state.recipeLibrary, searchQuery, activeFilters])

  // Event handlers – visa detaljer, öppna dagväljare, lägga till recept
  const handleShowRecipeDetails = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowRecipeDetails(true)
  }, [])

  const handleCloseRecipeDetails = useCallback(() => {
    setShowRecipeDetails(false)
    setSelectedRecipe(null)
  }, [])

  const openDaySelector = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setShowDaySelector(true)
  }, [])

  const handleAddToDay = useCallback((recipe: Recipe, day: string) => {
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

  // Skapa en komplett vecka med alla dagar
  // Fyller i tomma dagar för att visa hela veckan
  const completeWeek = useMemo(() => {
    return Array.from(DAYS_OF_WEEK).map(dayName => {
      const existingDay = state.weekPlan.find(d => d.day === dayName)
      return existingDay || { day: dayName, recipes: [] }
    })
  }, [state.weekPlan])

  return (
    <div className={`${commonClasses.container} ${spacing.section}`}>
      <div className={`flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8`}>
        {/* Veckoplan */}
        <div data-onboarding="week-planner" className="order-1 xl:order-1">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200">
            {/* Header med veckoinfo */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Veckoplan</h2>
              </div>
              <div className="text-sm text-gray-600 text-right">{weekRange}</div>
            </div>
            
            {/* Veckoplan med dagar */}
            <div>
              {completeWeek.map((day) => (
                <div key={day.day} className="mb-4 last:mb-0">
                  <DayCard 
                    day={day} 
                    isGlobalDragActive={false}
                    onShowRecipeDetails={handleShowRecipeDetails}
                    onCloseRecipeDetails={handleCloseRecipeDetails}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Receptlista och Rekommendationer */}
        <div className="space-y-4 sm:space-y-6 order-2 xl:order-2">
          {/* Alla recept - alltid synlig */}
          <div id="recipe-library" className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200">
            {/* Titelrad + Sök (desktop i samma rad) */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Alla recept</h2>
                </div>
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Sök recept eller ingredienser..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.slice(0, 50))}
                    className="pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm w-full"
                    maxLength={50}
                    aria-label="Sök recept eller ingredienser"
                  />
                </div>
              </div>
            </div>

            {/* Filter-taggar (efter sök) */}
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 justify-center">
              {filterButtons.map(({ key, label, description }) => (
                  <button
                    key={key}
                    onClick={() => onToggleFilter(key)}
                    className={`${buttonStyles.filterTag} ${
                      activeFilters.has(key) ? buttonStyles.filterTagActive : ''
                    }`}
                    title={description}
                    aria-pressed={activeFilters.has(key)}
                  >
                    {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
                  </button>
              ))}
              {activeFilters.size > 0 && (
                <button onClick={onClearFilters} className="text-gray-700 hover:text-gray-900 underline text-xs">
                  Rensa filter
                </button>
              )}
            </div>

            {/* Receptlista i rader */}
            <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto overscroll-contain touch-pan-y touch-scroll scroll-indicator">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onAddToDay={() => openDaySelector(recipe)}
                  onShowDetails={() => handleShowRecipeDetails(recipe)}
                />
              ))}
            </div>
          </div>

          {/* Rekommendationer - alltid synlig */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200">
            <div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-4 sm:mb-6'}`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Rekommendationer ({recommendations.length})
                  </h2>
                </div>
              </div>
              
              <button
                onClick={toggleCollapse}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  toggleCollapse()
                }}
                className="p-1.5 sm:p-2 hover:bg-white rounded-lg transition-colors duration-200 group inline-flex items-center justify-center touch-manipulation"
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
              <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto overscroll-contain touch-pan-y touch-scroll scroll-indicator">
                {recommendations.length > 0 ? (
                  recommendations.map((recipe) => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe}
                      showOverlap={true}
                      overlapCount={recipe.overlapCount}
                      overlapIngredients={recipe.overlapIngredients}
                      onAddToDay={() => openDaySelector(recipe)}
                      onShowDetails={() => handleShowRecipeDetails(recipe)}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-600 px-2 py-3">Lägg till rätter i veckoplan för att få förslag.</div>
                )}
              </div>
            )}
          </div>

          {/* Inköpslista - visas alltid */}
          {hasPlannedRecipes ? (
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Inköpslista ({ingredientsWithQuantities.length + customItems.length})
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Inköpslista</h2>
                <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto px-2">
                  Lägg till recept i veckoplanen
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal för detaljerad ingredienslista */}
      <Modal
        isOpen={showDetailedList}
        onClose={() => setShowDetailedList(false)}
        title="Överblick"
        className="overflow-y-auto"
      >

        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
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

              {/* Portions-kontroll flyttad till varje rätt nedan */}

              {/* Innehåll baserat på vald vy */}
              <div className="pt-0 pb-4 w-full">
                {viewMode === 'recipe' ? (
                  <div className="space-y-2">
                    {getIngredientsByRecipe().map((group, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {group.recipe.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => changeRecipePortions(group.recipe, -1)}
                                className="w-6 h-6 bg-white border border-gray-300 rounded-md flex items-center justify-center text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={getRecipePortions(group.recipe) <= 1}
                                title="Minska portioner"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-10 text-center font-medium text-gray-900 text-xs">
                                {getRecipePortions(group.recipe)} port.
                              </span>
                              <button
                                onClick={() => changeRecipePortions(group.recipe, 1)}
                                className="w-6 h-6 bg-white border border-gray-300 rounded-md flex items-center justify-center text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={getRecipePortions(group.recipe) >= 8}
                                title="Öka portioner"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {group.ingredients.map((ingredient, ingIndex) => {
                            const recipePortion = getRecipePortions(group.recipe)
                            const adjustedQuantity = Math.round(ingredient.quantity * (recipePortion / 4) * 100) / 100
                            return (
                              <div key={ingIndex} className="flex items-center justify-between px-4 py-2.5">
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
                  <div className="space-y-4">
                    {Object.entries(getCategorizedIngredients()).map(([category, ingredients]) => (
                      <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {category}
                          </h4>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {ingredients.map((ingredient, index) => (
                            <div key={index} className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                              checkedIngredients.has(ingredient.name) ? 'line-through text-gray-400' : ''
                            }`}>
                              <label className="flex items-center gap-3 flex-1 cursor-pointer">
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
                                {!ingredient.isCustom && (
                                  <div className="text-gray-900 text-sm">
                                    {ingredient.totalQuantity} {ingredient.unit}
                                  </div>
                                )}
                              </label>
                              {/* Ta bort-knapp endast för användarens egna objekt */}
                              {ingredient.isCustom && (
                                <button
                                  onClick={() => removeCustomItem(ingredient.id)}
                                  className={`${buttonStyles.iconTransparentSmall} text-gray-400 hover:text-red-600 hover:bg-red-50`}
                                  title="Ta bort objekt"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lägg till egna objekt - endast för inköpslistan */}
                {viewMode === 'shopping' && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    {!showAddItemForm ? (
                      <button
                        onClick={() => setShowAddItemForm(true)}
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Lägg till eget objekt
                      </button>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 text-sm">Behöver du något annat?</h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Toalettpapper?"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                            className={`${commonClasses.input} flex-1`}
                            autoFocus
                          />
                          <button
                            onClick={addCustomItem}
                            disabled={!newItemName.trim()}
                            className={`${buttonStyles.gradientSmall} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            Lägg till
                          </button>
                          <button
                            onClick={() => {
                              setShowAddItemForm(false)
                              setNewItemName('')
                            }}
                            className={buttonStyles.action}
                          >
                            Avbryt
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sammanfattning endast för inköpslistan */}
                {viewMode === 'shopping' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center text-sm">
                      {checkedIngredients.size >= (ingredientsWithQuantities.length + customItems.length) ? (
                        <span className="text-gray-900 font-medium">Du har allt!</span>
                      ) : (
                        <span className="text-gray-600">
                          Kvar: {(ingredientsWithQuantities.length + customItems.length) - checkedIngredients.size} av {ingredientsWithQuantities.length + customItems.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
      </Modal>

      {/* Modal för receptdetaljer */}
      {selectedRecipe && showRecipeDetails && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={showRecipeDetails}
          onClose={handleCloseRecipeDetails}
        />
      )}

      {/* Modal för att välja dag */}
      <Modal
        isOpen={showDaySelector && !!selectedRecipe}
        onClose={closeDaySelector}
        title={selectedRecipe ? `Välj dag för: ${selectedRecipe.name}` : "Välj dag"}
      >
              
              <div 
                className="space-y-3"
                role="group"
                aria-labelledby="day-selector-title"
                id="day-selector-description"
              >
                {selectedRecipe && state.weekPlan.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => handleAddToDay(selectedRecipe, day.day)}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      handleAddToDay(selectedRecipe, day.day)
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors touch-target touch-manipulation ${
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
      </Modal>

      {/* aria-live borttagen i återställning */}
    </div>
  )
})

PlanningPage.displayName = 'PlanningPage'

export default PlanningPage
