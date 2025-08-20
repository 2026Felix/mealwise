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
