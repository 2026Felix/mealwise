import { Component, ErrorInfo, ReactNode } from 'react'
import { logError } from '../utils/logger'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null
  }

  public static getDerivedStateFromError(error: Error): State {
    // Uppdatera state så att nästa render visar fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      errorId: null
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logga fel till konsolen för utveckling
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Generera unikt fel-ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Logga felet med vårt loggningssystem
    logError('ErrorBoundary caught an error', 'ErrorBoundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }, error)

    // Uppdatera state med fel-ID
    this.setState({ errorId })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportError = () => {
    if (this.state.errorId) {
      // Skapa en mailto-länk med felinformation
      const subject = encodeURIComponent(`Mealwise Error Report - ${this.state.errorId}`)
      const body = encodeURIComponent(`
Hej Mealwise-teamet!

Jag stötte på ett fel i applikationen. Här är detaljerna:

Fel-ID: ${this.state.errorId}
Tidpunkt: ${new Date().toLocaleString('sv-SE')}
URL: ${window.location.href}
Webbläsare: ${navigator.userAgent}

Felmeddelande: ${this.state.error?.message || 'Inget felmeddelande'}

Vad gjorde du när felet uppstod?
${''}

Vad förväntade du dig skulle hända?
${''}

Vad hände istället?
${''}

Tack för din hjälp!

---
Detta fel har loggats automatiskt med ID: ${this.state.errorId}
      `)
      
      window.open(`mailto:feedback@mealwise.se?subject=${subject}&body=${body}`)
    }
  }

  private handleCopyErrorDetails = async () => {
    if (this.state.error && this.state.errorInfo) {
      const errorDetails = `
Fel-ID: ${this.state.errorId}
Tidpunkt: ${new Date().toLocaleString('sv-SE')}
URL: ${window.location.href}
Webbläsare: ${navigator.userAgent}

Felmeddelande: ${this.state.error.message}

Stack trace:
${this.state.error.stack}

Component Stack:
${this.state.errorInfo.componentStack}
      `.trim()

      try {
        await navigator.clipboard.writeText(errorDetails)
        // Visa bekräftelse (enkel implementation)
        alert('Felinformation kopierad till urklipp!')
      } catch (err) {
        console.error('Kunde inte kopiera felinformation:', err)
        // Fallback: visa felinformation i en alert
        alert('Kunde inte kopiera automatiskt. Här är felinformationen:\n\n' + errorDetails)
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-component rounded-lg p-6 border border-red-200 shadow-lg">
            {/* Header med ikon */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Något gick fel
              </h1>
              <p className="text-gray-600">
                Vi beklagar, men något oväntat hände. Vårt team har blivit notifierat.
              </p>
            </div>

            {/* Fel-ID */}
            {this.state.errorId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Fel-ID:</strong> {this.state.errorId}
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Använd detta ID om du kontaktar support.
                </p>
              </div>
            )}

            {/* Åtgärder */}
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleReload}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Ladda om sidan
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                Gå till startsidan
              </button>
            </div>

            {/* Extra hjälp */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Om problemet kvarstår, kan du:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={this.handleReportError}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Rapportera felet
                </button>
                
                <button
                  onClick={this.handleCopyErrorDetails}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Kopiera felinformation
                </button>
              </div>
            </div>

            {/* Teknisk information (endast i utvecklingsläge) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                <summary className="bg-gray-50 px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  Visa teknisk information (endast för utvecklare)
                </summary>
                <div className="p-4 bg-white">
                  <pre className="text-xs text-red-600 overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Component Stack:</h4>
                      <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
