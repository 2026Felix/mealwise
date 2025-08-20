import React, { useState } from 'react'

interface FeedbackData {
  id: string
  message: string
  email?: string
  timestamp: string
  userAgent: string
}

const Feedback: React.FC = () => {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const saveFeedbackToLocalStorage = (feedbackData: FeedbackData): void => {
    try {
      // Hämta befintlig feedback från localStorage
      const existingFeedback = localStorage.getItem('mealwise-feedback')
      const feedbackArray: FeedbackData[] = existingFeedback ? JSON.parse(existingFeedback) : []
      
      // Lägg till ny feedback
      feedbackArray.push(feedbackData)
      
      // Spara tillbaka till localStorage
      localStorage.setItem('mealwise-feedback', JSON.stringify(feedbackArray))
    } catch (error) {
      console.error('Error saving feedback:', error)
      throw new Error('Kunde inte spara feedback lokalt')
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setStatus('error')
      setErrorMessage('Meddelandet får inte vara tomt.')
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const feedbackData: FeedbackData = {
        id: Date.now().toString(),
        message: message.trim(),
        email: email.trim() || undefined,
        timestamp: new Date().toLocaleString('sv-SE'),
        userAgent: navigator.userAgent,
      }

      saveFeedbackToLocalStorage(feedbackData)
      
      setStatus('sent')
      setMessage('')
      setEmail('')
    } catch (error) {
      console.error('Feedback error:', error)
      setStatus('error')
      setErrorMessage('Kunde inte spara feedback. Försök igen senare.')
    }
  }

  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <article className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4">Feedback</h1>
        <p className="text-text/80 mb-4">Har du hittat en bugg eller ett förslag? Dela gärna med dig här.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text/80 mb-1" htmlFor="message">
              Meddelande *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-md border border-text/20 bg-background text-text p-3 min-h-[120px]"
              placeholder="Beskriv buggen eller förslaget"
              disabled={status === 'sending'}
            />
          </div>
          
          <div>
            <label className="block text-sm text-text/80 mb-1" htmlFor="email">
              E-post (valfritt)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-text/20 bg-background text-text p-3"
              placeholder="din@epost.se"
              disabled={status === 'sending'}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="bg-text text-background px-4 py-2 rounded-md font-semibold hover:bg-text/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Skickar...' : 'Skicka feedback'}
            </button>
            
            {status === 'error' && (
              <span className="text-red-400 text-sm">{errorMessage}</span>
            )}
            
            {status === 'sent' && (
              <span className="text-green-600 text-sm">Tack! Din feedback har sparats.</span>
            )}
          </div>
        </form>
      </article>
    </main>
  )
}

export default Feedback


