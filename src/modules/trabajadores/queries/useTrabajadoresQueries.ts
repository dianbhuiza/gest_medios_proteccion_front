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
  subAreas: ['catalogos', 'sub-areas'] as const,
  subAreasAutocomplete: (search: string) => ['catalogos', 'sub-areas', 'autocomplete', search] as const,
  cargos: ['catalogos', 'cargos'] as const,
  cargosAutocomplete: (search: string) => ['catalogos', 'cargos', 'autocomplete', search] as const,
  tallas: ['catalogos', 'tallas'] as const,
}

export function useTrabajadoresListQuery(page: Ref<number>, pageSize: Ref<number>) {
  return useQuery({
    queryKey: computed(() => trabajadoresKeys.list(page.value, pageSize.value)),
    queryFn: () => trabajadoresService.list({ page: page.value, pageSize: pageSize.value }),
    placeholderData: (previous) => previous,
  })
}

export function useSubAreasOptionsQuery() {
  return useQuery({
    queryKey: trabajadoresCatalogKeys.subAreas,
    queryFn: async () => {
      const areasResponse = await areasService.list({ page: 1, pageSize: 100 })
      const subAreas = areasResponse.results.flatMap(area => 
        area.sub_areas.map(subArea => ({ ...subArea, area_nombre: area.nombre }))
      )
      return { results: subAreas, meta: areasResponse.meta }
    },
  })
}

export function useSubAreasAutocompleteQuery(search: Ref<string>) {
  return useQuery({
    queryKey: computed(() => trabajadoresCatalogKeys.subAreasAutocomplete(search.value.trim())),
    queryFn: () => areasService.listSubAreas({ page: 1, pageSize: 20, search: search.value.trim() }),
    enabled: computed(() => search.value.trim().length > 0),
    placeholderData: (previous) => previous,
  })
}

export function useCargosOptionsQuery() {
  return useQuery({
    queryKey: trabajadoresCatalogKeys.cargos,
    queryFn: () => cargosService.list({ page: 1, pageSize: 100 }),
  })
}

export function useCargosAutocompleteQuery(search: Ref<string>) {
  return useQuery({
    queryKey: computed(() => trabajadoresCatalogKeys.cargosAutocomplete(search.value.trim())),
    queryFn: () => cargosService.list({ page: 1, pageSize: 20, nombre: search.value.trim() }),
    enabled: computed(() => search.value.trim().length > 0),
    placeholderData: (previous) => previous,
  })
}

export function useTallasOptionsQuery() {
  return useQuery({
    queryKey: trabajadoresCatalogKeys.tallas,
    queryFn: () => tallasService.list({ page: 1, pageSize: 100 }),
  })
}
