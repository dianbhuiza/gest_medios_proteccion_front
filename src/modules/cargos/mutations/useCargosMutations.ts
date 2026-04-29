import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { cargosService, type CargoPayload } from '@/modules/cargos/api/cargos.service'
import { cargosKeys } from '@/modules/cargos/queries/useCargosQueries'

export function useCreateCargoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CargoPayload) => cargosService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cargosKeys.all }),
  })
}

export function useUpdateCargoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CargoPayload }) =>
      cargosService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cargosKeys.all }),
  })
}

export function useDeleteCargoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cargosService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cargosKeys.all }),
  })
}
