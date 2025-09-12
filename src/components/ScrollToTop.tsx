import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ScrollToTop komponent - hanterar automatisk scrollning vid ruttbyte
// Scrollar till toppen av sidan eller till specifikt element baserat på hash
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Om en hash finns, försök scrolla till elementet; annars scrolla till toppen
    if (hash) {
      // Vänta en tick så att DOM för nya routen finns
      requestAnimationFrame(() => {
        const targetId = hash.startsWith('#') ? hash.slice(1) : hash
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' })
        } else {
          // Fallback till toppen om elementet inte hittas
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      })
    } else {
      // Inga hash - scrolla till toppen av sidan
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [pathname, hash])

  // Komponenten renderar inget visuellt
  return null
}

export default ScrollToTop


