import { create } from 'zustand'
import type { Coords, AddressSuggestion } from '@/types/map'
import type { LatLng, RouteKind, SafeRoute, SafeRoutesResponse } from '@/types/route'

/** Orden de preferencia para resolver selectedKind cuando el actual no viene. */
const KIND_FALLBACK_ORDER: RouteKind[] = ['balanced', 'safest', 'fastest', 'least_safe_candidate']

interface RouteState {
  origin: (Coords & { label: string }) | null
  destination: (Coords & { label: string }) | null
  hour: number
  selectedKind: RouteKind
  hiddenKinds: RouteKind[]
  popupKind: RouteKind | null
  response: SafeRoutesResponse | null
  /** Punto a enfocar en el mapa (flyTo); se consume y se limpia. */
  focusPoint: LatLng | null

  setOrigin: (place: AddressSuggestion) => void
  setDestination: (place: AddressSuggestion) => void
  setHour: (hour: number) => void
  setSelectedKind: (kind: RouteKind) => void
  toggleKind: (kind: RouteKind) => void
  setPopupKind: (kind: RouteKind | null) => void
  setResponse: (response: SafeRoutesResponse | null) => void
  setFocusPoint: (point: LatLng | null) => void
  routeByKind: (kind: RouteKind) => SafeRoute | undefined
  clearRoute: () => void
}

function resolveSelectedKind(response: SafeRoutesResponse, current: RouteKind): RouteKind {
  const present = new Set(response.routes.map((r) => r.kind))
  if (present.has(current)) return current
  return KIND_FALLBACK_ORDER.find((k) => present.has(k)) ?? response.routes[0]?.kind ?? current
}

export const useRouteStore = create<RouteState>((set, get) => ({
  origin: null,
  destination: null,
  hour: new Date().getHours(),
  selectedKind: 'balanced',
  hiddenKinds: [],
  popupKind: null,
  response: null,
  focusPoint: null,

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

  setSelectedKind: (selectedKind) => set({ selectedKind }),

  toggleKind: (kind) =>
    set((s) => ({
      hiddenKinds: s.hiddenKinds.includes(kind)
        ? s.hiddenKinds.filter((k) => k !== kind)
        : [...s.hiddenKinds, kind],
    })),

  setPopupKind: (popupKind) => set({ popupKind }),

  setResponse: (response) =>
    set((s) =>
      response
        ? {
            response,
            selectedKind: resolveSelectedKind(response, s.selectedKind),
            hiddenKinds: [],
            popupKind: null,
          }
        : { response: null, hiddenKinds: [], popupKind: null },
    ),

  setFocusPoint: (focusPoint) => set({ focusPoint }),

  routeByKind: (kind) => get().response?.routes.find((r) => r.kind === kind),

  clearRoute: () =>
    set({
      origin: null,
      destination: null,
      response: null,
      hiddenKinds: [],
      popupKind: null,
    }),
}))
