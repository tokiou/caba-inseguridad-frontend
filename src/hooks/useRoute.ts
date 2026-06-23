import { useQuery } from '@tanstack/react-query'
import { fetchSafeRoutes } from '@/services/routeService'
import { useAuthStore } from '@/store/authStore'
import { useRouteStore } from '@/store/routeStore'
import { buildBuenosAiresDatetime } from '@/utils/datetime'

export function useRoute() {
  const { origin, destination, hour } = useRouteStore()
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated')

  return useQuery({
    queryKey: ['safe-routes', origin, destination, hour],
    queryFn: () =>
      fetchSafeRoutes(
        { lat: origin!.lat, lng: origin!.lng },
        { lat: destination!.lat, lng: destination!.lng },
        buildBuenosAiresDatetime(hour),
      ),
    // El endpoint es protegido: no disparar sin sesión.
    enabled: isAuthenticated && Boolean(origin && destination),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
