import { create } from 'zustand'

export type Basemap = 'dark' | 'light'

export type LayerKey = 'risk_zones' | 'robberies' | 'transit' | 'cameras'

interface UIState {
  basemap: Basemap
  layers: Record<LayerKey, boolean>
  detailOpen: boolean
  toggleBasemap: () => void
  setBasemap: (b: Basemap) => void
  toggleLayer: (key: LayerKey) => void
  setDetailOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  basemap: 'dark',
  // Solo risk_zones tiene efecto real (marcadores de cuadra de mayor riesgo).
  // El resto son toggles con estado a la espera de fuente de datos.
  layers: { risk_zones: true, robberies: false, transit: false, cameras: false },
  detailOpen: false,

  toggleBasemap: () => set((s) => ({ basemap: s.basemap === 'dark' ? 'light' : 'dark' })),
  setBasemap: (basemap) => set({ basemap }),
  toggleLayer: (key) => set((s) => ({ layers: { ...s.layers, [key]: !s.layers[key] } })),
  setDetailOpen: (detailOpen) => set({ detailOpen }),
}))
