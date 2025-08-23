import { commonClasses } from '../utils/commonStyles'
import { FilterType } from '../hooks/useRecipeFilters'

interface FilterBarProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  onClearFilters: () => void
  filterButtons: Array<{ key: FilterType; label: string; description: string }>
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onToggleFilter,
  onClearFilters,
  filterButtons
}) => {
  return (
    <>
      {/* Filter-knappar */}
      <div className={commonClasses.filter.container}>
        {filterButtons.map(({ key, label, description }) => (
          <button
            key={key}
            onClick={() => onToggleFilter(key)}
            className={`${commonClasses.filter.button.base} ${
              activeFilters.has(key) 
                ? commonClasses.filter.button.active 
                : commonClasses.filter.button.inactive
            }`}
            title={description}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Enkel "Rensa filter" länk */}
      {activeFilters.size > 0 && (
        <div className="mb-4 text-center">
          <button
            onClick={onClearFilters}
            className="text-text/70 hover:text-text underline text-sm"
          >
            Rensa filter
          </button>
        </div>
      )}
    </>
  )
}

export default FilterBar
