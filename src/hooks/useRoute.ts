import { useQuery } from '@tanstack/react-query'
import { fetchRoute } from '@/services/routeService'
import { useRouteStore } from '@/store/routeStore'

export function useRoute() {
  const { origin, destination, hour } = useRouteStore()

  return useQuery({
    queryKey: ['route', origin, destination, hour],
    queryFn: () =>
      fetchRoute({
        from: [origin!.lat, origin!.lng],
        to: [destination!.lat, destination!.lng],
        hour,
      }),
    enabled: Boolean(origin && destination),
    staleTime: 5 * 60 * 1000,
  })
}
