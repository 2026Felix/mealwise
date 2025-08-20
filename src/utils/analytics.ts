/*
  Enhanced Plausible integration for SPA (hash-based routing)
  - Uses the enhanced Plausible script with file downloads, outbound links, and custom events
  - Sends initial pageview and on hash-based route changes
  - Supports custom events with properties
*/

type PlausibleEventOptions = {
  props?: Record<string, string | number | boolean | null>
  u?: string
  callback?: () => void
  transport?: 'img' | 'beacon' | 'xhr'
}

type PlausibleFunction = (eventName: 'pageview' | string, options?: PlausibleEventOptions) => void

type QueuedCall = Parameters<PlausibleFunction>

declare global {
  interface Window {
    plausible?: PlausibleFunction & { q?: QueuedCall[] }
  }
}

const PLAUSIBLE_DOMAIN: string | undefined = import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'mealwise-ivory.vercel.app'
const IS_PRODUCTION = import.meta.env.PROD
const ANALYTICS_ENABLED = Boolean(PLAUSIBLE_DOMAIN) && IS_PRODUCTION

function ensureQueueShim(): void {
  if (window.plausible) return
  const shim: PlausibleFunction & { q?: QueuedCall[] } = ((...args: QueuedCall) => {
    if (!shim.q) shim.q = []
    shim.q.push(args)
  }) as PlausibleFunction & { q?: QueuedCall[] }
  window.plausible = shim
}

// Script is now loaded directly in HTML, no need to inject

function sendPageview(url?: string): void {
  if (!window.plausible) return
  window.plausible('pageview', url ? { u: url } : undefined)
}

export function initAnalytics(): void {
  if (!ANALYTICS_ENABLED) return

  ensureQueueShim()

  // Initial pageview (script is already loaded)
  sendPageview(location.href)

  // Track SPA navigations (hash-based)
  window.addEventListener('hashchange', () => {
    sendPageview(location.href)
  })
}

export function trackEvent(eventName: string, props?: Record<string, string | number | boolean | null>): void {
  if (!ANALYTICS_ENABLED || !window.plausible) return
  if (props) {
    window.plausible(eventName, { props })
  } else {
    window.plausible(eventName)
  }
}

// Convenience functions for common events
export function trackRecipeView(recipeId: string, recipeName: string): void {
  trackEvent('recipe_view', { recipe_id: recipeId, recipe_name: recipeName })
}

export function trackRecipeAdd(recipeId: string, recipeName: string, dayOfWeek?: string): void {
  trackEvent('recipe_add', { 
    recipe_id: recipeId, 
    recipe_name: recipeName,
    day_of_week: dayOfWeek || 'unknown'
  })
}

export function trackSearch(query: string, resultsCount: number): void {
  trackEvent('recipe_search', { 
    query: query.toLowerCase(), 
    results_count: resultsCount 
  })
}

export function trackFeatureUsage(feature: string): void {
  trackEvent('feature_usage', { feature })
}


