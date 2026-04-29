import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { areasService } from '@/modules/areas/api/areas.service'

export const areasKeys = {
  all: ['areas'] as const,
  list: (page: number, pageSize: number) => ['areas', 'list', page, pageSize] as const,
}

export function useAreasListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => areasKeys.list(page.value, pageSize.value)),
    queryFn: () => areasService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}
