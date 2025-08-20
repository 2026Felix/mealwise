import { Recipe, Ingredient } from '../types'
import { MAX_RECIPE_NAME_LENGTH } from '../constants'
import { logError, logWarn, logInfo } from './logger'

// Valideringsfel-klass för bättre felhantering
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any,
    public code: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Validera att ett objekt är en giltig ingrediens
export const isValidIngredient = (obj: any): obj is Ingredient => {
  try {
    if (!obj || typeof obj !== 'object') {
      throw new ValidationError(
        'Ingredient must be an object',
        'ingredient',
        obj,
        'INVALID_TYPE'
      )
    }
    
    if (typeof obj.name !== 'string' || obj.name.trim() === '') {
      throw new ValidationError(
        'Ingredient name must be a non-empty string',
        'name',
        obj.name,
        'INVALID_NAME'
      )
    }
    
    if (typeof obj.quantity !== 'number' || obj.quantity <= 0) {
      throw new ValidationError(
        'Ingredient quantity must be a positive number',
        'quantity',
        obj.quantity,
        'INVALID_QUANTITY'
      )
    }
    
    if (typeof obj.unit !== 'string' || obj.unit.trim() === '') {
      throw new ValidationError(
        'Ingredient unit must be a non-empty string',
        'unit',
        obj.unit,
        'INVALID_UNIT'
      )
    }
    
    return true
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError(
      'Unexpected error validating ingredient',
      'ingredient',
      obj,
      'UNEXPECTED_ERROR'
    )
  }
}

// Validera att ett objekt är ett giltigt recept
export const isValidRecipe = (obj: any): obj is Recipe => {
  try {
    if (!obj || typeof obj !== 'object') {
      throw new ValidationError(
        'Recipe must be an object',
        'recipe',
        obj,
        'INVALID_TYPE'
      )
    }
    
    // Kontrollera att alla obligatoriska fält finns och har rätt typ
    if (typeof obj.id !== 'string' || obj.id.trim() === '') {
      throw new ValidationError(
        'Recipe ID must be a non-empty string',
        'id',
        obj.id,
        'INVALID_ID'
      )
    }
    
    if (typeof obj.name !== 'string' || obj.name.trim() === '') {
      throw new ValidationError(
        'Recipe name must be a non-empty string',
        'name',
        obj.name,
        'INVALID_NAME'
      )
    }
    
    if (obj.name.length > MAX_RECIPE_NAME_LENGTH) {
      throw new ValidationError(
        `Recipe name must be ${MAX_RECIPE_NAME_LENGTH} characters or less`,
        'name',
        obj.name,
        'NAME_TOO_LONG'
      )
    }
    
    if (!Array.isArray(obj.ingredients)) {
      throw new ValidationError(
        'Recipe ingredients must be an array',
        'ingredients',
        obj.ingredients,
        'INVALID_INGREDIENTS_TYPE'
      )
    }
    
    if (obj.ingredients.length === 0) {
      throw new ValidationError(
        'Recipe must have at least one ingredient',
        'ingredients',
        obj.ingredients,
        'EMPTY_INGREDIENTS'
      )
    }
    
    // Validera ingredienser
    for (let i = 0; i < obj.ingredients.length; i++) {
      try {
        isValidIngredient(obj.ingredients[i])
      } catch (error) {
        if (error instanceof ValidationError) {
          // Lägg till index-information för bättre debugging
          throw new ValidationError(
            `Ingredient at index ${i}: ${error.message}`,
            `ingredients[${i}].${error.field}`,
            error.value,
            error.code
          )
        }
        throw error
      }
    }
    
    if (typeof obj.prepTime !== 'number' || obj.prepTime <= 0) {
      throw new ValidationError(
        'Recipe prep time must be a positive number',
        'prepTime',
        obj.prepTime,
        'INVALID_PREP_TIME'
      )
    }
    
    // Validera valfria fält om de finns
    if (obj.category !== undefined && typeof obj.category !== 'string') {
      throw new ValidationError(
        'Recipe category must be a string',
        'category',
        obj.category,
        'INVALID_CATEGORY_TYPE'
      )
    }
    
    if (obj.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(obj.difficulty)) {
      throw new ValidationError(
        'Recipe difficulty must be one of: easy, medium, hard',
        'difficulty',
        obj.difficulty,
        'INVALID_DIFFICULTY'
      )
    }
    
    if (obj.image !== undefined && typeof obj.image !== 'string') {
      throw new ValidationError(
        'Recipe image must be a string',
        'image',
        obj.image,
        'INVALID_IMAGE_TYPE'
      )
    }
    
    return true
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError(
      'Unexpected error validating recipe',
      'recipe',
      obj,
      'UNEXPECTED_ERROR'
    )
  }
}

// Säker JSON parsing med validering
export const safeJsonParse = <T>(jsonString: string, validator: (obj: any) => obj is T): T | null => {
  try {
    if (typeof jsonString !== 'string') {
      logWarn('safeJsonParse called with non-string input', 'Validation', { input: jsonString })
      return null
    }
    
    const parsed = JSON.parse(jsonString)
    
    if (validator(parsed)) {
      return parsed
    }
    
    logWarn('Parsed data failed validation', 'Validation', { 
      input: jsonString, 
      parsed 
    })
    return null
  } catch (error) {
    if (error instanceof SyntaxError) {
      logError('JSON parsing failed - invalid syntax', 'Validation', { 
        input: jsonString 
      }, error as Error)
    } else {
      logError('JSON parsing failed - unexpected error', 'Validation', { 
        input: jsonString 
      }, error as Error)
    }
    return null
  }
}

// Säker drag & drop data hantering
export const safeDragDataParse = (dataTransfer: DataTransfer): Recipe | null => {
  try {
    const recipeData = dataTransfer.getData('application/json')
    if (!recipeData) {
      logWarn('No recipe data found in drag transfer', 'DragAndDrop')
      return null
    }
    
    // Begränsa storleken på drag data för att förhindra DoS
    if (recipeData.length > 10000) {
      logWarn('Drag data too large, rejecting', 'DragAndDrop', { 
        size: recipeData.length,
        maxSize: 10000
      })
      return null
    }
    
    const parsed = safeJsonParse(recipeData, isValidRecipe)
    
    if (!parsed) {
      logWarn('Failed to parse drag data as valid recipe', 'DragAndDrop', { 
        dataSize: recipeData.length 
      })
      return null
    }
    
    // Extra validering för drag & drop säkerhet
    if (parsed && parsed.id && parsed.name && Array.isArray(parsed.ingredients)) {
      logInfo('Successfully parsed drag data', 'DragAndDrop', { 
        recipeId: parsed.id,
        recipeName: parsed.name,
        ingredientCount: parsed.ingredients.length
      })
      return parsed
    }
    
    logWarn('Drag data missing required fields', 'DragAndDrop', { 
      hasId: !!parsed?.id,
      hasName: !!parsed?.name,
      hasIngredients: Array.isArray(parsed?.ingredients)
    })
    
    return null
  } catch (error) {
    logError('Failed to parse drag data', 'DragAndDrop', null, error as Error)
    return null
  }
}
