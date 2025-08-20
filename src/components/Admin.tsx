import React, { useState, useEffect } from 'react'

interface FeedbackData {
  id: string
  message: string
  email?: string
  timestamp: string
  userAgent: string
}

const Admin: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = () => {
    try {
      setLoading(true)
      const storedFeedback = localStorage.getItem('mealwise-feedback')
      if (storedFeedback) {
        const feedbackArray: FeedbackData[] = JSON.parse(storedFeedback)
        setFeedback(feedbackArray)
      } else {
        setFeedback([])
      }
    } catch (err) {
      console.error('Error loading feedback:', err)
      setError('Kunde inte ladda feedback från lokal lagring.')
    } finally {
      setLoading(false)
    }
  }

  const deleteFeedback = (id: string) => {
    try {
      const updatedFeedback = feedback.filter(item => item.id !== id)
      localStorage.setItem('mealwise-feedback', JSON.stringify(updatedFeedback))
      setFeedback(updatedFeedback)
    } catch (err) {
      console.error('Error deleting feedback:', err)
    }
  }

  const clearAllFeedback = () => {
    if (window.confirm('Är du säker på att du vill radera all feedback? Detta går inte att ångra.')) {
      try {
        localStorage.removeItem('mealwise-feedback')
        setFeedback([])
      } catch (err) {
        console.error('Error clearing feedback:', err)
      }
    }
  }

  const downloadFeedback = () => {
    try {
      const dataStr = JSON.stringify(feedback, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `mealwise-feedback-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading feedback:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('sv-SE')
  }

  if (loading) {
    return (
      <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text mx-auto"></div>
          <p className="mt-4 text-text/70">Laddar feedback...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={loadFeedback}
            className="bg-text text-background px-4 py-2 rounded-md font-semibold hover:bg-text/90"
          >
            Försök igen
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4 sm:mb-0">
            Feedback Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text/70">
              {feedback.length} feedback-meddelanden
            </span>
            <button 
              onClick={loadFeedback}
              className="bg-text text-background px-4 py-2 rounded-md font-semibold hover:bg-text/90"
            >
              Uppdatera
            </button>
            <button 
              onClick={downloadFeedback}
              disabled={feedback.length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ladda ner JSON
            </button>
            <button 
              onClick={clearAllFeedback}
              disabled={feedback.length === 0}
              className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rensa allt
            </button>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text/70">Ingen feedback hittades.</p>
            <p className="text-text/50 text-sm mt-2">Feedback sparas lokalt i webbläsaren.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-text">
                        Feedback #{item.id.slice(-6)}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Ny
                      </span>
                    </div>
                    
                    <div className="text-sm text-text/70 mb-3">
                      <p>Tidpunkt: {formatDate(item.timestamp)}</p>
                      {item.email && <p>E-post: {item.email}</p>}
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <div className="text-text/80 whitespace-pre-wrap">
                        {item.message}
                      </div>
                    </div>

                    <div className="text-xs text-text/50 mt-3">
                      <p>Webbläsare: {item.userAgent}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => deleteFeedback(item.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Admin
