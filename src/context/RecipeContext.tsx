import { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react'
import { Recipe, DayPlan, RecipeState, RecipeAction } from '../types'
import { DAYS_OF_WEEK } from '../constants'
import { defaultRecipes } from '../constants/recipes'

const initialState: RecipeState = {
  weekPlan: DAYS_OF_WEEK.map(day => ({ day, recipes: [] })),
  recipeLibrary: defaultRecipes,
  suggestions: []
}

// Förbättrade smarta rekommendationsfunktioner
const getCommonIngredients = (recipes: Recipe[]): string[] => {
  if (recipes.length === 0) return []
  
  const ingredientCounts = new Map<string, number>()
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase().trim()
      ingredientCounts.set(key, (ingredientCounts.get(key) || 0) + 1)
    })
  })
  
  // Returnera alla ingredienser som används, sorterade efter användningsfrekvens
  return Array.from(ingredientCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([ingredient, _]) => ingredient)
}

const getIngredientsWithQuantities = (recipes: Recipe[]): Array<{name: string, totalQuantity: number, unit: string}> => {
  if (recipes.length === 0) return []
  
  const ingredientMap = new Map<string, {totalQuantity: number, unit: string}>()
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase().trim()
      const existing = ingredientMap.get(key)
      
      if (existing) {
        existing.totalQuantity += ingredient.quantity
      } else {
        ingredientMap.set(key, {
          totalQuantity: ingredient.quantity,
          unit: ingredient.unit
        })
      }
    })
  })
  
  return Array.from(ingredientMap.entries())
    .map(([name, {totalQuantity, unit}]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      totalQuantity,
      unit
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

const generateSmartSuggestions = (weekPlan: DayPlan[], recipeLibrary: Recipe[]): Recipe[] => {
  const plannedRecipes = weekPlan.flatMap(day => day.recipes)
  
  if (plannedRecipes.length === 0) {
    return []
  }
  
  const commonIngredients = getCommonIngredients(plannedRecipes)
  
  // Skapa en uppsättning av alla planerade receptnamn (utan varianter)
  const plannedRecipeBaseNames = new Set(
    plannedRecipes.map(recipe => {
      // Ta bort variant-suffixen för att få grundreceptet
      return recipe.name
        .replace(' – snabb variant', '')
        .replace(' – festlig variant', '')
        .trim()
    })
  )
  
  const recipeScores = recipeLibrary
    .filter(recipe => {
      // Filtrera bort exakt samma recept
      if (plannedRecipes.some(p => p.id === recipe.id)) return false
      
      // Filtrera bort alla varianter av samma grundrecept
      const baseRecipeName = recipe.name
        .replace(' – snabb variant', '')
        .replace(' – festlig variant', '')
        .trim()
      
      return !plannedRecipeBaseNames.has(baseRecipeName)
    })
    .map(recipe => {
      let score = 0
      
      // Poäng baserat på gemensamma ingredienser - enklare och tydligare
      commonIngredients.forEach(ingredient => {
        // Mjukare matchning - kolla om ingrediensnamnet innehåller den gemensamma ingrediensen
        if (recipe.ingredients.some(i => 
          i.name.toLowerCase().includes(ingredient) || 
          ingredient.includes(i.name.toLowerCase())
        )) {
          score += 3 // Öka poängen för gemensamma ingredienser
        }
      })
      
      // Extra poäng för enkla recept
      if (recipe.difficulty === 'easy') score += 1
      
      return { recipe, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15) // Öka från 5 till 15 förslag
  
  return recipeScores.map(item => item.recipe)
}

const recipeReducer = (state: RecipeState, action: RecipeAction): RecipeState => {
  switch (action.type) {
    case 'ADD_RECIPE_TO_DAY':
      const newState = {
        ...state,
        weekPlan: state.weekPlan.map(day =>
          day.day === action.day
            ? { ...day, recipes: [...day.recipes, action.recipe] }
            : day
        )
      }
      return {
        ...newState,
        suggestions: generateSmartSuggestions(newState.weekPlan, newState.recipeLibrary)
      }
    
    case 'REMOVE_RECIPE_FROM_DAY':
      const stateAfterRemoval = {
        ...state,
        weekPlan: state.weekPlan.map(day =>
          day.day === action.day
            ? { ...day, recipes: day.recipes.filter(r => r.id !== action.recipeId) }
            : day
        )
      }
      return {
        ...stateAfterRemoval,
        suggestions: generateSmartSuggestions(stateAfterRemoval.weekPlan, stateAfterRemoval.recipeLibrary)
      }
    
    case 'MOVE_RECIPE_BETWEEN_DAYS':
      const stateAfterMove = {
        ...state,
        weekPlan: state.weekPlan.map(day => {
          if (day.day === action.fromDay) {
            return { ...day, recipes: day.recipes.filter(r => r.id !== action.recipe.id) }
          } else if (day.day === action.toDay) {
            return { ...day, recipes: [...day.recipes, action.recipe] }
          }
          return day
        })
      }
      return {
        ...stateAfterMove,
        suggestions: generateSmartSuggestions(stateAfterMove.weekPlan, stateAfterMove.recipeLibrary)
      }
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.suggestions }
    
    case 'LOAD_RECIPES':
      const stateWithRecipes = { ...state, recipeLibrary: action.recipes }
      return {
        ...stateWithRecipes,
        suggestions: generateSmartSuggestions(stateWithRecipes.weekPlan, stateWithRecipes.recipeLibrary)
      }
    
    case 'GENERATE_SUGGESTIONS':
      return {
        ...state,
        suggestions: generateSmartSuggestions(state.weekPlan, state.recipeLibrary)
      }
    
    default:
      return state
  }
}

const RecipeContext = createContext<{
  state: RecipeState
  dispatch: React.Dispatch<RecipeAction>
  generateSuggestions: () => void
  getCommonIngredientsFromContext: () => string[]
  getIngredientsWithQuantitiesFromContext: () => Array<{name: string, totalQuantity: number, unit: string}>
} | null>(null)

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState)

  const generateSuggestions = useCallback(() => {
    dispatch({ type: 'GENERATE_SUGGESTIONS' })
  }, [])

  const getCommonIngredientsFromContext = useCallback(() => {
    return getCommonIngredients(state.weekPlan.flatMap(day => day.recipes))
  }, [state.weekPlan])

  const getIngredientsWithQuantitiesFromContext = useCallback(() => {
    return getIngredientsWithQuantities(state.weekPlan.flatMap(day => day.recipes))
  }, [state.weekPlan])

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    generateSuggestions,
    getCommonIngredientsFromContext,
    getIngredientsWithQuantitiesFromContext
  }), [
    state,
    generateSuggestions,
    getCommonIngredientsFromContext,
    getIngredientsWithQuantitiesFromContext
  ])

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  )
}

export const useRecipeContext = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider')
  }
  return context
}
