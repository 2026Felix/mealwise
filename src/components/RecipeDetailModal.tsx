import { Recipe } from '../types'
import { X, Clock, Users, Star } from 'lucide-react'
import { useState } from 'react'

interface RecipeDetailModalProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'instructions' | 'nutrition'>('overview')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          {/* Bakgrundsbild om den finns */}
          {recipe.image && (
            <div className="absolute inset-0 rounded-t-xl overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.name}
                className="w-full h-full object-cover opacity-20"
              />
            </div>
          )}
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                  {recipe.name}
                </h1>
                {recipe.description && (
                  <p className="text-text/70 text-lg mb-4 max-w-2xl">
                    {recipe.description}
                  </p>
                )}
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.totalTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} portioner</span>
                  </div>
                </div>
              </div>
              
              {/* Stäng-knapp */}
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Stäng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { key: 'overview', label: 'Översikt' },
              { key: 'ingredients', label: 'Ingredienser' },
              { key: 'instructions', label: 'Instruktioner' },
              { key: 'nutrition', label: 'Näringsvärden' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-text/60 hover:text-text hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Innehåll */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Betyg och recensioner */}
              {(recipe.rating || recipe.reviewCount) && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          recipe.rating && star <= recipe.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-text/60 text-sm">
                    {recipe.rating && `${recipe.rating}/5`}
                    {recipe.reviewCount && ` (${recipe.reviewCount} recensioner)`}
                  </span>
                </div>
              )}

              {/* Taggar */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">Taggar</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Kortfattad information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-text mb-2">Tid</h3>
                  <div className="space-y-1 text-sm text-text/70">
                    <div>Förberedelse: {recipe.prepTime} min</div>
                    {recipe.cookTime && <div>Tillagning: {recipe.cookTime} min</div>}
                    <div>Totalt: {recipe.totalTime} min</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-text mb-2">Portioner</h3>
                  <div className="text-sm text-text/70">
                    {recipe.servings} portioner
                  </div>
                </div>
              </div>

              {/* Källa och författare */}
              {(recipe.author || recipe.source) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-text mb-2">Källa</h3>
                  <div className="text-sm text-text/70">
                    {recipe.author && <div>Författare: {recipe.author}</div>}
                    {recipe.source && <div>Källa: {recipe.source}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Ingredienser för {recipe.servings} portioner</h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-text">{ingredient.name}</span>
                    <span className="text-text/60 ml-auto">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Instruktioner</h3>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-text leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Näringsvärden per portion</h3>
              {recipe.nutrition ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.calories}</div>
                    <div className="text-sm text-text/60">Kalorier</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{recipe.nutrition.protein}g</div>
                    <div className="text-sm text-text/60">Protein</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{recipe.nutrition.carbs}g</div>
                    <div className="text-sm text-text/60">Kolhydrater</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{recipe.nutrition.fat}g</div>
                    <div className="text-sm text-text/60">Fett</div>
                  </div>
                  
                  {recipe.nutrition.fiber && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-600">{recipe.nutrition.fiber}g</div>
                      <div className="text-sm text-text/60">Fiber</div>
                    </div>
                  )}
                  
                  {recipe.nutrition.sugar && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-pink-600">{recipe.nutrition.sugar}g</div>
                      <div className="text-sm text-text/60">Socker</div>
                    </div>
                  )}
                  
                  {recipe.nutrition.sodium && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-indigo-600">{recipe.nutrition.sodium}mg</div>
                      <div className="text-sm text-text/60">Natrium</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-text/60">
                  Näringsvärden är inte tillgängliga för detta recept.
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
