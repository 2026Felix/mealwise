import React from 'react'

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-3 sm:p-4 md:p-6 mt-8 sm:mt-12 md:mt-16">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-4">Integritetspolicy</h1>
        <p className="text-text/80 mb-4">
          Vi värnar om din integritet. I denna beta-version lagras dina val lokalt i din webbläsare.
          I produktionsmiljö använder vi Plausible Analytics för anonym, cookie‑fri trafikmätning på aggregerad nivå.
          Inga personuppgifter samlas in och inga profiler skapas.
        </p>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-text">Vilka uppgifter hanteras?</h2>
          <p className="text-text/80">I denna beta-version lagras följande lokalt i din webbläsare:</p>
          <ul className="list-disc pl-5 text-text/80 space-y-1">
            <li>
              <span className="font-medium text-text">Onboarding-status</span> — nyckel: <code className="text-xs">mealwise-onboarding-seen</code> (boolean). Används för att komma ihåg om introduktionen har visats.
            </li>
          </ul>
          <p className="text-text/80 mt-2">
            Övriga uppgifter som veckoplan och val i gränssnittet hanteras i minnet under tiden du använder sidan
            och sparas inte permanent efter att sidan laddas om.
          </p>
        </section>
        <section className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold text-text">Webbanalys (Plausible)</h2>
          <p className="text-text/80">
            För att förstå hur appen används och kunna förbättra upplevelsen använder vi
            <span className="font-medium text-text"> Plausible Analytics</span> i produktion. Plausible är cookie‑fritt
            och arbetar med anonymiserad, aggregerad data.
          </p>
                     <p className="text-text/80">Exempel på information som behandlas:</p>
           <ul className="list-disc pl-5 text-text/80 space-y-1">
             <li>Sidvisningar och rutt (t.ex. <code className="text-xs">#/</code>, <code className="text-xs">#/feedback</code>)</li>
             <li>Hänvisningskälla (referrer)</li>
             <li>Typ av enhet, webbläsare och operativsystem</li>
             <li>Språk och ungefärlig plats på landsnivå</li>
             <li>Filnedladdningar (om du laddar ner recept eller planer)</li>
             <li>Externa länkar (när du klickar på länkar till andra webbplatser)</li>
             <li>Anpassade händelser (t.ex. när du lägger till recept i veckoplanen)</li>
           </ul>
                     <p className="text-text/80">
             Uppgifterna används endast i syfte att förbättra appen och mäta trafik på en övergripande nivå.
             Vi spårar inte enskilda användare och all data är anonymiserad och aggregerad.
             Rättslig grund: <span className="font-medium text-text">berättigat intresse</span> av att utvärdera och utveckla tjänsten.
             Har du frågor eller vill veta mer, kontakta oss.
           </p>
        </section>
        <section className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold text-text">Lagringsplats och varaktighet</h2>
          <p className="text-text/80">
            Uppgifterna lagras i din webbläsares <span className="font-medium text-text">localStorage</span> och finns kvar tills du rensar
            webbplatsdata via din webbläsare. Ingen information skickas till våra servrar i denna beta.
          </p>
        </section>
        <section className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold text-text">Kontakt</h2>
          <p className="text-text/80">
            För frågor kring integritet, kontakta oss på
            {" "}
            <a className="underline" href="mailto:2026felix@gmail.com?subject=Integritet%20-%20Mealwise%20Beta">2026felix@gmail.com</a>.
          </p>
        </section>
        <p className="text-text/60 text-sm mt-6">Senast uppdaterad: 2025-01-20</p>
      </article>
    </main>
  )
}

export default PrivacyPolicy


