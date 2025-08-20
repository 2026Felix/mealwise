import { useRecipeContext } from '../context/RecipeContext'
import DayCard from './DayCard'


import { useState, useEffect } from 'react'

const WeekPlanner: React.FC = () => {
  const { state } = useRecipeContext()

  const [globalDragState, setGlobalDragState] = useState<{
    isDragging: boolean
    targetDay: string | null
  }>({ isDragging: false, targetDay: null })

  // Funktion för att beräkna aktuella veckan
  const getCurrentWeekInfo = () => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
    
    // Hitta måndagen i aktuella veckan
    const monday = new Date(now)
    const dayOfWeek = now.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    monday.setDate(now.getDate() - daysToMonday)
    
    // Hitta söndagen i aktuella veckan
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    
    return {
      weekNumber,
      monday,
      sunday
    }
  }

  const weekInfo = getCurrentWeekInfo()



  // Global drag event handlers
  useEffect(() => {
    const handleGlobalDragStart = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('application/json')) {
        setGlobalDragState({ isDragging: true, targetDay: null })
      }
    }

    const handleGlobalDragEnd = () => {
      setGlobalDragState({ isDragging: false, targetDay: null })
    }

    document.addEventListener('dragstart', handleGlobalDragStart)
    document.addEventListener('dragend', handleGlobalDragEnd)

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart)
      document.removeEventListener('dragend', handleGlobalDragEnd)
    }
  }, [])

  return (
    <div className="bg-component rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
      {/* Header med veckoinfo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-baseline gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-text">
            Veckoplan
          </h2>
          <div className="hidden sm:block w-0.5 h-6 bg-text/30"></div>
          <span className="text-text/70 text-sm sm:text-base font-medium">
            {weekInfo.monday.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')} - {weekInfo.sunday.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')}
          </span>
        </div>
      </div>
      
      {/* Veckoplan med dagar */}
      <div>
        {state.weekPlan.map((day, index) => (
          <div key={day.day}>
            <DayCard 
              day={day} 
              isGlobalDragActive={globalDragState.isDragging}
            />
                    {index < state.weekPlan.length - 1 && (
          <div className="h-px bg-text/20 my-2"></div>
        )}
          </div>
        ))}
      </div>


      

    </div>
  )
}

export default WeekPlanner
