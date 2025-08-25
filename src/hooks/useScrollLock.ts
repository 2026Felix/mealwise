import { useEffect } from 'react'

/**
 * Hook för att låsa scroll på body när modaler är öppna
 * @param isLocked - Om scroll ska vara låst
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Spara ursprunglig scroll-position
      const scrollY = window.scrollY
      
      // Lås scroll på body
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        // Återställ scroll när komponenten unmountas
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        
        // Återställ scroll-position
        window.scrollTo(0, scrollY)
      }
    }
  }, [isLocked])
}
