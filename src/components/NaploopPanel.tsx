import { useState } from 'react'
import type { NapRoute, Neighborhood } from '../types'
import { routes } from '../data/routes'
import { useIsMobile } from '../hooks/useIsMobile'

interface NaploopPanelProps {
  neighborhood: Neighborhood
  onRouteSelect: (route: NapRoute | null) => void
  activeRoute: NapRoute | null
  isRouteFavorite: (id: string) => boolean
  toggleRouteFavorite: (id: string) => void
  napDurationFilter: number | null
  onNapDurationChange: (d: number | null) => void
}

const durationOptions = [15, 20, 30, 45, 60, 90]

export default function NaploopPanel({ neighborhood, onRouteSelect, activeRoute, isRouteFavorite, toggleRouteFavorite, napDurationFilter, onNapDurationChange }: NaploopPanelProps) {
  const isMobile = useIsMobile()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredRoutes = routes.filter(r => {
    const matchNeighborhood = r.neighborhood === neighborhood
    const matchDuration = napDurationFilter
      ? Math.abs(r.durationMinutes - napDurationFilter) <= 15
      : true
    return matchNeighborhood && matchDuration
  })

  const heroRoute = filteredRoutes[0] || null
  const restRoutes = filteredRoutes.slice(1)

  const handleCardClick = (route: NapRoute) => {
    if (isMobile) {
      if (expandedId === route.id) {
        onRouteSelect(activeRoute?.id === route.id ? null : route)
      } else {
        setExpandedId(route.id)
        onRouteSelect(route)
      }
    } else {
      onRouteSelect(activeRoute?.id === route.id ? null : route)
    }
  }

  const renderRouteCard = (route: NapRoute, isHero: boolean) => {
    const isActive = activeRoute?.id === route.id
    const isExpanded = !isMobile || expandedId === route.id || isHero

    return (
      <button
        key={route.id}
        onClick={() => handleCardClick(route)}
        className={`
          w-full text-left rounded-xl transition-all
          ${isHero ? 'p-4' : isMobile ? 'px-3 py-2.5' : 'p-3'}
          ${isActive
            ? 'bg-terracotta/10 border-2 border-terracotta'
            : 'bg-white border border-muted-light hover:border-sage-light hover:shadow-sm'
          }
        `}
      >
        {isHero && (
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-sage text-white mb-2">
            Top pick
          </span>
        )}
        <div className="flex items-start justify-between mb-1">
          <h4 className={`font-semibold text-charcoal ${!isHero && !isMobile ? 'text-sm' : ''}`}>
            {route.name}
          </h4>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); toggleRouteFavorite(route.id) }}
              className={`text-lg leading-none ${isRouteFavorite(route.id) ? 'text-terracotta' : 'text-muted hover:text-terracotta-light'}`}
            >
              {isRouteFavorite(route.id) ? '\u2665' : '\u2661'}
            </span>
            {(!isMobile || isExpanded) && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted-light text-muted">
                {route.type === 'loop' ? '\u21BB Loop' : '\u2192 A to B'}
              </span>
            )}
          </div>
        </div>

        {/* Compact mobile: single row summary */}
        {isMobile && !isExpanded && (
          <div className="flex gap-2 text-xs text-muted">
            <span className="font-medium text-charcoal">{route.durationMinutes} min</span>
            <span>{route.elevation}</span>
            <span>{route.surface}</span>
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <>
            <p className={`text-sm text-muted mb-2 ${!isHero ? 'line-clamp-1' : ''}`}>
              {route.description}
            </p>
            {route.tip && (
              <p className="text-xs italic text-muted mb-2">"{route.tip}"</p>
            )}
            <div className="flex gap-3 text-xs text-muted flex-wrap">
              <span className="font-medium text-charcoal">{route.durationMinutes} min</span>
              <span>{route.distanceMiles} mi</span>
              <span className={route.elevation === 'flat' ? 'text-sage font-medium' : 'text-muted'}>
                {route.elevation}
              </span>
              <span className={route.surface === 'smooth' ? 'text-sage' : 'text-terracotta'}>
                {route.surface} surface
              </span>
              <span className={
                route.noiseLevel === 'quiet' ? 'text-sage' :
                route.noiseLevel === 'moderate' ? 'text-terracotta' : 'text-red-400'
              }>
                {route.noiseLevel}
              </span>
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {route.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cream text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
          Nap Window
        </h3>
        <div className="flex gap-2 flex-wrap">
          {durationOptions.map(d => (
            <button
              key={d}
              onClick={() => onNapDurationChange(napDurationFilter === d ? null : d)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${napDurationFilter === d
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
          <>
            {heroRoute && renderRouteCard(heroRoute, true)}
            {restRoutes.map(route => renderRouteCard(route, false))}
          </>
        )}
      </div>
    </div>
  )
}
