import { useState, useCallback } from 'react'
import Map from './components/Map'
import BottomSheet from './components/BottomSheet'
import SidePanel from './components/SidePanel'
import NeighborhoodPicker from './components/NeighborhoodPicker'
import NaploopPanel from './components/NaploopPanel'
import ExplorePanel from './components/ExplorePanel'
import { neighborhoods } from './data/neighborhoods'
import { spots } from './data/spots'
import { useFavorites } from './hooks/useFavorites'
import type { Neighborhood, NapRoute, Spot } from './types'

type Tab = 'naploop' | 'explore'

function App() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood>('fort-greene')
  const [activeTab, setActiveTab] = useState<Tab>('naploop')
  const [activeRoute, setActiveRoute] = useState<NapRoute | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const { isRouteFavorite, isSpotFavorite, toggleRoute, toggleSpot } = useFavorites()

  const neighborhood = neighborhoods.find(n => n.id === selectedNeighborhood)!
  const neighborhoodSpots = spots.filter(s => s.neighborhood === selectedNeighborhood)

  const handleSpotClick = useCallback((spot: Spot) => {
    setSelectedSpot(spot)
    setActiveTab('explore')
  }, [])

  const handleNeighborhoodChange = (id: Neighborhood) => {
    setSelectedNeighborhood(id)
    setActiveRoute(null)
    setSelectedSpot(null)
  }

  const panelContent = (
    <>
      {/* Logo / Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal tracking-tight">Strolli</h1>
        <p className="text-sm text-muted mt-1">Brooklyn stroller walks for napping kids</p>
      </div>

      {/* Neighborhood Picker */}
      <div className="mb-6">
        <NeighborhoodPicker
          selected={selectedNeighborhood}
          onSelect={handleNeighborhoodChange}
        />
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-muted-light rounded-xl mb-5">
        <button
          onClick={() => setActiveTab('naploop')}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all
            ${activeTab === 'naploop'
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-muted hover:text-charcoal'
            }
          `}
        >
          Naploop
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all
            ${activeTab === 'explore'
              ? 'bg-white text-charcoal shadow-sm'
              : 'text-muted hover:text-charcoal'
            }
          `}
        >
          Explore
        </button>
      </div>

      {/* Active Panel */}
      {activeTab === 'naploop' ? (
        <NaploopPanel
          neighborhood={selectedNeighborhood}
          onRouteSelect={setActiveRoute}
          activeRoute={activeRoute}
          isRouteFavorite={isRouteFavorite}
          toggleRouteFavorite={toggleRoute}
        />
      ) : (
        <ExplorePanel
          neighborhood={selectedNeighborhood}
          onSpotSelect={setSelectedSpot}
          selectedSpot={selectedSpot}
          isSpotFavorite={isSpotFavorite}
          toggleSpotFavorite={toggleSpot}
        />
      )}
    </>
  )

  return (
    <div className="flex h-full">
      {/* Desktop: Side Panel */}
      <SidePanel>{panelContent}</SidePanel>

      {/* Map (fills remaining space) */}
      <div className="flex-1 relative">
        <Map
          neighborhood={neighborhood}
          spots={neighborhoodSpots}
          activeRoute={activeRoute}
          onSpotClick={handleSpotClick}
        />
      </div>

      {/* Mobile: Bottom Sheet */}
      <BottomSheet>{panelContent}</BottomSheet>
    </div>
  )
}

export default App
