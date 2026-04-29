import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { aseosService, type AseoPayload } from '@/modules/aseos/api/aseos.service'
import { aseosKeys } from '@/modules/aseos/queries/useAseosQueries'

export function useCreateAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AseoPayload) => aseosService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aseosKeys.all }),
  })
}

export function useUpdateAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AseoPayload }) => aseosService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aseosKeys.all }),
  })
}

export function useDeleteAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => aseosService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aseosKeys.all }),
  })
}

export function useIngresoAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, cantidad }: { id: number; cantidad: number }) => aseosService.ingresoCantidad(id, cantidad),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aseosKeys.all }),
  })
}

export function useRetiroAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, cantidad }: { id: number; cantidad: number }) => aseosService.retiroCantidad(id, cantidad),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aseosKeys.all }),
  })
}
