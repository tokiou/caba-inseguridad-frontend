import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-full w-full items-center justify-center bg-[#0f1117] text-white">
        <p className="text-lg font-medium">caba-inseguridad · scaffold listo</p>
      </div>
    </QueryClientProvider>
  )
}
