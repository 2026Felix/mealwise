import { useState } from 'react'
import { commonClasses, responsiveText, textColors, spacing } from '../utils/uiStyles'

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms')

  return (
    <div className={`${commonClasses.container} ${spacing.content} ${spacing.section}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`${responsiveText.h1} font-bold ${textColors.primary} mb-4`}>
            Juridisk information
          </h1>
          <p className={`${responsiveText.body} ${textColors.muted}`}>
            Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'terms'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Användarvillkor
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Integritetspolicy
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'terms' ? (
          /* Terms of Use Content */
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                1. Allmänt
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Dessa användarvillkor reglerar användningen av Mealwise-tjänsten ("Tjänsten") som tillhandahålls av Mealwise ("Vi", "Vårt", "Oss"). Genom att använda Tjänsten godkänner du dessa villkor.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                2. Tjänstebeskrivning
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Mealwise är en webbaserad tjänst som hjälper användare att planera måltider, hitta recept och hantera inköpslistor. Tjänsten innehåller recept, matplaneringsverktyg och relaterad information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                3. Användarregistrering
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                För att använda vissa funktioner i Tjänsten kan du behöva skapa ett konto. Du ansvarar för att hålla dina inloggningsuppgifter säkra och för all aktivitet som sker under ditt konto.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                4. Användning av Tjänsten
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Du får använda Tjänsten endast i syfte att planera måltider och hitta recept. Du får inte:
              </p>
              <ul className={`${responsiveText.body} ${textColors.muted} list-disc pl-6 space-y-2`}>
                <li>Använda Tjänsten på ett sätt som bryter mot lagar eller regler</li>
                <li>Försöka hacka eller störa Tjänsten</li>
                <li>Kopiera eller distribuera innehåll utan tillstånd</li>
                <li>Använda Tjänsten för kommersiella ändamål utan tillstånd</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                5. Innehåll och Recept
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Recept och innehåll i Tjänsten tillhandahålls "i befintligt skick". Vi garanterar inte att recepten är säkra, exakta eller lämpliga för alla användare. Använd ditt eget omdöme när du följer recept.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                6. Användargenererat Innehåll
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Om du bidrar med innehåll till Tjänsten (t.ex. kommentarer eller feedback) ger du oss rätt att använda, modifiera och distribuera detta innehåll. Du ansvarar för att ditt innehåll inte bryter mot upphovsrätt eller andra rättigheter.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                7. Integritet
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Din integritet är viktig för oss. Se vår Integritetspolicy för information om hur vi samlar in, använder och skyddar din personliga information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                8. Ansvarsfriskrivning
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Tjänsten tillhandahålls "i befintligt skick" utan garantier. Vi ansvarar inte för skador eller förluster som kan uppstå från användningen av Tjänsten, inklusive men inte begränsat till matrelaterade skador eller allergiska reaktioner.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                9. Ändringar av Villkoren
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Vi förbehåller oss rätten att ändra dessa villkor när som helst. Vid väsentliga ändringar kommer vi att meddela dig via e-post eller genom att visa ett meddelande i Tjänsten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                10. Uppsägning
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Vi kan avsluta eller begränsa din tillgång till Tjänsten om du bryter mot dessa villkor. Du kan också avsluta ditt konto när som helst genom att kontakta oss.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                11. Tillämplig Lag
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Dessa villkor regleras av svensk lag. Eventuella tvister ska avgöras av svenska domstolar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                12. Kontakt
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Om du har frågor om dessa användarvillkor, kontakta oss på:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">
                  <strong>E-post:</strong> legal@mealwise.se<br />
                  <strong>Adress:</strong> Mealwise AB, Stockholm, Sverige
                </p>
              </div>
            </section>

            {/* Varning */}
            <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-3">Viktigt att komma ihåg</h3>
              <p className="text-sm text-yellow-800">
                Dessa användarvillkor utgör ett bindande avtal mellan dig och Mealwise. Genom att använda Tjänsten godkänner du att du har läst, förstått och accepterat alla villkor. Om du inte håller med om någon del av villkoren, avstå från att använda Tjänsten.
              </p>
            </div>
          </div>
        ) : (
          /* Privacy Policy Content */
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                Vilka uppgifter hanteras?
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                I denna beta-version lagras följande lokalt i din webbläsare:
              </p>
              <ul className={`${responsiveText.body} ${textColors.muted} list-disc pl-6 space-y-2`}>
                <li>
                  <span className="font-medium text-gray-900">Onboarding-status</span> — nyckel: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">mealwise-onboarding-seen</code> (boolean). Används för att komma ihåg om introduktionen har visats.
                </li>
              </ul>
              <p className={`${responsiveText.body} ${textColors.muted} mt-4`}>
                Övriga uppgifter som veckoplan och val i gränssnittet hanteras i minnet under tiden du använder sidan
                och sparas inte permanent efter att sidan laddas om.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                Webbanalys (Plausible)
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                För att förstå hur appen används och kunna förbättra upplevelsen använder vi
                <span className="font-medium text-gray-900"> Plausible Analytics</span> i produktion. Plausible är cookie‑fritt
                och arbetar med anonymiserad, aggregerad data.
              </p>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>Exempel på information som behandlas:</p>
              <ul className={`${responsiveText.body} ${textColors.muted} list-disc pl-6 space-y-2`}>
                <li>Sidvisningar och rutt (t.ex. <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">/feedback</code>)</li>
                <li>Hänvisningskälla (referrer)</li>
                <li>Typ av enhet, webbläsare och operativsystem</li>
                <li>Språk och ungefärlig plats på landsnivå</li>
                <li>Filnedladdningar (om du laddar ner recept eller planer)</li>
                <li>Externa länkar (när du klickar på länkar till andra webbplatser)</li>
                <li>Anpassade händelser (t.ex. när du lägger till recept i veckoplanen)</li>
              </ul>
              <p className={`${responsiveText.body} ${textColors.muted} mt-4`}>
                Uppgifterna används endast i syfte att förbättra appen och mäta trafik på en övergripande nivå.
                Vi spårar inte enskilda användare och all data är anonymiserad och aggregerad.
                Rättslig grund: <span className="font-medium text-gray-900">berättigat intresse</span> av att utvärdera och utveckla tjänsten.
                Har du frågor eller vill veta mer, kontakta oss.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                Lagringsplats och varaktighet
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                Uppgifterna lagras i din webbläsares <span className="font-medium text-gray-900">localStorage</span> och finns kvar tills du rensar
                webbplatsdata via din webbläsare. Ingen information skickas till våra servrar i denna beta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-4`}>
                Kontakt
              </h2>
              <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
                För frågor kring integritet, kontakta oss på
                {" "}
                <a className="underline text-blue-600 hover:text-blue-800" href="mailto:2026felix@gmail.com?subject=Integritet%20-%20Mealwise%20Beta">2026felix@gmail.com</a>.
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Senast uppdaterad:</strong> 2025-01-20
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Legal
