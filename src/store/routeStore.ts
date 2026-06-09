import { create } from 'zustand'
import type { Coords, AddressSuggestion } from '@/types/map'
import type { RouteResponse, RouteSegment } from '@/types/route'

interface RouteState {
  origin: (Coords & { label: string }) | null
  destination: (Coords & { label: string }) | null
  hour: number
  activeRoute: RouteResponse | null
  selectedSegment: RouteSegment | null
  setOrigin: (place: AddressSuggestion) => void
  setDestination: (place: AddressSuggestion) => void
  setHour: (hour: number) => void
  setActiveRoute: (route: RouteResponse | null) => void
  setSelectedSegment: (segment: RouteSegment | null) => void
  clearRoute: () => void
}

export const useRouteStore = create<RouteState>((set) => ({
  origin: null,
  destination: null,
  hour: new Date().getHours(),
  activeRoute: null,
  selectedSegment: null,

  setOrigin: (place) =>
    set({
      origin: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        label: place.display_name,
      },
    }),

  setDestination: (place) =>
    set({
      destination: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        label: place.display_name,
      },
    }),

  setHour: (hour) => set({ hour }),
  setActiveRoute: (activeRoute) => set({ activeRoute, selectedSegment: null }),
  setSelectedSegment: (selectedSegment) => set({ selectedSegment }),

  clearRoute: () =>
    set({ origin: null, destination: null, activeRoute: null, selectedSegment: null }),
}))
