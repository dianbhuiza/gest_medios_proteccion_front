import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { type TrabajadorPayload, trabajadoresService } from '@/modules/trabajadores/api/trabajadores.service'
import { trabajadoresKeys } from '@/modules/trabajadores/queries/useTrabajadoresQueries'

export function useCreateTrabajadorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TrabajadorPayload) => trabajadoresService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trabajadoresKeys.all }),
  })
}

export function useUpdateTrabajadorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TrabajadorPayload }) =>
      trabajadoresService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trabajadoresKeys.all }),
  })
}

export function useDeleteTrabajadorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => trabajadoresService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trabajadoresKeys.all }),
  })
}
