import type { DayPlan } from '../types'
import { useRecipeContext } from '../context/RecipeContext'
import { safeDragDataParse } from '../utils/validation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Eye } from 'lucide-react'
import RecipeDetailModal from './RecipeDetailModal'
import { Recipe } from '../types'

// Färgkodning för receptkategorier
const getCategoryColor = (category?: string) => {
	switch (category) {
		case 'vegetables': return '#D6E8DA' // Ljusgrön
		case 'carbs': return '#FEF0C1'      // Ljusgul
		case 'protein': return '#F8D1D1'    // Ljusrosa (bytt plats)
		case 'dairy': return '#A7C7E7'      // Ljusblå (bytt plats)
		default: return 'transparent'
	}
}

interface DayCardProps {
	day: DayPlan
	isGlobalDragActive?: boolean
}

const DayCard: React.FC<DayCardProps> = ({ day, isGlobalDragActive = false }) => {
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

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.types.includes('application/json')) {
			setIsDragOver(true)
		}
	}

	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer.types.includes('application/json')) {
			setDragCounter(prev => prev + 1)
			setIsDragOver(true)
		}
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setDragCounter(prev => prev - 1)
		if (dragCounter <= 1) {
			setIsDragOver(false)
		}
	}

	const handleDrop = (e: React.DragEvent) => {
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
	}

	const removeRecipe = (instanceId: string) => {
		dispatch({
			type: 'REMOVE_RECIPE_FROM_DAY',
			day: day.day,
			instanceId
		})
	}

	const handleShowRecipeDetails = (recipe: Recipe) => {
		setSelectedRecipe(recipe)
		setShowRecipeDetails(true)
	}

	const handleCloseRecipeDetails = () => {
		setShowRecipeDetails(false)
		setSelectedRecipe(null)
	}

	// På mobil läggs recept till via receptlistan (RecipeLibrary); ingen dag-klick-funktion här

	return (
		<div className="bg-component rounded-xl p-2">
			{/* Dag-header */}
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-xs sm:text-sm font-semibold text-text">{day.day}</h3>
				{/* Lägg till recept sker via receptlistan på mobil */}
			</div>

			{/* Drop-zon med förbättrad feedback */}
			<div
				ref={dropZoneRef}
				className={`min-h-[48px] sm:min-h-[64px] rounded-lg border-2 border-dashed transition-colors duration-200 ${
					isDragOver
						? 'border-text bg-text/10 scale-[1.02] shadow-lg'
						: isGlobalDragActive
						? 'border-text/30 bg-text/5 hover:border-text/40 hover:bg-text/8'
						: 'border-text/20 bg-text/3 hover:border-text/30 hover:bg-text/5'
				} ${day.recipes.length === 0 ? 'flex items-center' : ''}`}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{day.recipes.length === 0 ? (
					// Tom dag - visa hjälptext
					<div className={`h-full w-full flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-colors duration-200 ${
						isDragOver ? 'text-text' : 'text-text/60'
					}`}>
						{isDragOver ? (
							<>
								<ChevronDown className="w-4 sm:w-6 h-4 sm:h-6 mb-1 text-text" />
								<p className="text-xs sm:text-sm font-medium">Släpp receptet här!</p>
							</>
						) : (
							<>
								<p className="text-xs text-gray-400">
									{isMobile ? 'Lägg till via receptlistan' : 'Dra hit recept'}
								</p>
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
									className="bg-background rounded-lg p-1.5 sm:p-2 h-full cursor-move relative group hover:bg-background/80 transition-colors duration-200 border touch-manipulation"
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
									{/* Ta bort-knapp */}
									<button
										onClick={() => removeRecipe(mealInstance.instanceId)}
										className="absolute -top-0.5 -right-0.5 w-4 sm:w-5 h-4 sm:h-5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-colors duration-200 flex items-center justify-center touch-target"
										title="Ta bort recept"
									>
										<X className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
									</button>

									{/* Recept-innehåll */}
									<div className="flex items-center justify-center h-full">
										{/* Recept-info (endast namn) */}
										<div className="flex-1 min-w-0 text-center">
											<h4 className="font-medium text-text text-xs sm:text-sm leading-none truncate" title={mealInstance.recipe.name}>
												{mealInstance.recipe.name}
											</h4>
										</div>
										
										{/* Visa detaljer knapp */}
										<button
											onClick={() => handleShowRecipeDetails(mealInstance.recipe)}
											className="ml-1 p-1 bg-text/10 hover:bg-text/20 rounded transition-colors touch-target opacity-0 group-hover:opacity-100"
											title="Visa receptdetaljer"
										>
											<Eye className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-text/60" />
										</button>
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
}

export default DayCard
