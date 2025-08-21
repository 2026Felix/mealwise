import { useRecipeContext } from '../context/RecipeContext'
import RecipeCard from './RecipeCard'
import { useState, useMemo } from 'react'
import { Brain, ChevronDown, ChevronUp } from 'lucide-react'
import { FilterType } from '../hooks/useRecipeFilters'

interface SmartRecommendationsProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  activeFilters,
}) => {
	const { state, dispatch } = useRecipeContext()
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
	const [showDaySelector, setShowDaySelector] = useState(false)

	// Använd de smarta rekommendationerna från RecipeContext
	const suggestions = state.suggestions

	// Beräkna gemensamma ingredienser för varje förslag och sortera
	const suggestionsWithOverlap = useMemo(() => {
		const plannedRecipes = state.weekPlan.flatMap(day => day.recipes.map(mi => mi.recipe))
		
		const suggestionsWithCount = suggestions.map(recipe => {
			let commonIngredientsCount = 0
			const commonIngredientNames: string[] = []
			
			// Räkna gemensamma ingredienser med alla planerade måltider
			plannedRecipes.forEach(plannedRecipe => {
				const recipeIngredients = new Set(recipe.ingredients.map(i => i.name.toLowerCase().trim()))
				const plannedIngredients = new Set(plannedRecipe.ingredients.map(i => i.name.toLowerCase().trim()))
				
				// Hitta gemensamma ingredienser med mjukare matchning
				plannedIngredients.forEach(plannedIngredient => {
					recipeIngredients.forEach(recipeIngredient => {
						if (plannedIngredient.includes(recipeIngredient) || recipeIngredient.includes(plannedIngredient)) {
							if (!commonIngredientNames.includes(plannedIngredient)) {
								commonIngredientNames.push(plannedIngredient)
								commonIngredientsCount++
							}
						}
					})
				})
			})
			
			return {
				recipe,
				commonIngredientsCount,
				commonIngredientNames
			}
		})
		
		// Sortera efter antal gemensamma ingredienser (högst först)
		return suggestionsWithCount.sort((a, b) => b.commonIngredientsCount - a.commonIngredientsCount)
	}, [suggestions, state.weekPlan])

	// Filtrera rekommendationer baserat på aktiva filter
	const filteredSuggestions = useMemo(() => {
		if (activeFilters.size === 0) return suggestionsWithOverlap

		return suggestionsWithOverlap.filter(({ recipe }) => {
			// BILLIG - recept med färre ingredienser eller kortare tillagningstid
			if (activeFilters.has('billig') && !(
				recipe.ingredients.length <= 4 || recipe.prepTime <= 30
			)) return false

			// ENKEL - recept med låg svårighetsgrad
			if (activeFilters.has('enkel') && recipe.difficulty !== 'easy') return false

			// SNABB - recept med kort tillagningstid
			if (activeFilters.has('snabb') && recipe.prepTime > 30) return false

			// VEGETARISK - recept utan kött/fisk
			if (activeFilters.has('vegetarisk') && recipe.category === 'protein') return false

			return true
		})
	}, [suggestionsWithOverlap, activeFilters])

	return (
		<div className="bg-component rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
			{/* Header med titel och collapse-knapp */}
			<div className={`flex items-center justify-between ${isCollapsed ? 'mb-0' : 'mb-3'}`}> 
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-text/20 rounded-full flex items-center justify-center">
						<Brain className="w-4 h-4 sm:w-5 sm:h-5 text-text" />
					</div>
					<div>
						<h2 className="text-lg sm:text-xl font-semibold text-text">
							Rekommendationer
						</h2>
						<p className="text-xs sm:text-sm text-text/60">
							Baserat på dina planerade måltider
						</p>
					</div>
				</div>
				
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-1.5 sm:p-2 hover:bg-background rounded-lg transition-colors duration-200 group"
					title={isCollapsed ? "Expandera" : "Vik ihop"}
				>
					{isCollapsed ? (
						<ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-text/60 group-hover:text-text transition-colors duration-200" />
					) : (
						<ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-text/60 group-hover:text-text transition-colors duration-200" />
					)}
				</button>
			</div>
			
			{!isCollapsed && (
				<>
					{filteredSuggestions.length === 0 ? (
						<div className="text-center py-6 sm:py-8">
							<Brain className="w-12 h-12 sm:w-16 sm:h-16 text-text/20 mx-auto mb-3 sm:mb-4" />
							<p className="text-text/60 text-xs sm:text-sm px-2">
								{activeFilters.size > 0 
									? 'Inga rekommendationer matchar de valda filtren. Prova att ändra filter eller lägg till fler recept i din veckoplan.'
									: 'Lägg till recept i din veckoplan för att få smarta förslag baserat på gemensamma ingredienser.'
								}
							</p>
						</div>
					) : (
						<div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
							{filteredSuggestions.map(({ recipe, commonIngredientsCount, commonIngredientNames }) => (
								<RecipeCard 
									key={recipe.id} 
									recipe={recipe}
									showOverlap={true}
									overlapCount={commonIngredientsCount}
									overlapIngredients={commonIngredientNames}
									onAddToDay={() => {
										setSelectedRecipeId(recipe.id)
										setShowDaySelector(true)
									}}
								/>
							))}
						</div>
					)}
				</>
			)}

			{/* Dag-väljare för rekommendationer */}
				{showDaySelector && selectedRecipeId && (
					<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
						<div className="bg-component rounded-xl p-4 max-w-sm w-full">
						<h3 className="text-lg font-semibold text-text mb-4">Välj dag</h3>
						<div className="space-y-2">
							{state.weekPlan.map((day) => (
								<button
									key={day.day}
									onClick={() => {
										const recipe = state.recipeLibrary.find(r => r.id === selectedRecipeId)
										if (recipe) {
											dispatch({ type: 'ADD_RECIPE_TO_DAY', day: day.day, recipe })
										}
										setSelectedRecipeId(null)
										setShowDaySelector(false)
									}}
									className="w-full text-left p-3 bg-component hover:bg-text/10 rounded-lg transition-colors touch-target"
								>
									<span className="font-medium text-text">{day.day}</span>
									<span className="text-sm text-text/60 ml-2">({day.recipes.length} recept)</span>
								</button>
							))}
						</div>
						<button
							onClick={() => {
							setSelectedRecipeId(null)
							setShowDaySelector(false)
						}}
						className="w-full mt-4 p-3 bg-text/10 hover:bg-text/20 text-text rounded-lg transition-colors touch-target"
						>
							Avbryt
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default SmartRecommendations
