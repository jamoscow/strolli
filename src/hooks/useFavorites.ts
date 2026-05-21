import { useState, useCallback } from 'react'

const STORAGE_KEY = 'strolli-favorites'

interface Favorites {
  routes: string[]
  spots: string[]
}

function loadFavorites(): Favorites {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { routes: [], spots: [] }
}

function saveFavorites(favorites: Favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(loadFavorites)

  const toggleRoute = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.routes.includes(id)
        ? { ...prev, routes: prev.routes.filter(r => r !== id) }
        : { ...prev, routes: [...prev.routes, id] }
      saveFavorites(next)
      return next
    })
  }, [])

  const toggleSpot = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.spots.includes(id)
        ? { ...prev, spots: prev.spots.filter(s => s !== id) }
        : { ...prev, spots: [...prev.spots, id] }
      saveFavorites(next)
      return next
    })
  }, [])

  const isRouteFavorite = useCallback((id: string) => favorites.routes.includes(id), [favorites])
  const isSpotFavorite = useCallback((id: string) => favorites.spots.includes(id), [favorites])

  return { favorites, toggleRoute, toggleSpot, isRouteFavorite, isSpotFavorite }
}
