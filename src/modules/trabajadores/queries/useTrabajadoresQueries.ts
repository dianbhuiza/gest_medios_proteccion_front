import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { areasService } from '@/modules/areas/api/areas.service'
import { cargosService } from '@/modules/cargos/api/cargos.service'
import { tallasService } from '@/modules/tallas/api/tallas.service'
import { trabajadoresService } from '@/modules/trabajadores/api/trabajadores.service'

export const trabajadoresKeys = {
  all: ['trabajadores'] as const,
  list: (page: number, pageSize: number) => ['trabajadores', 'list', page, pageSize] as const,
}

export const trabajadoresCatalogKeys = {
  areas: ['catalogos', 'areas'] as const,
  cargos: ['catalogos', 'cargos'] as const,
  tallas: ['catalogos', 'tallas'] as const,
}

export function useTrabajadoresListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => trabajadoresKeys.list(page.value, pageSize.value)),
    queryFn: () => trabajadoresService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}

export function useAreasOptionsQuery() {
  return useQuery({
    queryKey: trabajadoresCatalogKeys.areas,
    queryFn: () => areasService.list({ page: 1, pageSize: 100 }),
  })
}

export function useCargosOptionsQuery() {
  return useQuery({
    queryKey: trabajadoresCatalogKeys.cargos,
    queryFn: () => cargosService.list({ page: 1, pageSize: 100 }),
  })
}

export function useTallasOptionsQuery() {
  return useQuery({
    queryKey: trabajadoresCatalogKeys.tallas,
    queryFn: () => tallasService.list({ page: 1, pageSize: 100 }),
  })
}
