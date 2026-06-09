import { api } from './api'
import type { RouteRequest, RouteResponse } from '@/types/route'

export async function fetchRoute(params: RouteRequest): Promise<RouteResponse> {
  const { from, to, hour } = params
  const query = new URLSearchParams({
    from: `${from[0]},${from[1]}`,
    to: `${to[0]},${to[1]}`,
    ...(hour !== undefined && { hour: String(hour) }),
  })
  return api.get<RouteResponse>(`/api/route?${query}`)
}
