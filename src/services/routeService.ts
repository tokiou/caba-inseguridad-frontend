import type { ApiError, LatLng, SafeRoutesResponse } from '@/types/route'
import { authFetch } from '@/services/authService'

/** Error tipado que conserva el código máquina del backend y el X-Request-Id. */
export class SafeRoutesError extends Error {
  code: string
  requestId: string | null

  constructor(code: string, message: string, requestId: string | null) {
    super(message)
    this.name = 'SafeRoutesError'
    this.code = code
    this.requestId = requestId
  }
}

/** Mensaje accionable según el código de error del backend. */
export function messageForError(err: unknown): string {
  const code = err instanceof SafeRoutesError ? err.code : 'internal_error'
  switch (code) {
    case 'invalid_request':
    case 'origin_or_destination_outside_walkable_graph':
      return 'Elegí puntos sobre calles de CABA y reintentá.'
    case 'route_not_found':
      return 'No encontramos una ruta caminable entre esos puntos.'
    case 'risk_model_unavailable':
      return 'El servicio de riesgo no está disponible. Probá de nuevo en unos minutos.'
    default:
      return 'Ocurrió un error al calcular la ruta. Reintentá.'
  }
}

function buildParams(origin: LatLng, destination: LatLng, datetime?: string): string {
  const p = new URLSearchParams({
    origin_lat: String(origin.lat),
    origin_lng: String(origin.lng),
    dest_lat: String(destination.lat),
    dest_lng: String(destination.lng),
  })
  if (datetime) p.set('datetime', datetime)
  return p.toString()
}

/**
 * GET /api/v1/routes/safe — devuelve hasta 4 rutas alternativas.
 * Ante error parsea el envelope { error, message } y lanza SafeRoutesError.
 */
export async function fetchSafeRoutes(
  origin: LatLng,
  destination: LatLng,
  datetime?: string,
): Promise<SafeRoutesResponse> {
  // Endpoint protegido: authFetch agrega el Bearer y auto-refresca ante 401.
  const res = await authFetch(`/routes/safe?${buildParams(origin, destination, datetime)}`)
  const requestId = res.headers.get('X-Request-Id')

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ApiError | null
    throw new SafeRoutesError(
      body?.error ?? 'internal_error',
      body?.message ?? `HTTP ${res.status}`,
      requestId,
    )
  }

  return res.json() as Promise<SafeRoutesResponse>
}
