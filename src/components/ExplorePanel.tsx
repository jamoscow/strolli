import { useState } from 'react'
import type { Spot, SpotCategory, Neighborhood } from '../types'
import { spots } from '../data/spots'

interface ExplorePanelProps {
  neighborhood: Neighborhood
  onSpotSelect: (spot: Spot) => void
  selectedSpot: Spot | null
}

const categories: { id: SpotCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'park', label: 'Parks' },
  { id: 'playground', label: 'Playgrounds' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'cafe', label: 'Cafes' },
  { id: 'picnic', label: 'Picnic Spots' },
]

export default function ExplorePanel({ neighborhood, onSpotSelect, selectedSpot }: ExplorePanelProps) {
  const [activeCategory, setActiveCategory] = useState<SpotCategory | 'all'>('all')

  const filteredSpots = spots.filter(s => {
    const matchNeighborhood = s.neighborhood === neighborhood
    const matchCategory = activeCategory === 'all' || s.category === activeCategory
    return matchNeighborhood && matchCategory
  })

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
          Category
        </h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${activeCategory === c.id
                  ? 'bg-sage text-white shadow-sm'
                  : 'bg-muted-light text-charcoal hover:bg-sage-light hover:text-white'
                }
              `}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredSpots.length === 0 ? (
          <p className="text-muted text-sm py-4">No spots in this category yet.</p>
        ) : (
          filteredSpots.map(spot => (
            <button
              key={spot.id}
              onClick={() => onSpotSelect(spot)}
              className={`
                w-full text-left p-4 rounded-xl transition-all
                ${selectedSpot?.id === spot.id
                  ? 'bg-sage/10 border-2 border-sage'
                  : 'bg-white border border-muted-light hover:border-sage-light hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-charcoal">{spot.name}</h4>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted-light text-muted capitalize">
                  {spot.category}
                </span>
              </div>
              <p className="text-sm text-muted mb-2">{spot.description}</p>
              <div className="flex gap-1.5 flex-wrap">
                {spot.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cream text-muted">
                    {tag}
                  </span>
                ))}
              </div>
              {(spot.strollerFriendly || spot.hasChangingTable || spot.fenced) && (
                <div className="flex gap-2 mt-2 text-xs text-sage">
                  {spot.strollerFriendly && <span>stroller ok</span>}
                  {spot.hasChangingTable && <span>changing table</span>}
                  {spot.fenced && <span>fenced</span>}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
