import { create } from 'zustand'
import type { Coords } from '@/types/map'

interface MapState {
  center: Coords
  zoom: number
  setCenter: (center: Coords) => void
  setZoom: (zoom: number) => void
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
  zoom: 13,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
}))
