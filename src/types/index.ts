// Centraliserade typer för Mealwise

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

export interface Recipe {
  id: string
  name: string
  ingredients: Ingredient[]
  prepTime: number
  category?: 'vegetables' | 'carbs' | 'protein' | 'dairy'
  difficulty?: 'easy' | 'medium' | 'hard'
  image?: string
}

export interface DayPlan {
  day: string
  recipes: Recipe[]
}

export interface RecipeState {
  weekPlan: DayPlan[]
  recipeLibrary: Recipe[]
  suggestions: Recipe[]
}

export type RecipeAction =
  | { type: 'ADD_RECIPE_TO_DAY'; day: string; recipe: Recipe }
  | { type: 'REMOVE_RECIPE_FROM_DAY'; day: string; recipeId: string }
  | { type: 'MOVE_RECIPE_BETWEEN_DAYS'; fromDay: string; toDay: string; recipe: Recipe }
  | { type: 'SET_SUGGESTIONS'; suggestions: Recipe[] }
  | { type: 'LOAD_RECIPES'; recipes: Recipe[] }
  | { type: 'GENERATE_SUGGESTIONS' }
