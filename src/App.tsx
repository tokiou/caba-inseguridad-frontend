import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import MapView from '@/components/map/MapView'
import RouteCardsBar from '@/components/panel/RouteCardsBar'
import RouteDetailPanel from '@/components/panel/RouteDetailPanel'
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Shell />
    </QueryClientProvider>
  )
}
