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

// Säkerhetsverktyg för Mealwise

/**
 * Saniterar användarinput för att förhindra XSS-attacker
 * Tar bort potentiellt skadliga tecken och begränsar längden
 */
export const sanitizeUserInput = (input: string, maxLength: number = 100): string => {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Begränsa längden
  const truncated = input.slice(0, maxLength)
  
  // Ta bort HTML-taggar och skadliga tecken
  return truncated
    .replace(/[<>]/g, '') // Ta bort < och >
    .replace(/javascript:/gi, '') // Ta bort javascript: protokoll
    .replace(/on\w+=/gi, '') // Ta bort event handlers som onclick=
    .replace(/&/g, '&amp;') // Escapa &
    .replace(/"/g, '&quot;') // Escapa "
    .replace(/'/g, '&#x27;') // Escapa '
    .trim()
}

/**
 * Validerar och saniterar localStorage-nycklar
 */
export const sanitizeStorageKey = (key: string): string => {
  if (typeof key !== 'string') {
    throw new Error('Storage key must be a string')
  }
  
  // Endast tillåta alfanumeriska tecken, bindestreck och understreck
  const sanitized = key.replace(/[^a-zA-Z0-9\-_]/g, '')
  
  if (sanitized.length === 0) {
    throw new Error('Invalid storage key')
  }
  
  return sanitized
}

/**
 * Säker localStorage wrapper med validering
 */
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const sanitizedKey = sanitizeStorageKey(key)
      const sanitizedValue = typeof value === 'string' ? value : String(value)
      
      // Begränsa värdet till rimlig storlek (5KB)
      if (sanitizedValue.length > 5000) {
        console.warn('Storage value too large, truncating')
        localStorage.setItem(sanitizedKey, sanitizedValue.slice(0, 5000))
      } else {
        localStorage.setItem(sanitizedKey, sanitizedValue)
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const sanitizedKey = sanitizeStorageKey(key)
      return localStorage.getItem(sanitizedKey)
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return null
    }
  },
  
  removeItem: (key: string): void => {
    try {
      const sanitizedKey = sanitizeStorageKey(key)
      localStorage.removeItem(sanitizedKey)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }
}

/**
 * Validerar att en URL är säker för externa resurser
 */
export const isSecureUrl = (url: string): boolean => {
  if (typeof url !== 'string') {
    return false
  }
  
  try {
    const urlObj = new URL(url)
    
    // Endast HTTPS tillåtet
    if (urlObj.protocol !== 'https:') {
      return false
    }
    
    // Tillåtna domäner för externa resurser
    const allowedDomains = [
      'fonts.cdnfonts.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ]
    
    return allowedDomains.some(domain => urlObj.hostname === domain)
  } catch {
    return false
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
    
    if (!Array.isArray(obj.ingredients) || obj.ingredients.length === 0) {
      throw new ValidationError(
        'Recipe must have at least one ingredient',
        'ingredients',
        obj.ingredients,
        'INVALID_INGREDIENTS'
      )
    }
    
    if (!Array.isArray(obj.instructions) || obj.instructions.length === 0) {
      throw new ValidationError(
        'Recipe must have at least one instruction',
        'instructions',
        obj.instructions,
        'INVALID_INSTRUCTIONS'
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
    
    if (!validator(parsed)) {
      logWarn('Parsed object failed validation', 'Validation', { parsed })
      return null
    }
    
    return parsed
  } catch (error) {
    logError('JSON parsing failed', 'Validation', { jsonString, error: error instanceof Error ? error.message : 'Unknown error' })
    return null
  }
}

// Säker drag data parsing för recept
export const safeDragDataParse = (dataTransfer: DataTransfer): Recipe | null => {
  try {
    const jsonData = dataTransfer.getData('application/json')
    if (!jsonData) {
      logWarn('No JSON data found in drag transfer', 'Validation')
      return null
    }
    
    return safeJsonParse<Recipe>(jsonData, isValidRecipe)
  } catch (error) {
    logError('Drag data parsing failed', 'Validation', { error: error instanceof Error ? error.message : 'Unknown error' })
    return null
  }
}

// Validera och sanitera sökfrågor
export const validateSearchQuery = (query: string): string => {
  if (typeof query !== 'string') {
    return ''
  }
  
  // Sanitera input
  const sanitized = sanitizeUserInput(query, 50)
  
  // Logga sökning för analytics (om implementerat)
  if (sanitized.length > 0) {
    logInfo('Search query executed', 'Search', { query: sanitized, length: sanitized.length })
  }
  
  return sanitized
}

// Validera receptdata från formulär
export const validateRecipeFormData = (formData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  try {
    // Validera grundläggande fält
    if (!formData.name || typeof formData.name !== 'string' || formData.name.trim() === '') {
      errors.push('Receptnamn är obligatoriskt')
    } else if (formData.name.length > MAX_RECIPE_NAME_LENGTH) {
      errors.push(`Receptnamn får inte vara längre än ${MAX_RECIPE_NAME_LENGTH} tecken`)
    }
    
    if (!formData.ingredients || !Array.isArray(formData.ingredients) || formData.ingredients.length === 0) {
      errors.push('Minst en ingrediens krävs')
    }
    
    if (!formData.instructions || !Array.isArray(formData.instructions) || formData.instructions.length === 0) {
      errors.push('Minst en instruktion krävs')
    }
    
    if (!formData.prepTime || typeof formData.prepTime !== 'number' || formData.prepTime <= 0) {
      errors.push('Tillagningstid måste vara ett positivt tal')
    }
    
    // Validera ingredienser
    if (formData.ingredients) {
      formData.ingredients.forEach((ingredient: any, index: number) => {
        try {
          isValidIngredient(ingredient)
        } catch (error) {
          if (error instanceof ValidationError) {
            errors.push(`Ingrediens ${index + 1}: ${error.message}`)
          }
        }
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  } catch (error) {
    logError('Recipe form validation failed', 'Validation', { error: error instanceof Error ? error.message : 'Unknown error' })
    return {
      isValid: false,
      errors: ['Ett oväntat fel uppstod vid validering']
    }
  }
}
