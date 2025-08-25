// Centraliserade stilar för Mealwise
// Eliminerar duplicerade CSS-klasser och förbättrar underhållbarhet

export const textColors = {
  primary: 'text-gray-900',
  secondary: 'text-gray-800',
  muted: 'text-gray-700',
  subtle: 'text-gray-600',
  verySubtle: 'text-gray-400'
} as const

export const commonClasses = {
  button: {
    primary: 'bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-800 transition-colors duration-200',
    secondary: 'px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-900 text-xs sm:text-sm rounded-lg border border-gray-200 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200',
    link: 'text-gray-900 hover:text-gray-800 transition-colors duration-200 font-medium',
    touch: 'w-full mt-4 p-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors duration-200 touch-target'
  },
  filter: {
    container: 'flex flex-wrap gap-2 sm:gap-3 mb-4',
    button: {
      base: 'px-3 py-1.5 rounded-lg font-medium text-xs transition-colors duration-200',
      active: 'bg-gray-600 text-white',
      inactive: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
    }
  },
  card: 'bg-white border border-gray-200 rounded-lg p-4',
  input: 'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-sm transition-colors duration-200',
  container: 'w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto',
  loading: {
    spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4',
    container: 'min-h-screen flex items-center justify-center',
    text: 'text-gray-600'
  }
} as const

export const buttonStyles = {
  // Neutral knappstil med gråskala
  gradient: 'w-full bg-gray-900 h-12 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-gray-600 before:to-gray-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white font-medium',
  
  // Kompakt version för mindre knappar
  gradientCompact: 'px-6 py-3 bg-gray-900 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-gray-600 before:to-gray-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white font-medium',
  
  // Liten version för mindre knappar
  gradientSmall: 'px-4 py-2 bg-gray-900 flex items-center justify-center rounded-lg cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-gray-600 before:to-gray-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-lg hover:before:left-0 text-white font-medium',

  // Ikon-knappar med bakgrund
  icon: 'p-1.5 sm:p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors touch-target flex items-center justify-center',
  iconSmall: 'p-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors touch-target flex items-center justify-center',
  iconClose: 'p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100',

  // Ikon-knappar utan bakgrund (transparenta)
  iconTransparent: 'p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors touch-target flex items-center justify-center',
  iconTransparentSmall: 'p-1 text-gray-600 hover:text-gray-900 transition-colors touch-target flex items-center justify-center',
  iconTransparentClose: 'p-2 text-gray-400 hover:text-gray-600 transition-colors',

  // Tab-knappar
  tab: 'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
  tabActive: 'bg-white text-gray-900 shadow-sm border border-gray-200',
  tabInactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',

  // Filter-knappar (befintliga)
  filter: 'px-3 py-1.5 rounded-lg font-medium text-xs transition-colors duration-200',
  filterActive: 'bg-gray-600 text-white',
  filterInactive: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',

  // Filter-knappar med ingrediens-tagg stil (aktiva nu fyllda)
  filterTag: 'px-4 py-2 bg-white text-gray-900 text-xs font-medium rounded-full border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50',
  filterTagActive: 'px-4 py-2 bg-gray-100 text-gray-900 text-xs font-medium rounded-full border-1 border-gray-400 shadow-md transition-colors duration-200',

  // Åtgärdsknappar
  action: 'px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200',
  actionPrimary: 'px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200',
  actionSecondary: 'px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200',

  // Toggle-knappar
  toggle: 'relative inline-flex h-6 w-12 min-w-[48px] min-h-[24px] items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  toggleActive: 'bg-gray-600',
  toggleInactive: 'bg-gray-300',

  // Checkbox-knappar
  checkbox: 'w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-colors',
  checkboxActive: 'bg-gray-600 border-gray-600',
  checkboxInactive: 'border-gray-300',

  // Navigation-knappar
  nav: 'px-2 py-2 rounded-lg text-gray-900 hover:text-gray-700 transition-colors',
  navMobile: 'block px-2 py-2 rounded-lg text-gray-900 hover:text-gray-700 transition-colors',

  // Collapse-knappar
  collapse: 'p-1.5 sm:p-2 hover:bg-white rounded-lg transition-colors duration-200 group',

  // Dropdown-knappar
  dropdown: 'inline-flex items-center justify-center p-2 rounded-lg text-gray-900 hover:text-gray-700 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',

  // Form-knappar
  form: 'w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  formSecondary: 'w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
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