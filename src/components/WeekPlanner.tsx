import { useRecipeContext } from '../context/RecipeContext'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import DayCard from './DayCard'

const WeekPlanner: React.FC = memo(() => {
  const { state } = useRecipeContext()

  const [globalDragState, setGlobalDragState] = useState<{
    isDragging: boolean
    targetDay: string | null
  }>({ isDragging: false, targetDay: null })

  // Funktion för att beräkna aktuella veckan
  const getCurrentWeekInfo = useCallback(() => {
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
  }, [])

  const weekInfo = useMemo(() => getCurrentWeekInfo(), [getCurrentWeekInfo])

  // Global drag event handlers - definierade utanför useEffect
  const handleGlobalDragStart = useCallback((e: DragEvent) => {
    if (e.dataTransfer?.types.includes('application/json')) {
      setGlobalDragState({ isDragging: true, targetDay: null })
    }
  }, [])

  const handleGlobalDragEnd = useCallback(() => {
    setGlobalDragState({ isDragging: false, targetDay: null })
  }, [])

  // Global drag event handlers
  useEffect(() => {
    document.addEventListener('dragstart', handleGlobalDragStart)
    document.addEventListener('dragend', handleGlobalDragEnd)

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart)
      document.removeEventListener('dragend', handleGlobalDragEnd)
    }
  }, [handleGlobalDragStart, handleGlobalDragEnd])

  // Skapa en komplett vecka med alla dagar
  const completeWeek = useMemo(() => {
    const weekDays = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']
    return weekDays.map(dayName => {
      const existingDay = state.weekPlan.find(d => d.day === dayName)
      return existingDay || { day: dayName, recipes: [] }
    })
  }, [state.weekPlan])

  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
      {/* Header med veckoinfo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-baseline gap-2 sm:gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Veckoplan
          </h2>
          <div className="hidden sm:block w-0.5 h-6 bg-gray-300"></div>
          <span className="text-gray-600 text-sm font-normal">
            {weekInfo.monday.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')} - {weekInfo.sunday.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')}
          </span>
        </div>
      </div>
      
      {/* Veckoplan med dagar */}
      <div>
        {completeWeek.map((day) => (
          <div key={day.day}>
            <DayCard 
              day={day} 
              isGlobalDragActive={globalDragState.isDragging}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

WeekPlanner.displayName = 'WeekPlanner'

export default WeekPlanner
