import { useState } from 'react'
import type { NapRoute, Neighborhood } from '../types'
import { routes } from '../data/routes'

interface NaploopPanelProps {
  neighborhood: Neighborhood
  onRouteSelect: (route: NapRoute | null) => void
  activeRoute: NapRoute | null
}

const durationOptions = [20, 30, 45, 60, 90]

export default function NaploopPanel({ neighborhood, onRouteSelect, activeRoute }: NaploopPanelProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)

  const filteredRoutes = routes.filter(r => {
    const matchNeighborhood = r.neighborhood === neighborhood
    const matchDuration = selectedDuration
      ? Math.abs(r.durationMinutes - selectedDuration) <= 15
      : true
    return matchNeighborhood && matchDuration
  })

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
          Wake Window
        </h3>
        <div className="flex gap-2 flex-wrap">
          {durationOptions.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDuration(selectedDuration === d ? null : d)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${selectedDuration === d
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'bg-muted-light text-charcoal hover:bg-terracotta-light hover:text-white'
                }
              `}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredRoutes.length === 0 ? (
          <p className="text-muted text-sm py-4">No routes match this filter yet. Try a different duration.</p>
        ) : (
          filteredRoutes.map(route => (
            <button
              key={route.id}
              onClick={() => onRouteSelect(activeRoute?.id === route.id ? null : route)}
              className={`
                w-full text-left p-4 rounded-xl transition-all
                ${activeRoute?.id === route.id
                  ? 'bg-terracotta/10 border-2 border-terracotta'
                  : 'bg-white border border-muted-light hover:border-sage-light hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-charcoal">{route.name}</h4>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted-light text-muted">
                  {route.type === 'loop' ? '↻ Loop' : '→ A to B'}
                </span>
              </div>
              <p className="text-sm text-muted mb-2">{route.description}</p>
              <div className="flex gap-3 text-xs text-muted">
                <span>{route.durationMinutes} min</span>
                <span>{route.distanceMiles} mi</span>
                <span className={
                  route.noiseLevel === 'quiet' ? 'text-sage' :
                  route.noiseLevel === 'moderate' ? 'text-terracotta' : 'text-red-400'
                }>
                  {route.noiseLevel}
                </span>
                <span>shade: {route.shadeCoverage}</span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {route.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cream text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
