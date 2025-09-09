import { useState, useEffect, useCallback } from 'react'
import { X, Clock, Users } from 'lucide-react'
import { Recipe as RecipeType } from '../types'
import { buttonStyles } from '../utils/uiStyles'
import { normalizeRecipeTags } from '../utils/recipeHelpers'
import { useScrollLock } from '../hooks/useScrollControl'

interface RecipeDetailModalProps {
  recipe: RecipeType
  isOpen: boolean
  onClose: () => void
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients')
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())
  const [completedInstructions, setCompletedInstructions] = useState<Set<number>>(new Set())
  const [isWakeLockActive, setIsWakeLockActive] = useState(false)
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)

  // Lås scroll när modalen är öppen
  useScrollLock(isOpen)

  // Hantera checkbox-klick
  const toggleIngredient = (ingredientName: string) => {
    const newChecked = new Set(checkedIngredients)
    if (newChecked.has(ingredientName)) {
      newChecked.delete(ingredientName)
    } else {
      newChecked.add(ingredientName)
    }
    setCheckedIngredients(newChecked)
  }

  // Hantera instruktion-klick
  const toggleInstruction = (instructionIndex: number) => {
    const newCompleted = new Set(completedInstructions)
    if (newCompleted.has(instructionIndex)) {
      newCompleted.delete(instructionIndex)
    } else {
      newCompleted.add(instructionIndex)
    }
    setCompletedInstructions(newCompleted)
  }

  // Hantera skärmsläckning
  const toggleWakeLock = async () => {
    try {
      if (isWakeLockActive && wakeLock) {
        await wakeLock.release()
        setWakeLock(null)
        setIsWakeLockActive(false)
      } else {
        if ('wakeLock' in navigator) {
          const newWakeLock = await navigator.wakeLock.request('screen')
          setWakeLock(newWakeLock)
          setIsWakeLockActive(true)
          
          // Hantera när wake lock släpps automatiskt
          newWakeLock.addEventListener('release', () => {
            setIsWakeLockActive(false)
            setWakeLock(null)
          })
        }
      }
    } catch (error) {
      console.error('Kunde inte hantera skärmsläckning:', error)
    }
  }

  // Rensa wake lock när komponenten stängs
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [wakeLock])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto modal-container">
      <div className="bg-white rounded-t-xl sm:rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl sm:shadow-2xl modal-safe-area" style={{ 
        maxHeight: '95vh'
      }}>
        {/* Header */}
        <div className="relative p-6 modal-header">
          {/* Bakgrundsbild om den finns */}
          {recipe.image && (
            <div className="absolute inset-0 rounded-t-xl overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.name}
                className="w-full h-full object-cover opacity-20"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  // Fallback om bilden inte kan laddas
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
          
          <div className="relative z-10">
            {/* Skärmvakning-knapp - vänstra hörnet */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleWakeLock}
                  className={`toggle-switch relative inline-flex h-6 w-12 min-w-[48px] min-h-[24px] items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                    isWakeLockActive ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  title={isWakeLockActive ? 'Stäng av skärmvakning' : 'Aktivera skärmvakning'}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md ${
                      isWakeLockActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Håll skärmen tänd
                </span>
              </div>
              
              {/* Stäng-knapp - högra hörnet */}
              <button
                onClick={onClose}
                className={buttonStyles.iconTransparentClose}
                title="Stäng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Innehåll flyttat ner */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {recipe.name}
              </h1>
              
              {/* Metadata centrerat direkt under titeln */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>{recipe.totalTime} min</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <span>{recipe.servings} portioner</span>
                </div>
              </div>
              
              {recipe.description && (
                <p className="text-gray-700 text-lg mb-4 max-w-2xl text-left">
                  {recipe.description}
                </p>
              )}

              {/* Normaliserade taggar (endast tillåtna) */}
              {normalizeRecipeTags(recipe.tags).length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {normalizeRecipeTags(recipe.tags).map((tag, index) => (
                      <span
                        key={index}
                        className={buttonStyles.filterTag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex overflow-x-auto">
            <div className="flex bg-gray-100 rounded-lg p-1 min-w-full mb-2">
              {[
                { key: 'ingredients', label: 'Ingredienser' },
                { key: 'instructions', label: 'Instruktioner' },
                { key: 'nutrition', label: 'Näring' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`${buttonStyles.tab} ${
                    activeTab === tab.key ? buttonStyles.tabActive : buttonStyles.tabInactive
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Innehåll - förbättrad mobil scroll */}
        <div className="px-4 pt-1 pb-4 overflow-y-auto max-h-[60vh] w-full overscroll-contain touch-scroll scroll-indicator" style={{ WebkitOverflowScrolling: 'touch' }}>
          {activeTab === 'ingredients' && (
            <div>
              {/* Ingredienslista */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleIngredient(ingredient.name)}
                    >
                      {/* Checkbox */}
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={checkedIngredients.has(ingredient.name)}
                          onChange={() => toggleIngredient(ingredient.name)}
                          className="sr-only"
                        />
                        <div 
                          className={`${buttonStyles.checkbox} ${
                            checkedIngredients.has(ingredient.name)
                              ? buttonStyles.checkboxActive
                              : buttonStyles.checkboxInactive
                          }`}
                        >
                          {checkedIngredients.has(ingredient.name) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Ingrediensnamn */}
                      <span className={`flex-1 text-sm ${
                        checkedIngredients.has(ingredient.name) ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}>
                        {ingredient.name}
                      </span>
                      
                      {/* Mängd */}
                      <span className="text-gray-600 text-sm">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              {/* Instruktionslista */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {recipe.instructions.map((instruction, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleInstruction(index)}
                    >
                      {/* Checkbox */}
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={completedInstructions.has(index)}
                          onChange={() => toggleInstruction(index)}
                          className="sr-only"
                        />
                        <div 
                          className={`${buttonStyles.checkbox} ${
                            completedInstructions.has(index)
                              ? buttonStyles.checkboxActive
                              : buttonStyles.checkboxInactive
                          }`}
                        >
                          {completedInstructions.has(index) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Instruktionstext */}
                      <span className={`flex-1 text-sm ${
                        completedInstructions.has(index) ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}>
                        <span className="font-semibold text-gray-900 mr-2 text-sm">{index + 1}.</span>
                        {instruction}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Avslutande text */}
              <div className="text-center py-4">
                <p className="text-gray-700 italic">
                  Hoppas det ska smaka! 🍽️
                </p>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              {recipe.nutrition ? (
                <>
                  {/* Näringsvärden tabell med % och mängd */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 w-full">
                    {/* Tabell header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex">
                        <div className="flex-1 text-sm font-semibold text-gray-900">Namn</div>
                        <div className="w-24 text-sm font-semibold text-gray-900 text-center">Energi %</div>
                        <div className="w-32 text-sm font-semibold text-gray-900 text-right">Per portion</div>
                      </div>
                    </div>
                    
                    {/* Tabell rader */}
                    <div className="divide-y divide-gray-200">
                      {/* Kalorier */}
                      <div className="flex items-center px-4 py-3">
                        <div className="flex-1 text-sm text-gray-900">Kalorier</div>
                        <div className="w-24 text-center text-sm text-gray-600">
                          {Math.round((recipe.nutrition.calories / 2000) * 100)}%
                        </div>
                        <div className="w-32 text-right text-sm text-gray-900 font-medium">
                          {recipe.nutrition.calories} kcal
                        </div>
                      </div>
                      
                      {/* Protein */}
                      <div className="flex items-center px-4 py-3">
                        <div className="flex-1 text-sm text-gray-900">Protein</div>
                        <div className="w-24 text-center text-sm text-gray-600">
                          {Math.round((recipe.nutrition.protein / 50) * 100)}%
                        </div>
                        <div className="w-32 text-right text-sm text-gray-900 font-medium">
                          {recipe.nutrition.protein}g
                        </div>
                      </div>
                      
                      {/* Kolhydrater */}
                      <div className="flex items-center px-4 py-3">
                        <div className="flex-1 text-sm text-gray-900">Kolhydrater</div>
                        <div className="w-24 text-center text-sm text-gray-600">
                          {Math.round((recipe.nutrition.carbs / 275) * 100)}%
                        </div>
                        <div className="w-32 text-right text-sm text-gray-900 font-medium">
                          {recipe.nutrition.carbs}g
                        </div>
                      </div>
                      
                      {/* Fett */}
                      <div className="flex items-center px-4 py-3">
                        <div className="flex-1 text-sm text-gray-900">Fett</div>
                        <div className="w-24 text-center text-sm text-gray-600">
                          {Math.round((recipe.nutrition.fat / 55) * 100)}%
                        </div>
                        <div className="w-32 text-right text-sm text-gray-900 font-medium">
                          {recipe.nutrition.fat}g
                        </div>
                      </div>
                      
                      {/* Fiber (om tillgängligt) */}
                      {recipe.nutrition.fiber && (
                        <div className="flex items-center px-4 py-3">
                          <div className="flex-1 text-sm text-gray-900">Fiber</div>
                          <div className="w-24 text-center text-sm text-gray-600">
                            {Math.round((recipe.nutrition.fiber / 28) * 100)}%
                          </div>
                          <div className="w-32 text-right text-sm text-gray-900 font-medium">
                            {recipe.nutrition.fiber}g
                          </div>
                        </div>
                      )}
                      
                      {/* Socker (om tillgängligt) */}
                      {recipe.nutrition.sugar && (
                        <div className="flex items-center px-4 py-3">
                          <div className="flex-1 text-sm text-gray-900">Socker</div>
                          <div className="w-24 text-center text-sm text-gray-600">
                            {Math.round((recipe.nutrition.sugar / 50) * 100)}%
                          </div>
                          <div className="w-32 text-right text-sm text-gray-900 font-medium">
                            {recipe.nutrition.sugar}g
                          </div>
                        </div>
                      )}
                      
                      {/* Natrium (om tillgängligt) */}
                      {recipe.nutrition.sodium && (
                        <div className="flex items-center px-4 py-3">
                          <div className="flex-1 text-sm text-gray-900">Natrium</div>
                          <div className="w-24 text-center text-sm text-gray-600">
                            {Math.round((recipe.nutrition.sodium / 2300) * 100)}%
                          </div>
                          <div className="w-32 text-right text-sm text-gray-900 font-medium">
                            {recipe.nutrition.sodium}mg
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Inga näringsvärden tillgängliga för detta recept.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailModal
