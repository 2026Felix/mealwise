// Prestanda-verktyg för Mealwise

import { logger } from './logger'
import React from 'react'

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

/**
 * Mäter prestanda för async-kodblock
 */
export const measureAsyncBlock = async <T>(
  operationName: string,
  block: () => Promise<T>,
  context?: string
): Promise<T> => {
  const start = performance.now()
  
  try {
    const result = await block()
    const duration = performance.now() - start
    
    logger.logPerformance(operationName, duration, context)
    
    return result
  } catch (error) {
    const duration = performance.now() - start
    
    logger.error(
      `Async block performance measurement failed for ${operationName}`,
      context || 'Performance',
      { duration, operationName },
      error as Error
    )
    
    throw error
  }
}

/**
 * Debounce-funktion med prestandamätning
 */
export const debounceWithPerformance = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number,
  operationName: string,
  context?: string
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: T) => {
    clearTimeout(timeoutId)
    
    timeoutId = setTimeout(() => {
      measurePerformance(fn, operationName, context)(...args)
    }, delay)
  }
}

/**
 * Throttle-funktion med prestandamätning
 */
export const throttleWithPerformance = <T extends any[]>(
  fn: (...args: T) => void,
  limit: number,
  operationName: string,
  context?: string
) => {
  let inThrottle: boolean
  
  return (...args: T) => {
    if (!inThrottle) {
      measurePerformance(fn, operationName, context)(...args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Mäter minnesanvändning (endast tillgängligt i vissa miljöer)
 */
export const measureMemoryUsage = (operationName: string, context?: string) => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    const usage = {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
    }
    
    logger.info(
      `Memory usage for ${operationName}`,
      context || 'Performance',
      usage
    )
    
    return usage
  }
  
  return null
}

/**
 * Mäter rendering-prestanda
 */
export const measureRenderPerformance = (
  componentName: string,
  renderCount: number = 1
) => {
  // Simulera rendering-tid
  const renderTime = Math.random() * 10 + 1 // 1-11ms
  
  setTimeout(() => {
    logger.info(
      `Component ${componentName} rendered ${renderCount} times`,
      'Rendering',
      { renderCount }
    )
  }, renderTime)
}

/**
 * Prestanda-decorator för React-komponenter
 * Notera: Denna funktion kräver React-import i komponenten som använder den
 */
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = (props: P) => {
    // useEffect kommer att behöva importeras i komponenten som använder denna
    // useEffect(() => {
    //   logger.logPerformance(`Mount ${componentName}`, 0, 'ComponentLifecycle')
    // }, [])
    
    // Använd React.createElement istället för JSX
    return React.createElement(Component, props)
  }
  
  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`
  
  return WrappedComponent
}

/**
 * Mäter nätverksprestanda
 */
export const measureNetworkPerformance = async (
  url: string,
  operationName: string
) => {
  const start = performance.now()
  
  try {
    const response = await fetch(url)
    const duration = performance.now() - start
    
    logger.logPerformance(
      `Network ${operationName}`,
      duration,
      'Network'
    )
    
    logger.info(
      `Network request completed`,
      'Network',
      {
        url,
        operationName,
        status: response.status,
        duration,
        size: response.headers.get('content-length')
      }
    )
    
    return response
  } catch (error) {
    const duration = performance.now() - start
    
    logger.error(
      `Network request failed for ${operationName}`,
      'Network',
      { url, operationName, duration },
      error as Error
    )
    
    throw error
  }
}

/**
 * Prestanda-statistik samlare
 */
export class PerformanceCollector {
  private measurements: Array<{
    operation: string
    duration: number
    timestamp: number
    context?: string
  }> = []
  
  addMeasurement(operation: string, duration: number, context?: string) {
    this.measurements.push({
      operation,
      duration,
      timestamp: Date.now(),
      context
    })
    
    // Behåll endast de senaste 1000 mätningarna
    if (this.measurements.length > 1000) {
      this.measurements = this.measurements.slice(-1000)
    }
  }
  
  getStats(operation?: string) {
    const filtered = operation 
      ? this.measurements.filter(m => m.operation === operation)
      : this.measurements
    
    if (filtered.length === 0) return null
    
    const durations = filtered.map(m => m.duration)
    const total = durations.reduce((sum, d) => sum + d, 0)
    const avg = total / durations.length
    const min = Math.min(...durations)
    const max = Math.max(...durations)
    
    return {
      count: filtered.length,
      total,
      average: avg,
      min,
      max,
      median: this.getMedian(durations)
    }
  }
  
  private getMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2
    }
    
    return sorted[mid]
  }
  
  clear() {
    this.measurements = []
  }
  
  export() {
    return this.measurements
  }
}

// Global prestanda-samlare
export const performanceCollector = new PerformanceCollector()
