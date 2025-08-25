import type { DayPlan } from '../types'
import { useRecipeContext } from '../context/RecipeContext'
import { safeDragDataParse } from '../utils/validation'
import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { ChevronDown, X, CookingPot, Plus } from 'lucide-react'
import RecipeDetailModal from './RecipeDetailModal'
import { Recipe } from '../types'
import { buttonStyles } from '../utils/commonStyles'

// Neutral färgkodning för receptkategorier
const getCategoryColor = (category?: string) => {
	switch (category) {
		case 'vegetables': return '#f3f4f6' // Ljusgrå
		case 'carbs': return '#f9fafb'      // Mycket ljusgrå
		case 'protein': return '#f3f4f6'    // Ljusgrå
		case 'dairy': return '#f9fafb'      // Mycket ljusgrå
		default: return 'transparent'
	}
}

interface DayCardProps {
	day: DayPlan
	isGlobalDragActive?: boolean
}

const DayCard: React.FC<DayCardProps> = memo(({ day, isGlobalDragActive = false }) => {
	const { dispatch } = useRecipeContext()
	const [isDragOver, setIsDragOver] = useState(false)
	const [dragCounter, setDragCounter] = useState(0)
	const [isMobile, setIsMobile] = useState(false)
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
	const [showRecipeDetails, setShowRecipeDetails] = useState(false)
	const dropZoneRef = useRef<HTMLDivElement>(null)

	// Detektera om användaren är på mobil
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		
		checkMobile()
		window.addEventListener('resize', checkMobile)
		
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.types.includes('application/json')) {
			setIsDragOver(true)
		}
	}, [])

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.types.includes('application/json')) {
			setDragCounter(prev => prev + 1)
			setIsDragOver(true)
		}
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setDragCounter(prev => prev - 1)
		if (dragCounter <= 1) {
			setIsDragOver(false)
		}
	}, [dragCounter])

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragOver(false)
		setDragCounter(0)
		
		// Säker parsing av drag data
		const recipe = safeDragDataParse(e.dataTransfer)
		if (!recipe) {
			console.warn('Invalid recipe data dropped')
			return
		}
		
		const sourceDay = e.dataTransfer.getData('source-day')
		const sourceInstanceId = e.dataTransfer.getData('source-instance-id')
		
		// Om receptet kommer från en annan dag, flytta det istället för att lägga till
		if (sourceDay && sourceDay !== day.day && sourceInstanceId) {
			// Vi skickar med den fullständiga måltidsinstansen i drag-datan
			const mealInstanceData = e.dataTransfer.getData('meal-instance')
			if (mealInstanceData) {
				try {
					const mealInstanceToMove = JSON.parse(mealInstanceData)
					dispatch({
						type: 'MOVE_RECIPE_BETWEEN_DAYS',
						fromDay: sourceDay,
						toDay: day.day,
						mealInstance: mealInstanceToMove
					})
				} catch (error) {
					console.warn('Failed to parse meal instance data:', error)
				}
			}
		} else {
			// Lägg till nytt recept från biblioteket
			dispatch({
				type: 'ADD_RECIPE_TO_DAY',
				day: day.day,
				recipe
			})
		}
	}, [day.day, dispatch])

	const removeRecipe = useCallback((instanceId: string) => {
		dispatch({
			type: 'REMOVE_RECIPE_FROM_DAY',
			day: day.day,
			instanceId
		})
	}, [day.day, dispatch])

	const handleShowRecipeDetails = useCallback((recipe: Recipe) => {
		setSelectedRecipe(recipe)
		setShowRecipeDetails(true)
	}, [])

	const handleCloseRecipeDetails = useCallback(() => {
		setShowRecipeDetails(false)
		setSelectedRecipe(null)
	}, [])

	// På mobil läggs recept till via receptlistan (RecipeLibrary); ingen dag-klick-funktion här
	const handleEmptyDayClick = useCallback(() => {
		if (!isMobile) return
		const el = document.getElementById('recipe-library')
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' })
			// Fokusera sökfältet efter en kort stund så användaren kan börja skriva direkt
			setTimeout(() => {
				const input = el.querySelector('input[type="text"]') as HTMLInputElement | null
				if (input) input.focus()
			}, 300)
		}
	}, [isMobile])

	return (
		<div className="bg-gray-50 rounded-xl p-2">
			{/* Dag-header */}
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xs sm:text-sm font-semibold text-gray-900">{day.day}</h3>
				{/* Lägg till recept sker via receptlistan på mobil */}
			</div>

			{/* Drop-zon med förbättrad feedback */}
			<div
				ref={dropZoneRef}
				className={`min-h-[48px] sm:min-h-[64px] rounded-lg border-2 border-dashed transition-colors duration-200 ${
					isDragOver
						? 'border-gray-600 bg-gray-100 scale-[1.02] shadow-lg'
						: isGlobalDragActive
						? 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
						: 'border-gray-200 bg-gray-25 hover:border-gray-300 hover:bg-gray-50'
				} ${day.recipes.length === 0 ? 'flex items-center cursor-pointer' : ''}`}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				title={isMobile ? 'Lägg till via receptlistan' : 'Dra hit recept'}
				aria-label={isMobile ? 'Lägg till via receptlistan' : 'Dra hit recept'}
				onClick={() => {
					if (day.recipes.length === 0) handleEmptyDayClick()
				}}
			>
				{day.recipes.length === 0 ? (
					// Tom dag - visa hjälptext
					<div className={`h-full w-full flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-colors duration-200 ${
						isDragOver ? 'text-gray-900' : 'text-gray-600'
					}`}>
						{isDragOver ? (
							<>
								<ChevronDown className="w-4 sm:w-6 h-4 sm:h-6 mb-1 text-gray-900" />
								<p className="text-xs sm:text-sm font-medium">Släpp receptet här!</p>
							</>
						) : (
							<>
								{isMobile ? (
									<>
										<Plus className="w-4 h-4 text-gray-400" aria-hidden="true" />
										<span className="sr-only">Lägg till via receptlistan</span>
									</>
								) : (
									<p className="text-xs text-gray-400">Dra hit recept</p>
								)}
							</>
						)}
					</div>
				) : (
					// Recept som redan finns - visa i grid-layout
					<div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-[48px] sm:auto-rows-[64px] gap-1 sm:gap-1.5 p-1 sm:p-1.5">
						{day.recipes.map((mealInstance) => {
							const categoryColor = getCategoryColor(mealInstance.recipe.category)
							return (
								<div
									key={mealInstance.instanceId}
									className="bg-white rounded-lg p-1.5 sm:p-2 h-full cursor-move relative group hover:bg-gray-50 transition-colors duration-200 border touch-manipulation"
									style={{
										borderColor: categoryColor !== 'transparent' ? categoryColor : undefined,
										borderWidth: categoryColor !== 'transparent' ? '2px' : '1px'
									}}
									draggable={!isMobile}
									onDragStart={(e) => {
										if (isMobile) return
										e.dataTransfer.setData('application/json', JSON.stringify(mealInstance.recipe))
										e.dataTransfer.setData('source-day', day.day)
										e.dataTransfer.setData('source-instance-id', mealInstance.instanceId)
										e.dataTransfer.setData('meal-instance', JSON.stringify(mealInstance))
										e.dataTransfer.effectAllowed = 'move'
									}}
								>
									{/* Recept-innehåll */}
									<div className="flex items-center justify-start h-full relative">
										{/* Recept-info (endast namn) */}
										<div className="flex-1 min-w-0 text-left">
											<h4 className="font-medium text-gray-900 text-sm leading-none truncate" title={mealInstance.recipe.name}>
												{mealInstance.recipe.name}
											</h4>
										</div>
										
										{/* Knappar bredvid varandra i hörnet */}
										<div className="absolute -top-1.5 sm:top-1/2 sm:-translate-y-1/2 -right-1.5 flex items-center gap-1">
											{/* Visa detaljer knapp */}
											<button
												onClick={() => handleShowRecipeDetails(mealInstance.recipe)}
												className={buttonStyles.iconTransparentSmall}
												title="Visa receptdetaljer"
											>
												<CookingPot className="w-4 sm:w-4 h-4 sm:h-4 text-gray-600" />
											</button>
											
											{/* Ta bort-knapp */}
											<button
												onClick={() => removeRecipe(mealInstance.instanceId)}
												className={buttonStyles.iconTransparentSmall}
												title="Ta bort recept"
											>
												<X className="w-4 sm:w-4 h-4 sm:h-4 text-gray-600" />
											</button>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>

			{/* Ingen mobil receptväljare här; använd RecipeLibrary för att välja dag */}

			{/* Receptdetaljer modal */}
			{selectedRecipe && (
				<RecipeDetailModal
					recipe={selectedRecipe}
					isOpen={showRecipeDetails}
					onClose={handleCloseRecipeDetails}
				/>
			)}
		</div>
	)
})

DayCard.displayName = 'DayCard'

export default DayCard
