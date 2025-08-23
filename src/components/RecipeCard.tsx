import { Recipe } from '../types'
import { useState, useEffect } from 'react'
import { isValidRecipe } from '../utils/validation'
import { Plus, Eye } from 'lucide-react'

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

interface RecipeCardProps {
	recipe: Recipe
	showOverlap?: boolean
	overlapCount?: number
	overlapIngredients?: string[]
	onAddToDay?: (recipe: Recipe) => void
	showAddButton?: boolean
	onShowDetails?: (recipe: Recipe) => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
	recipe, 
	showOverlap = false, 
	overlapCount = 0,
	onAddToDay,
	showAddButton = false,
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

	const handleDragStart = (e: React.DragEvent) => {
		if (isMobile) return
		
		if (isValidRecipe(recipe)) {
			e.dataTransfer.setData('application/json', JSON.stringify(recipe))
			e.dataTransfer.effectAllowed = 'copy'
			setIsDragging(true)
		} else {
			e.preventDefault()
			console.error('Invalid recipe data, cannot start drag')
		}
	}

	const handleDragEnd = () => {
		setIsDragging(false)
	}

	const handleAddToDay = () => {
		if (onAddToDay) {
			onAddToDay(recipe)
		}
	}

	const handleShowDetails = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (onShowDetails) {
			onShowDetails(recipe)
		}
	}

	const categoryColor = getCategoryColor(recipe.category)
	
	return (
		<div 
			className={`bg-white border-2 border-dashed rounded-lg p-2 sm:p-3 transition-colors duration-200 hover:bg-gray-50 ${
				isDragging ? 'opacity-50 scale-95' : ''
			} h-12 sm:h-16 relative group touch-manipulation ${isMobile && onAddToDay ? 'cursor-pointer' : ''}`}
			style={{
				borderColor: categoryColor !== 'transparent' ? categoryColor : '#e5e7eb'
			}}
			draggable={!isMobile}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onClick={() => {
				if (isMobile && onAddToDay) {
					handleAddToDay()
				}
			}}
		>
			<div className="flex items-center justify-between h-full">
				{/* Innehållssektion */}
				<div className="flex-1 min-w-0 flex flex-col justify-center">
					{/* Receptnamn */}
					<h3 className="font-medium text-text text-xs sm:text-sm leading-none">
						{recipe.name}
					</h3>
				</div>

				{/* Visa antal gemensamma ingredienser - alltid synlig */}
				{showOverlap && (
					<div className="flex flex-col items-end gap-1 ml-2 sm:ml-4">
						<span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
							overlapCount > 0 
								? 'text-text/60 bg-text/10' 
								: 'text-text/40 bg-text/5'
						}`}>
							{overlapCount} gemensamma
						</span>
					</div>
				)}

				{/* Knappar */}
				<div className="flex items-center gap-1 ml-2">
					{/* Visa detaljer knapp */}
					{onShowDetails && (
						<button
							onClick={handleShowDetails}
							className="p-1.5 bg-text/10 hover:bg-text/20 rounded-lg transition-colors touch-target"
							title="Visa receptdetaljer"
						>
							<Eye className="w-3 h-3 text-text/60" />
						</button>
					)}
					
					{/* Mobil "Lägg till"-knapp */}
					{isMobile && showAddButton && onAddToDay && (
						<button
							onClick={handleAddToDay}
							className="p-1.5 bg-text/10 hover:bg-text/20 rounded-lg transition-colors touch-target"
							title="Lägg till i veckoplan"
						>
							<Plus className="w-3 h-3 text-text/60" />
						</button>
					)}
				</div>
			</div>

			{/* Desktop drag-indikator */}
			{!isMobile && (
				<div className="absolute inset-0 bg-transparent group-hover:bg-text/5 transition-colors rounded-lg pointer-events-none" />
			)}
		</div>
	)
}

export default RecipeCard
