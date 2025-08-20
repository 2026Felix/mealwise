import React from 'react'

const Contact: React.FC = () => {
  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4">Kontakta oss</h1>
        <p className="text-text/80 mb-4">
          Behöver du hjälp eller vill du komma i kontakt med oss? Skicka gärna ett mejl så återkommer vi så snart vi kan.
        </p>
        <p className="text-text/80">
          <a className="underline" href="mailto:2026felix@gmail.com">2026felix@gmail.com</a>
        </p>
      </article>
    </main>
  )
}

export default Contact


