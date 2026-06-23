import type { AddressSuggestion } from '@/types/map'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

// Bounding box de CABA (lon_min, lat_min, lon_max, lat_max). Sesga e (con
// bounded=1) restringe la búsqueda a la ciudad, que es el dominio de la app.
const CABA_VIEWBOX = '-58.531,-34.705,-58.335,-34.526'

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (!query.trim()) return []
  const params = new URLSearchParams({
    // Texto libre (sin sufijo forzado, que rompe matches de POIs/nombres)
    q: query,
    format: 'json',
    limit: '8',
    addressdetails: '0',
    countrycodes: 'ar',
    viewbox: CABA_VIEWBOX,
    bounded: '1',
  })
  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) return []
  return res.json() as Promise<AddressSuggestion[]>
}
