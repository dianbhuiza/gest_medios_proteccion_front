import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { aseosService } from '@/modules/aseos/api/aseos.service'
import { trabajadoresService } from '@/modules/trabajadores/api/trabajadores.service'
import { asignacionesAseoService } from '@/modules/asignaciones-aseo/api/asignaciones-aseo.service'

export const asignacionesAseoKeys = {
  all: ['asignaciones-aseo'] as const,
  list: (page: number, pageSize: number) => ['asignaciones-aseo', 'list', page, pageSize] as const,
}

export function useAsignacionesAseoListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => asignacionesAseoKeys.list(page.value, pageSize.value)),
    queryFn: () => asignacionesAseoService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}

export function useTrabajadoresCatalogAseoQuery() {
  return useQuery({
    queryKey: ['catalogos', 'trabajadores', 'asignaciones-aseo'],
    queryFn: () => trabajadoresService.list({ page: 1, pageSize: 100 }),
  })
}

export function useAseosCatalogQuery() {
  return useQuery({
    queryKey: ['catalogos', 'aseos', 'asignaciones-aseo'],
    queryFn: () => aseosService.list({ page: 1, pageSize: 100 }),
  })
}
