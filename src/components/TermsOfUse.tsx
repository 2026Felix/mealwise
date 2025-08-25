import { commonClasses, responsiveText, textColors, spacing } from '../utils/commonStyles'

const TermsOfUse: React.FC = () => {
  return (
    <div className={`${commonClasses.container} ${spacing.content} ${spacing.section}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`${responsiveText.h1} font-bold ${textColors.primary} mb-4`}>
            Användarvillkor
          </h1>
          <p className={`${responsiveText.body} ${textColors.muted}`}>
            Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>

        {/* Innehåll */}
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
        </div>

        {/* Varning */}
        <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-3">Viktigt att komma ihåg</h3>
          <p className="text-sm text-yellow-800">
            Dessa användarvillkor utgör ett bindande avtal mellan dig och Mealwise. Genom att använda Tjänsten godkänner du att du har läst, förstått och accepterat alla villkor. Om du inte håller med om någon del av villkoren, avstå från att använda Tjänsten.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfUse


