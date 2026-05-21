import type { NeighborhoodInfo } from '../types'

export const neighborhoods: NeighborhoodInfo[] = [
  {
    id: 'fort-greene',
    name: 'Fort Greene',
    center: [-73.9762, 40.6886],
    zoom: 14.5,
    available: true,
  },
  {
    id: 'park-slope',
    name: 'Park Slope',
    center: [-73.9785, 40.6711],
    zoom: 14.5,
    available: true,
  },
  {
    id: 'cobble-hill',
    name: 'Cobble Hill',
    center: [-73.9962, 40.6862],
    zoom: 15,
    available: false,
  },
  {
    id: 'carroll-gardens',
    name: 'Carroll Gardens',
    center: [-73.9998, 40.6795],
    zoom: 15,
    available: false,
  },
  {
    id: 'brooklyn-heights',
    name: 'Brooklyn Heights',
    center: [-73.9936, 40.6960],
    zoom: 15,
    available: false,
  },
  {
    id: 'dumbo',
    name: 'DUMBO',
    center: [-73.9877, 40.7033],
    zoom: 15,
    available: false,
  },
]
