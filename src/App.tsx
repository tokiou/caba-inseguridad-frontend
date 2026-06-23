import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import AuthScreen from '@/components/auth/AuthScreen'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import MapView from '@/components/map/MapView'
import RouteCardsBar from '@/components/panel/RouteCardsBar'
import RouteDetailPanel from '@/components/panel/RouteDetailPanel'
import { onSessionExpired } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { useRoute } from '@/hooks/useRoute'
import { useRouteStore } from '@/store/routeStore'
import { useUIStore } from '@/store/uiStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

function Shell() {
  const { data, isFetching, isError, error, refetch } = useRoute()
  const setResponse = useRouteStore((s) => s.setResponse)
  const basemap = useUIStore((s) => s.basemap)
  const setDetailOpen = useUIStore((s) => s.setDetailOpen)

  useEffect(() => {
    if (data) {
      setResponse(data)
      setDetailOpen(true)
    }
  }, [data, setResponse, setDetailOpen])

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar
        onSearch={() => refetch()}
        isLoading={isFetching}
        isError={isError}
        error={error}
      />
      <div className="relative min-w-0 flex-1">
        <MapView key={basemap} />
        <TopBar />
        <RouteCardsBar />
      </div>
      <RouteDetailPanel />
    </div>
  )
}

function BootSplash() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0b0d12]">
      <Loader2 size={22} className="animate-spin text-[#00E599]" />
    </div>
  )
}

function AuthGate() {
  const { status, bootstrap } = useAuth()

  // El access token vive en memoria: al arrancar (o tras F5) intentamos
  // recuperar la sesión vía la cookie de refresh.
  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  // Si un refresh falla en medio del uso (sesión realmente expirada), volvemos
  // a estado anónimo para mandar a login en vez de mostrar un error de ruta.
  useEffect(() => {
    return onSessionExpired(() => useAuthStore.getState().setAnonymous())
  }, [])

  if (status === 'booting') return <BootSplash />
  if (status !== 'authenticated') return <AuthScreen />
  return <Shell />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  )
}
