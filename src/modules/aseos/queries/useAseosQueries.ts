import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { aseosService } from '@/modules/aseos/api/aseos.service'

export const aseosKeys = {
  all: ['aseos'] as const,
  list: (page: number, pageSize: number) => ['aseos', 'list', page, pageSize] as const,
}

export function useAseosListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => aseosKeys.list(page.value, pageSize.value)),
    queryFn: () => aseosService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}
