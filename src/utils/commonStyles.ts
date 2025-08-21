// Centraliserade stilar för Mealwise
// Eliminerar duplicerade CSS-klasser och förbättrar underhållbarhet

export const textColors = {
  primary: 'text-text',
  secondary: 'text-text/80',
  muted: 'text-text/70',
  subtle: 'text-text/60',
  verySubtle: 'text-text/40'
} as const

export const commonClasses = {
  button: {
    primary: 'bg-text text-background px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-text/90 transition-colors duration-200',
    secondary: 'px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-text text-xs sm:text-sm rounded-lg border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200',
    link: 'text-text hover:text-text/80 transition-colors duration-200 font-medium',
    touch: 'w-full mt-4 p-3 bg-text/10 hover:bg-text/20 text-text rounded-lg transition-colors duration-200 touch-target'
  },
  filter: {
    container: 'flex flex-wrap gap-2 sm:gap-3 mb-4',
    button: {
      base: 'px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200',
      active: 'bg-orange-500 text-white',
      inactive: 'bg-white text-text border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
    }
  },
  card: 'bg-white border border-text/10 rounded-lg p-4',
  input: 'w-full px-3 py-2 bg-background border border-text/20 rounded-lg text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-text/30 focus:border-transparent text-sm transition-colors duration-200',
  container: 'w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto',
  loading: {
    spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-text mx-auto mb-4',
    container: 'min-h-screen flex items-center justify-center',
    text: 'text-text/60'
  }
} as const

export const responsiveText = {
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-2xl sm:text-3xl md:text-4xl',
  h3: 'text-xl sm:text-2xl',
  h4: 'text-lg sm:text-xl',
  body: 'text-base sm:text-lg md:text-xl',
  small: 'text-xs sm:text-sm'
} as const

export const spacing = {
  section: 'mt-8 sm:mt-12 md:mt-16',
  content: 'p-3 sm:p-4 md:p-6',
  gap: 'gap-4 sm:gap-6 md:gap-8'
} as const