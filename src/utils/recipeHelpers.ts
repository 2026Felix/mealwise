// Gemensamma utility-funktioner för recept

/**
 * Returnerar färgkod för receptkategorier
 * @param category - Kategorin för receptet
 * @returns Hex-färgkod eller 'transparent'
 */
export const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'vegetables': return '#f3f4f6' // Ljusgrå
    case 'carbs': return '#f9fafb'      // Mycket ljusgrå
    case 'protein': return '#f3f4f6'    // Ljusgrå
    case 'dairy': return '#f9fafb'      // Mycket ljusgrå
    default: return 'transparent'
  }
}

/**
 * Rankar recept baserat på överlapp mot en uppsättning valda ingredienser.
 * Returnerar samma receptobjekt utökat med matchCount, matchPercentage och matchingIngredients.
 */
export const rankRecipesByIngredientOverlap = (
  recipes: Array<any>,
  selectedIngredients: Set<string>
) => {
  if (!recipes || recipes.length === 0 || selectedIngredients.size === 0) return [] as Array<any>

  return recipes
    .map(recipe => {
      const recipeIngredients = recipe.ingredients.map((ing: any) => ing.name.toLowerCase())
      const matches = recipeIngredients.filter((ing: string) => selectedIngredients.has(ing))
      const matchPercentage = (matches.length / recipeIngredients.length) * 100
      return {
        ...recipe,
        matchCount: matches.length,
        matchPercentage,
        matchingIngredients: matches
      }
    })
    .filter(recipe => recipe.matchCount > 0)
    .sort((a, b) => {
      if (Math.abs(a.matchPercentage - b.matchPercentage) > 5) {
        return b.matchPercentage - a.matchPercentage
      }
      return a.ingredients.length - b.ingredients.length
    })
}

/**
 * Normaliserar en lista av fria taggar till en fast uppsättning tillåtna taggar.
 * Endast följande returneras: "Vegetarisk", "Vegansk", "Snabb", "Vardagsmiddag", "Fest".
 */
export const normalizeRecipeTags = (tags?: string[]) => {
  if (!tags || tags.length === 0) return [] as string[]

  const allowedMap: Record<string, string> = {
    // Vegetarisk
    'vegetarisk': 'Vegetarisk',
    'vegetarian': 'Vegetarisk',
    'veg': 'Vegetarisk',
    // Vegansk
    'vegansk': 'Vegansk',
    'vegan': 'Vegansk',
    // Snabb
    'snabb': 'Snabb',
    'quick': 'Snabb',
    'snabbt': 'Snabb',
    // Vardagsmiddag
    'vardag': 'Vardagsmiddag',
    'vardagsmiddag': 'Vardagsmiddag',
    'weeknight': 'Vardagsmiddag',
    // Fest
    'fest': 'Fest',
    'bjudmat': 'Fest',
    'party': 'Fest'
  }

  const resultSet = new Set<string>()
  for (const raw of tags) {
    const key = String(raw).trim().toLowerCase()
    const mapped = allowedMap[key]
    if (mapped) resultSet.add(mapped)
  }

  // Bevara en konsekvent ordning
  const order = ['Vegetarisk', 'Vegansk', 'Snabb', 'Vardagsmiddag', 'Fest']
  return order.filter(t => resultSet.has(t))
}

/**
 * Returnerar true om receptet passerar de aktiva filtren.
 * Not: Filtren härleds enkelt från kategori/tider/taggar för stabilitet.
 */
export const passesRecipeFilters = (
  recipe: { category?: string; prepTime: number; ingredients: Array<{name: string}>; tags?: string[] },
  activeFilters: Set<'vegetarisk' | 'vegansk' | 'snabb' | 'vardagsmiddag' | 'fest'>
) => {
  if (activeFilters.size === 0) return true

  if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false
  if (activeFilters.has('vegansk') && recipe.category === 'dairy') return false
  if (activeFilters.has('snabb') && recipe.prepTime > 30) return false
  if (activeFilters.has('vardagsmiddag') && !(recipe.ingredients.length <= 4 || recipe.prepTime <= 30)) return false
  if (activeFilters.has('fest') && !(recipe.ingredients.length > 6 || recipe.prepTime > 45)) return false

  return true
}