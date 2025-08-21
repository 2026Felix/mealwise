// Optimerade prestanda-verktyg för Mealwise
// Endast de funktioner som faktiskt används

import { logger } from './logger'

/**
 * Mäter prestanda för en funktion eller operation
 */
export const measurePerformance = <T extends any[], R>(
  fn: (...args: T) => R,
  operationName: string,
  context?: string
) => {
  return (...args: T): R => {
    const start = performance.now()
    
    try {
      const result = fn(...args)
      const duration = performance.now() - start
      
      logger.logPerformance(operationName, duration, context)
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      
      logger.error(
        `Performance measurement failed for ${operationName}`,
        context || 'Performance',
        { duration, operationName },
        error as Error
      )
      
      throw error
    }
  }
}

/**
 * Mäter prestanda för async-funktioner
 */
export const measureAsyncPerformance = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string,
  context?: string
) => {
  return async (...args: T): Promise<R> => {
    const start = performance.now()
    
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      
      logger.logPerformance(operationName, duration, context)
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      
      logger.error(
        `Async performance measurement failed for ${operationName}`,
        context || 'Performance',
        { duration, operationName },
        error as Error
      )
      
      throw error
    }
  }
}

/**
 * Mäter prestanda för en kodblock
 */
export const measureBlock = <T>(
  operationName: string,
  block: () => T,
  context?: string
): T => {
  const start = performance.now()
  
  try {
    const result = block()
    const duration = performance.now() - start
    
    logger.logPerformance(operationName, duration, context)
    
    return result
  } catch (error) {
    const duration = performance.now() - start
    
    logger.error(
      `Block performance measurement failed for ${operationName}`,
      context || 'Performance',
      { duration, operationName },
      error as Error
    )
    
    throw error
  }
}
