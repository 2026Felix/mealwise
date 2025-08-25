import { Recipe } from '../types'
import { useState, useEffect, useCallback, memo } from 'react'
import { isValidRecipe } from '../utils/validation'
import { CookingPot } from 'lucide-react'
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

interface RecipeCardProps {
	recipe: Recipe
	showOverlap?: boolean
	overlapCount?: number
	overlapIngredients?: string[]
	onAddToDay?: (recipe: Recipe) => void
	onShowDetails?: (recipe: Recipe) => void
}

const RecipeCard: React.FC<RecipeCardProps> = memo(({ 
	recipe, 
	showOverlap = false, 
	overlapCount = 0,
	onAddToDay,
	onShowDetails
}) => {
	const [isDragging, setIsDragging] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	// Detektera om användaren är på mobil
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		
		checkMobile()
		window.addEventListener('resize', checkMobile)
		
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const handleDragStart = useCallback((e: React.DragEvent) => {
		if (isMobile) return
		
		if (isValidRecipe(recipe)) {
			e.dataTransfer.setData('application/json', JSON.stringify(recipe))
			e.dataTransfer.effectAllowed = 'copy'
			setIsDragging(true)
		} else {
			e.preventDefault()
			console.error('Invalid recipe data, cannot start drag')
		}
	}, [isMobile, recipe])

	const handleDragEnd = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleAddToDay = useCallback(() => {
		if (onAddToDay) {
			onAddToDay(recipe)
		}
	}, [onAddToDay, recipe])

	const handleShowDetails = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		if (onShowDetails) {
			onShowDetails(recipe)
		}
	}, [onShowDetails, recipe])

	const handleClick = useCallback(() => {
		if (isMobile && onAddToDay) {
			handleAddToDay()
		}
	}, [isMobile, onAddToDay, handleAddToDay])

	const categoryColor = getCategoryColor(recipe.category)
	
	return (
		<div 
			className={`bg-white border-2 border-solid rounded-lg p-2 sm:p-3 transition-colors duration-200 hover:bg-gray-50 ${
				isDragging ? 'opacity-50 scale-95' : ''
			} h-12 sm:h-16 relative group touch-manipulation ${isMobile && onAddToDay ? 'cursor-pointer' : ''}`}
			style={{
				borderColor: categoryColor !== 'transparent' ? categoryColor : '#e5e7eb'
			}}
			draggable={!isMobile}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onClick={handleClick}
		>
			<div className="flex items-center justify-between h-full relative z-10">
				{/* Innehållssektion */}
				<div className="flex-1 min-w-0 flex flex-col justify-center">
					{/* Receptnamn */}
					<h3 className="font-medium text-gray-900 text-sm leading-none">
						{recipe.name}
					</h3>
				</div>

				{/* Knappar och info i samma rad */}
				<div className="flex items-center gap-2 ml-2">
					{/* Antal gemensamma ingredienser - förenklad */}
					{showOverlap && (
						<span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
							overlapCount > 0 
								? 'text-gray-600 bg-gray-100' 
								: 'text-gray-400 bg-gray-50'
						}`}>
							{overlapCount} gem.
						</span>
					)}
					
					{/* Visa detaljer knapp */}
					{onShowDetails && (
						<button
							onClick={handleShowDetails}
							className={buttonStyles.iconTransparentSmall}
							title="Visa receptdetaljer"
						>
							<CookingPot className="w-4 h-4 text-gray-600" />
						</button>
					)}
				</div>
			</div>

			{/* Desktop drag-indikator - lägre z-index så den inte täcker texten */}
			{!isMobile && (
				<div className="absolute inset-0 bg-transparent group-hover:bg-gray-50 transition-colors rounded-lg pointer-events-none z-0" />
			)}
		</div>
	)
})

RecipeCard.displayName = 'RecipeCard'

export default RecipeCard
