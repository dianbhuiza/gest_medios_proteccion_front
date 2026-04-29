import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { tallasService } from '@/modules/tallas/api/tallas.service'

export const tallasKeys = {
  all: ['tallas'] as const,
  list: (page: number, pageSize: number) => ['tallas', 'list', page, pageSize] as const,
}

export function useTallasListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => tallasKeys.list(page.value, pageSize.value)),
    queryFn: () => tallasService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}
