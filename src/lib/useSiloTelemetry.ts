import { useQuery } from '@tanstack/react-query'
import { siloApi } from '../data/mockSiloApi'

export const SILO_REFETCH_INTERVAL_MS = 30_000

export function useSiloTelemetry() {
  return useQuery({
    queryKey: ['silo-telemetry'],
    queryFn: () => siloApi.fetchTelemetry(),
    refetchInterval: SILO_REFETCH_INTERVAL_MS,
  })
}
