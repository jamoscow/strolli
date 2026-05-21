import { neighborhoods } from '../data/neighborhoods'
import type { Neighborhood } from '../types'

interface NeighborhoodPickerProps {
  selected: Neighborhood
  onSelect: (id: Neighborhood) => void
}

export default function NeighborhoodPicker({ selected, onSelect }: NeighborhoodPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {neighborhoods.map(n => (
        <button
          key={n.id}
          onClick={() => n.available && onSelect(n.id)}
          disabled={!n.available}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${selected === n.id
              ? 'bg-sage text-white shadow-sm'
              : n.available
                ? 'bg-muted-light text-charcoal hover:bg-sage-light hover:text-white'
                : 'bg-muted-light/50 text-muted cursor-not-allowed'
            }
          `}
        >
          {n.name}
          {!n.available && <span className="ml-1 text-xs opacity-60">soon</span>}
        </button>
      ))}
    </div>
  )
}
