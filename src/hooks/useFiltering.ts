import { useState } from 'react'

// Centrala filter baserade på tillåtna taggar
// Exakt fem: Vegetarisk, Vegansk, Snabb, Vardagsmiddag, Fest
export type FilterType = 'vegetarisk' | 'vegansk' | 'snabb' | 'vardagsmiddag' | 'fest'

export const useRecipeFilters = () => {
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set())

  // Toggle filter
  const toggleFilter = (filter: FilterType) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(filter)) {
      newFilters.delete(filter)
    } else {
      newFilters.add(filter)
    }
    setActiveFilters(newFilters)
  }

  // Rensa filter
  const clearFilters = () => {
    setActiveFilters(new Set())
  }

  // Filter-knappar konfiguration (matchar tillåtna taggar)
  const filterButtons: Array<{ key: FilterType; label: string; description: string }> = [
    { key: 'vegetarisk', label: 'VEGETARISK', description: 'Inget kött eller fisk' },
    { key: 'vegansk', label: 'VEGANSK', description: 'Helt växtbaserat' },
    { key: 'snabb', label: 'SNABB', description: 'Snabb vardagsmat' },
    { key: 'vardagsmiddag', label: 'VARDAGSMIDDAG', description: 'Passar vardagen' },
    { key: 'fest', label: 'FEST', description: 'Lite extra tillfälle' }
  ]

  return {
    activeFilters,
    toggleFilter,
    clearFilters,
    filterButtons,
    hasActiveFilters: activeFilters.size > 0
  }
}
