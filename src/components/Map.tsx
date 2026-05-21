import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import type { NapRoute, Spot, NeighborhoodInfo, Neighborhood } from '../types'
import { routes } from '../data/routes'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

interface MapProps {
  neighborhood: NeighborhoodInfo
  spots: Spot[]
  activeRoute: NapRoute | null
  onSpotClick: (spot: Spot) => void
  onRouteClick: (route: NapRoute) => void
  selectedNeighborhood: Neighborhood
}

const categoryColors: Record<string, string> = {
  park: '#4A7C6F',
  playground: '#E8845C',
  restaurant: '#D4A574',
  cafe: '#8B6F47',
  picnic: '#6B9E8F',
}

const categoryEmoji: Record<string, string> = {
  park: '\uD83C\uDF33',
  playground: '\uD83C\uDFAA',
  restaurant: '\uD83C\uDF7D',
  cafe: '\u2615',
  picnic: '\uD83E\uDDFA',
}

export default function Map({ neighborhood, spots, activeRoute, onSpotClick, onRouteClick, selectedNeighborhood }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const neighborhoodRoutes = routes.filter(r => r.neighborhood === selectedNeighborhood)

  const handleStartNearMe = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLng = pos.coords.longitude
        const userLat = pos.coords.latitude

        let closest: NapRoute | null = null
        let minDist = Infinity

        neighborhoodRoutes.forEach(route => {
          if (route.coordinates.length === 0) return
          const [lng, lat] = route.coordinates[0]
          const dist = Math.sqrt((lng - userLng) ** 2 + (lat - userLat) ** 2)
          if (dist < minDist) {
            minDist = dist
            closest = route
          }
        })

        if (closest) {
          onRouteClick(closest)
          setToast(`Closest route: ${(closest as NapRoute).name}`)
          setTimeout(() => setToast(null), 5000)
        }
      },
      () => {
        setToast('Could not get your location')
        setTimeout(() => setToast(null), 3000)
      },
      { enableHighAccuracy: true }
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neighborhoodRoutes, onRouteClick])

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: neighborhood.center,
      zoom: neighborhood.zoom,
      pitch: 0,
      bearing: 0,
    })

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    )

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    )

    return () => {
      map.current?.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update center when neighborhood changes
  useEffect(() => {
    if (!map.current) return
    map.current.flyTo({
      center: neighborhood.center,
      zoom: neighborhood.zoom,
      duration: 1200,
    })
  }, [neighborhood.center, neighborhood.zoom])

  // Render spot markers
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    spots.forEach(spot => {
      const el = document.createElement('div')
      el.className = 'spot-marker'
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${categoryColors[spot.category]};
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      `
      el.textContent = categoryEmoji[spot.category]
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        onSpotClick(spot)
      })

      const marker = new mapboxgl.Marker(el)
        .setLngLat(spot.coordinates)
        .addTo(map.current!)

      markersRef.current.push(marker)
    })
  }, [spots, onSpotClick])

  // Render all routes (faint) + active route (bold)
  useEffect(() => {
    if (!map.current) return

    const drawRoutes = () => {
      // Remove any existing route layers/sources
      neighborhoodRoutes.forEach(route => {
        const layerId = `route-line-${route.id}`
        const sourceId = `route-source-${route.id}`
        if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId)
        if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId)
      })
      // Also remove old active route layer from previous implementation
      if (map.current!.getLayer('active-route-line')) map.current!.removeLayer('active-route-line')
      if (map.current!.getSource('active-route')) map.current!.removeSource('active-route')

      neighborhoodRoutes.forEach(route => {
        const sourceId = `route-source-${route.id}`
        const layerId = `route-line-${route.id}`
        const isActive = activeRoute?.id === route.id

        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { id: route.id },
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates,
            },
          },
        })

        map.current!.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': isActive ? '#E8845C' : '#3D7A6B',
            'line-width': isActive ? 4 : 2,
            'line-opacity': isActive ? 0.85 : 0.2,
          },
        })

        // Click handler for faint routes
        map.current!.on('click', layerId, () => {
          onRouteClick(route)
        })

        map.current!.on('mouseenter', layerId, () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer'
        })

        map.current!.on('mouseleave', layerId, () => {
          if (map.current) map.current.getCanvas().style.cursor = ''
        })
      })

      // Fit bounds if active route
      if (activeRoute) {
        const bounds = new mapboxgl.LngLatBounds()
        activeRoute.coordinates.forEach(coord => bounds.extend(coord as [number, number]))
        map.current!.fitBounds(bounds, { padding: 80, duration: 800 })
      }
    }

    if (map.current.isStyleLoaded()) {
      drawRoutes()
    } else {
      map.current.on('load', drawRoutes)
    }

    return () => {
      if (!map.current) return
      neighborhoodRoutes.forEach(route => {
        const layerId = `route-line-${route.id}`
        const sourceId = `route-source-${route.id}`
        if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId)
        if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoute, selectedNeighborhood])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm text-charcoal font-medium">
          {toast}
        </div>
      )}

      {/* Start near me button */}
      <button
        onClick={handleStartNearMe}
        className="absolute bottom-24 left-3 z-10 bg-sage text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg hover:bg-sage-dark transition-colors"
      >
        Start near me
      </button>
    </div>
  )
}
