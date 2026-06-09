import { useQuery } from '@tanstack/react-query'
import { searchAddress } from '@/services/geocodingService'

export function useAddressSearch(query: string) {
  return useQuery({
    queryKey: ['address', query],
    queryFn: () => searchAddress(query),
    enabled: query.length >= 3,
    staleTime: 60 * 1000,
  })
}
