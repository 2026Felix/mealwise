// Strukturerad loggning för Mealwise

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string
  data?: any
  error?: Error
  stack?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = true // Alltid aktivera loggning för debugging

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true
    
    // I produktion, logga endast WARN och ERROR
    return level >= LogLevel.WARN
  }

  private addLog(level: LogLevel, message: string, context?: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      data,
      error,
      stack: error?.stack
    }

    this.logs.push(entry)
    
    // Begränsa antalet loggar i minnet
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console logging
    const prefix = context ? `[${context}]` : '[Mealwise]'
    const timestamp = new Date().toLocaleTimeString('sv-SE')
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${timestamp} ${message}`, data || '')
        break
      case LogLevel.INFO:
        console.info(`${prefix} ${timestamp} ${message}`, data || '')
        break
      case LogLevel.WARN:
        console.warn(`${prefix} ${timestamp} ${message}`, data || '')
        break
      case LogLevel.ERROR:
        console.error(`${prefix} ${timestamp} ${message}`, error || data || '')
        break
      case LogLevel.FATAL:
        console.error(`${prefix} ${timestamp} FATAL: ${message}`, error || data || '')
        break
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.DEBUG, message, context, data)
  }

  info(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.INFO, message, context, data)
  }

  warn(message: string, context?: string, data?: any): void {
    this.addLog(LogLevel.WARN, message, context, data)
  }

  error(message: string, context?: string, data?: any, error?: Error): void {
    this.addLog(LogLevel.ERROR, message, context, data, error)
  }

  fatal(message: string, context?: string, data?: any, error?: Error): void {
    this.addLog(LogLevel.FATAL, message, context, data, error)
  }

  // Logga användarinteraktioner för debugging
  logUserAction(action: string, details?: any): void {
    this.info(`User action: ${action}`, 'UserInteraction', details)
  }

  // Logga API-anrop
  logApiCall(endpoint: string, method: string, data?: any): void {
    this.debug(`API ${method} ${endpoint}`, 'API', data)
  }

  // Logga fel i komponenter
  logComponentError(componentName: string, error: Error, props?: any): void {
    this.error(`Component error in ${componentName}`, 'Component', props, error)
  }

  // Logga prestanda
  logPerformance(operation: string, duration: number, context?: string): void {
    this.debug(`Performance: ${operation} took ${duration}ms`, context || 'Performance')
  }

  // Hämta alla loggar (användbart för debugging)
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Hämta loggar för specifik nivå
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  // Hämta loggar för specifik kontext
  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter(log => log.context === context)
  }

  // Rensa loggar
  clearLogs(): void {
    this.logs = []
  }

  // Exportera loggar som JSON (användbart för debugging)
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Sök i loggar
  searchLogs(query: string): LogEntry[] {
    const lowerQuery = query.toLowerCase()
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(lowerQuery) ||
      log.context?.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(log.data).toLowerCase().includes(lowerQuery)
    )
  }
}

// Skapa en global logger-instans
export const logger = new Logger()

// Utility-funktioner för enkel loggning
export const logDebug = (message: string, context?: string, data?: any) => 
  logger.debug(message, context, data)

export const logInfo = (message: string, context?: string, data?: any) => 
  logger.info(message, context, data)

export const logWarn = (message: string, context?: string, data?: any) => 
  logger.warn(message, context, data)

export const logError = (message: string, context?: string, data?: any, error?: Error) => 
  logger.error(message, context, data, error)

export const logFatal = (message: string, context?: string, data?: any, error?: Error) => 
  logger.fatal(message, context, data, error)
