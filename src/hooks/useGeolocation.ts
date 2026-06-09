import { useState } from 'react'
import type { Coords } from '@/types/map'

interface GeolocationState {
  coords: Coords | null
  error: string | null
  loading: boolean
  request: () => void
}

export function useGeolocation(): GeolocationState {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function request() {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      () => {
        setError('No se pudo obtener la ubicación')
        setLoading(false)
      },
    )
  }

  return { coords, error, loading, request }
}
