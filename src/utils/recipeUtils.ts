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