import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from '@/components/sidebar/Sidebar'
import MapView from '@/components/map/MapView'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar />
        <main className="relative flex-1">
          <MapView />
        </main>
      </div>
    </QueryClientProvider>
  )
}
