import { Component, ErrorInfo, ReactNode } from 'react'
import { logger, logError } from '../utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId?: string
  showTechnicalDetails: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      showTechnicalDetails: false 
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Generera unikt fel-ID för spårning
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.setState({ error, errorInfo, errorId })
    
    // Logga felet med strukturerad loggning
    logError(
      `React error boundary caught error: ${error.message}`,
      'ErrorBoundary',
      { errorId, componentStack: errorInfo.componentStack },
      error
    )

    // Anropa custom error handler om den finns
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo)
      } catch (handlerError) {
        logError('Error in custom error handler', 'ErrorBoundary', null, handlerError as Error)
      }
    }

    // I produktion kan du här skicka fel till en extern tjänst
    // Aktivera detta när du är redo för produktion
    // this.reportErrorToService(error, errorInfo, errorId)
  }

  // private reportErrorToService(error: Error, errorInfo: ErrorInfo, errorId: string) {
  //   // Exempel på hur du kan skicka fel till en extern tjänst
  //   try {
  //     const errorReport = {
  //       errorId,
  //       timestamp: new Date().toISOString(),
  //       userAgent: navigator.userAgent,
  //       url: window.location.href,
  //       error: {
  //         name: error.name,
  //         message: error.message,
  //         stack: error.stack
  //       },
  //       componentStack: errorInfo.componentStack,
  //       // Lägg till mer kontext här om det behövs
  //     }

  //     // I produktion, skicka till din felrapporteringstjänst
  //     // fetch('/api/error-report', { method: 'POST', body: JSON.stringify(errorReport) })
      
  //     logger.info('Error reported to service', 'ErrorBoundary', { errorId })
  //   } catch (reportError) {
  //     logger.error('Failed to report error to service', 'ErrorBoundary', null, reportError as Error)
  //   }
  // }

  private handleRetry = () => {
    logger.info('User attempting to retry after error', 'ErrorBoundary', { 
      errorId: this.state.errorId 
    })
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined, 
      errorId: undefined 
    })
  }

  private handleReload = () => {
    logger.info('User reloading page after error', 'ErrorBoundary', { 
      errorId: this.state.errorId 
    })
    
    window.location.reload()
  }

  private toggleTechnicalDetails = () => {
    this.setState(prev => ({ 
      showTechnicalDetails: !prev.showTechnicalDetails 
    }))
  }

  private copyErrorDetails = () => {
    if (!this.state.error || !this.state.errorInfo) return

    const errorDetails = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: this.state.error.name,
        message: this.state.error.message,
        stack: this.state.error.stack
      },
      componentStack: this.state.errorInfo.componentStack
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        logger.info('Error details copied to clipboard', 'ErrorBoundary', { errorId: this.state.errorId })
      })
      .catch(() => {
        logger.warn('Failed to copy error details to clipboard', 'ErrorBoundary')
      })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, errorId, showTechnicalDetails } = this.state
      const isDevelopment = import.meta.env.DEV

      return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-component rounded-lg p-6 border border-red-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-text">Ett fel har uppstått</h2>
                <p className="text-text/60 text-sm">Fel-ID: {errorId}</p>
              </div>
            </div>
            
            {/* Felmeddelande */}
            <div className="mb-6">
              <p className="text-text/80 mb-3">
                Ett oväntat fel har uppstått i applikationen. Detta kan bero på en temporär bugg eller ett problem med webbläsaren.
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">Felmeddelande:</p>
                  <p className="text-red-700 text-sm font-mono">{error.message}</p>
                </div>
              )}
            </div>
            
            {/* Åtgärdsknappar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={this.handleRetry}
                className="flex-1 px-6 py-3 bg-text hover:bg-text/90 text-background font-medium rounded-lg transition-colors border border-text/20 hover:border-text/30"
              >
                Försök igen
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Ladda om sidan
              </button>
            </div>

            {/* Tekniska detaljer */}
            {isDevelopment && error && errorInfo && (
              <div className="border-t border-text/20 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={this.toggleTechnicalDetails}
                    className="text-sm text-text/60 hover:text-text transition-colors flex items-center gap-2"
                  >
                    {showTechnicalDetails ? 'Dölj' : 'Visa'} tekniska detaljer
                    <svg 
                      className={`w-4 h-4 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={this.copyErrorDetails}
                    className="text-xs text-text/40 hover:text-text/60 transition-colors px-2 py-1 rounded border border-text/20 hover:border-text/30"
                  >
                    Kopiera detaljer
                  </button>
                </div>
                
                {showTechnicalDetails && (
                  <div className="space-y-4">
                    {/* Stack trace */}
                    <div>
                      <h4 className="text-sm font-medium text-text mb-2">Stack Trace:</h4>
                      <pre className="text-xs text-red-700 bg-red-50 p-3 rounded border border-red-200 overflow-x-auto max-h-40">
                        {error.stack}
                      </pre>
                    </div>
                    
                    {/* Component Stack */}
                    <div>
                      <h4 className="text-sm font-medium text-text mb-2">Component Stack:</h4>
                      <pre className="text-xs text-blue-700 bg-blue-50 p-3 rounded border border-blue-200 overflow-x-auto max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Support information */}
            <div className="border-t border-text/20 pt-4">
              <p className="text-xs text-text/50 text-center">
                Om problemet kvarstår, kontakta support med fel-ID: <span className="font-mono">{errorId}</span>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
