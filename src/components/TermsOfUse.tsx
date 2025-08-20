import React from 'react'

const TermsOfUse: React.FC = () => {
  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4">Användarvillkor</h1>
        <p className="text-text/80 mb-4">
          Denna beta-version tillhandahålls i befintligt skick ("as is") utan några garantier. Genom att använda
          tjänsten accepterar du att funktioner kan ändras, begränsas eller avbrytas utan föregående avisering.
        </p>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Ansvarsbegränsning</h2>
          <p className="text-text/80">
            Mealwise ansvarar inte för indirekta skador, dataförlust eller andra följdskador som kan uppstå vid
            användning av tjänsten.
          </p>
        </section>
                 <section className="space-y-3 mt-6">
           <h2 className="text-xl font-semibold text-text">Analys och mätning</h2>
           <p className="text-text/80">
             I produktionsmiljö använder vi <span className="font-medium text-text">Plausible Analytics</span> för anonym, cookie‑fri
             trafikmätning på aggregerad nivå. Detta inkluderar spårning av sidvisningar, filnedladdningar, externa länkar
             och anpassade händelser för att förstå hur tjänsten används och förbättra den.
             All data är anonymiserad och aggregerad. Läs mer i <a className="underline" href="#/privacy">Integritetspolicyn</a>.
           </p>
         </section>
        <section className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold text-text">Kontakt</h2>
          <p className="text-text/80">
            Frågor om villkor? Kontakta {" "}
            <a className="underline" href="mailto:2026felix@gmail.com?subject=Villkor%20-%20Mealwise%20Beta">2026felix@gmail.com</a>.
          </p>
        </section>
        <p className="text-text/60 text-sm mt-6">Senast uppdaterad: 2025-01-20</p>
      </article>
    </main>
  )
}

export default TermsOfUse


