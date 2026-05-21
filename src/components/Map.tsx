import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import type { NapRoute, Spot, NeighborhoodInfo } from '../types'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

interface MapProps {
  neighborhood: NeighborhoodInfo
  spots: Spot[]
  activeRoute: NapRoute | null
  onSpotClick: (spot: Spot) => void
}

const categoryColors: Record<string, string> = {
  park: '#4A7C6F',
  playground: '#E8845C',
  restaurant: '#D4A574',
  cafe: '#8B6F47',
  picnic: '#6B9E8F',
}

const categoryEmoji: Record<string, string> = {
  park: '🌳',
  playground: '🎪',
  restaurant: '🍽',
  cafe: '☕',
  picnic: '🧺',
}

export default function Map({ neighborhood, spots, activeRoute, onSpotClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

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

  // Render active route
  useEffect(() => {
    if (!map.current) return

    const sourceId = 'active-route'
    const layerId = 'active-route-line'

    const removeRoute = () => {
      if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId)
      if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId)
    }

    const drawRoute = () => {
      removeRoute()
      if (!activeRoute) return

      map.current!.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: activeRoute.coordinates,
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
          'line-color': '#E8845C',
          'line-width': 4,
          'line-opacity': 0.85,
        },
      })

      // Fit bounds to route
      const bounds = new mapboxgl.LngLatBounds()
      activeRoute.coordinates.forEach(coord => bounds.extend(coord as [number, number]))
      map.current!.fitBounds(bounds, { padding: 80, duration: 800 })
    }

    if (map.current.isStyleLoaded()) {
      drawRoute()
    } else {
      map.current.on('load', drawRoute)
    }

    return () => { removeRoute() }
  }, [activeRoute])

  return (
    <div ref={mapContainer} className="w-full h-full" />
  )
}
