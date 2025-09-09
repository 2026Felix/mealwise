import { commonClasses, responsiveText, textColors, spacing } from '../utils/uiStyles'

const Feedback: React.FC = () => {
  return (
    <div className={`${commonClasses.container} ${spacing.content} ${spacing.section}`}>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className={`${responsiveText.h2} font-semibold ${textColors.primary} mb-3`}>
          Vi välkomnar din feedback
        </h1>
        <p className={`${responsiveText.body} ${textColors.muted} mb-4`}>
          Din åsikt är värdefull och hjälper oss förbättra Mealwise. Buggar och problem är också välkomna att rapportera. Hör gärna av dig via e‑post eller genom en kommentar på våra sociala medier.
        </p>
        <a href="mailto:2026Felix@gmail.com" className={commonClasses.button.link}>
          Skicka e‑post till 2026Felix@gmail.com
        </a>
      </div>
    </div>
  )
}

export default Feedback


