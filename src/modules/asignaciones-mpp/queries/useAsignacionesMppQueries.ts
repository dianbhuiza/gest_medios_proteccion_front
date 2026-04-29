import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { mppsService } from '@/modules/mpps/api/mpps.service'
import { tallasService } from '@/modules/tallas/api/tallas.service'
import { trabajadoresService } from '@/modules/trabajadores/api/trabajadores.service'
import { asignacionesMppService } from '@/modules/asignaciones-mpp/api/asignaciones-mpp.service'

export const asignacionesMppKeys = {
  all: ['asignaciones-mpp'] as const,
  list: (page: number, pageSize: number) => ['asignaciones-mpp', 'list', page, pageSize] as const,
}

export function useAsignacionesMppListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => asignacionesMppKeys.list(page.value, pageSize.value)),
    queryFn: () => asignacionesMppService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}

export function useTrabajadoresCatalogQuery() {
  return useQuery({
    queryKey: ['catalogos', 'trabajadores', 'asignaciones-mpp'],
    queryFn: () => trabajadoresService.list({ page: 1, pageSize: 100 }),
  })
}

export function useMppsCatalogQuery() {
  return useQuery({
    queryKey: ['catalogos', 'mpps', 'asignaciones-mpp'],
    queryFn: () => mppsService.list({ page: 1, pageSize: 100 }),
  })
}

export function useTallasCatalogQuery() {
  return useQuery({
    queryKey: ['catalogos', 'tallas', 'asignaciones-mpp'],
    queryFn: () => tallasService.list({ page: 1, pageSize: 100 }),
  })
}
