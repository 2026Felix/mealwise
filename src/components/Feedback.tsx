import React, { useState } from 'react'

interface FeedbackData {
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

  const createGitHubIssue = async (feedbackData: FeedbackData): Promise<void> => {
    // GitHub API endpoint för att skapa issues
    const response = await fetch('https://api.github.com/repos/Felix2026/FoodApp/issues', {
      method: 'POST',
      headers: {
        'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN || ''}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Feedback: ${feedbackData.message.substring(0, 50)}${feedbackData.message.length > 50 ? '...' : ''}`,
        body: `## Feedback från webbplatsen

**Meddelande:**
${feedbackData.message}

**E-post:** ${feedbackData.email || 'Ej angivet'}

**Tidpunkt:** ${feedbackData.timestamp}

**Webbläsare:** ${feedbackData.userAgent}

---
*Skickat via Mealwise Feedback-formulär*`,
        labels: ['feedback', 'website'],
      }),
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
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
        message: message.trim(),
        email: email.trim() || undefined,
        timestamp: new Date().toLocaleString('sv-SE'),
        userAgent: navigator.userAgent,
      }

      await createGitHubIssue(feedbackData)
      
      setStatus('sent')
      setMessage('')
      setEmail('')
    } catch (error) {
      console.error('Feedback error:', error)
      setStatus('error')
      setErrorMessage('Kunde inte skicka feedback. Försök igen senare.')
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
              <span className="text-green-600 text-sm">Tack! Din feedback har skickats.</span>
            )}
          </div>
        </form>
      </article>
    </main>
  )
}

export default Feedback


