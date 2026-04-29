import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { cargosService } from '@/modules/cargos/api/cargos.service'

export const cargosKeys = {
  all: ['cargos'] as const,
  list: (page: number, pageSize: number) => ['cargos', 'list', page, pageSize] as const,
}

export function useCargosListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => cargosKeys.list(page.value, pageSize.value)),
    queryFn: () => cargosService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}
