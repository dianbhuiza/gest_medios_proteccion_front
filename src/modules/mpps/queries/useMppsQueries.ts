import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { tallasService } from '@/modules/tallas/api/tallas.service'
import { mppsService } from '@/modules/mpps/api/mpps.service'

export const mppsKeys = {
  all: ['mpps'] as const,
  list: (page: number, pageSize: number) => ['mpps', 'list', page, pageSize] as const,
  stocks: (mppId: number, page: number, pageSize: number) => ['mpps', 'stocks', mppId, page, pageSize] as const,
}

export function useMppsListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => mppsKeys.list(page.value, pageSize.value)),
    queryFn: () => mppsService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}

export function useMppStocksQuery(
  mppId: Ref<number | null>,
  page: Ref<number>,
  pageSize: Ref<number>,
) {
  return useQuery({
    queryKey: computed(() => mppsKeys.stocks(mppId.value ?? 0, page.value, pageSize.value)),
    queryFn: () => mppsService.listStocks(mppId.value as number, { page: page.value, pageSize: pageSize.value }),
    enabled: computed(() => Boolean(mppId.value)),
    placeholderData: (previous) => previous,
  })
}

export function useTallasForMppQuery() {
  return useQuery({
    queryKey: ['catalogos', 'tallas', 'mpp'],
    queryFn: () => tallasService.list({ page: 1, pageSize: 100 }),
  })
}
