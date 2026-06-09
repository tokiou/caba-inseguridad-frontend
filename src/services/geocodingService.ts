import type { AddressSuggestion } from '@/types/map'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org'

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (!query.trim()) return []
  const params = new URLSearchParams({
    q: `${query}, Buenos Aires, Argentina`,
    format: 'json',
    limit: '5',
    addressdetails: '0',
  })
  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) return []
  return res.json() as Promise<AddressSuggestion[]>
}
