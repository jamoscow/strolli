export type Neighborhood =
  | 'fort-greene'
  | 'park-slope'
  | 'cobble-hill'
  | 'carroll-gardens'
  | 'brooklyn-heights'
  | 'dumbo'

export type SpotCategory =
  | 'park'
  | 'playground'
  | 'restaurant'
  | 'cafe'
  | 'picnic'

export interface Spot {
  id: string
  name: string
  category: SpotCategory
  neighborhood: Neighborhood
  coordinates: [number, number] // [lng, lat]
  description: string
  tags: string[]
  strollerFriendly: boolean
  hasChangingTable?: boolean
  hasOutdoorSeating?: boolean
  fenced?: boolean
  ageRange?: string
}

export interface NapRoute {
  id: string
  name: string
  neighborhood: Neighborhood
  durationMinutes: number
  distanceMiles: number
  type: 'loop' | 'point-to-point'
  coordinates: [number, number][] // polyline points
  description: string
  tags: string[]
  elevationGain?: number // feet
  noiseLevel: 'quiet' | 'moderate' | 'busy'
  shadeCoverage: 'full' | 'partial' | 'minimal'
}

export interface NeighborhoodInfo {
  id: Neighborhood
  name: string
  center: [number, number]
  zoom: number
  available: boolean
}
