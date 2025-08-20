import React, { useState } from 'react'

const Feedback: React.FC = () => {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const isValid = typeof message === 'string' && message.trim().length > 0
    if (!isValid) {
      setStatus('error')
      return
    }
    const subject = encodeURIComponent('Feedback - Mealwise Beta')
    const bodyLines = [
      `Meddelande: ${message}`,
      email ? `\n\nE-post: ${email}` : ''
    ]
    const body = encodeURIComponent(bodyLines.join(''))
    setStatus('sent')
    window.location.href = `mailto:2026felix@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <article className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4">Feedback</h1>
        <p className="text-text/80 mb-4">Har du hittat en bugg eller ett förslag? Dela gärna med dig här.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text/80 mb-1" htmlFor="message">Meddelande</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-md border border-text/20 bg-background text-text p-3 min-h-[120px]"
              placeholder="Beskriv buggen eller förslaget"
            />
          </div>
          <div>
            <label className="block text-sm text-text/80 mb-1" htmlFor="email">E-post (valfritt)</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-text/20 bg-background text-text p-3"
              placeholder="din@epost.se"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-text text-background px-4 py-2 rounded-md font-semibold hover:bg-text/90">
              Skicka feedback
            </button>
            {status === 'error' && <span className="text-red-400 text-sm">Meddelandet får inte vara tomt.</span>}
            {status === 'sent' && <span className="text-text/70 text-sm">Tack! Vi öppnar ditt e-postprogram för att skicka.</span>}
          </div>
        </form>
      </article>
    </main>
  )
}

export default Feedback


