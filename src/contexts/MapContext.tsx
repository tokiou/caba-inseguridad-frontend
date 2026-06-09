import { createContext, useContext } from 'react'
import type { Map } from 'maplibre-gl'

export const MapContext = createContext<Map | null>(null)

export function useMap(): Map | null {
  return useContext(MapContext)
}
