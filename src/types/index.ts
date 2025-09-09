// Centraliserade typer för Mealwise

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

export interface NutritionFacts {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface Recipe {
  id: string
  name: string
  description?: string
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number
  cookTime?: number
  totalTime: number
  servings: number
  category?: 'vegetables' | 'carbs' | 'protein' | 'dairy'
  image?: string
  nutrition?: NutritionFacts
  tags?: string[]
  author?: string
  source?: string
  rating?: number
  reviewCount?: number
}

// Ny typ för måltidsinstanser med unik identifierare
export interface MealInstance {
  instanceId: string  // Unik identifierare för varje måltidsinstans
  recipe: Recipe      // Referens till receptet
  addedAt: Date      // När måltiden lades till
}

export interface DayPlan {
  day: string
  recipes: MealInstance[]  // Ändrat från Recipe[] till MealInstance[]
}

export interface RecipeState {
  weekPlan: DayPlan[]
  recipeLibrary: Recipe[]
  suggestions: Recipe[]
}

export type RecipeAction =
  | { type: 'ADD_RECIPE_TO_DAY'; day: string; recipe: Recipe }
  | { type: 'REMOVE_RECIPE_FROM_DAY'; day: string; instanceId: string }  // Ändrat från recipeId till instanceId
  | { type: 'MOVE_RECIPE_BETWEEN_DAYS'; fromDay: string; toDay: string; mealInstance: MealInstance }  // Ändrat från recipe till mealInstance
  | { type: 'SET_SUGGESTIONS'; suggestions: Recipe[] }
  | { type: 'LOAD_RECIPES'; recipes: Recipe[] }
  | { type: 'GENERATE_SUGGESTIONS' }
