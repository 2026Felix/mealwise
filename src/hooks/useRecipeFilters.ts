import { useState } from 'react'

// Filter-typer
export type FilterType = 'billig' | 'enkel' | 'snabb' | 'vegetarisk'

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

  // Rensa alla filter
  const clearFilters = () => {
    setActiveFilters(new Set())
  }

  // Filter-knappar konfiguration
  const filterButtons: Array<{ key: FilterType; label: string; description: string }> = [
    { key: 'billig', label: 'BILLIG', description: 'Få ingredienser, snabbt' },
    { key: 'enkel', label: 'ENKEL', description: 'Lätt att tillaga' },
    { key: 'snabb', label: 'SNABB', description: 'Under 30 min' },
    { key: 'vegetarisk', label: 'VEGETARISK', description: 'Inget kött eller fisk' }
  ]

  return {
    activeFilters,
    toggleFilter,
    clearFilters,
    filterButtons,
    hasActiveFilters: activeFilters.size > 0
  }
}
