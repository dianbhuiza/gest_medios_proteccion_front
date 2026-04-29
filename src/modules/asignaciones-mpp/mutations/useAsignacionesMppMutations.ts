import { useMutation, useQueryClient } from '@tanstack/vue-query'

import {
  asignacionesMppService,
  type AsignacionMppPayload,
} from '@/modules/asignaciones-mpp/api/asignaciones-mpp.service'
import { asignacionesMppKeys } from '@/modules/asignaciones-mpp/queries/useAsignacionesMppQueries'

export function useCreateAsignacionMppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AsignacionMppPayload) => asignacionesMppService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asignacionesMppKeys.all })
      queryClient.invalidateQueries({ queryKey: ['mpps'] })
    },
  })
}

export function useUpdateAsignacionMppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AsignacionMppPayload }) =>
      asignacionesMppService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asignacionesMppKeys.all })
      queryClient.invalidateQueries({ queryKey: ['mpps'] })
    },
  })
}

export function useDeleteAsignacionMppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => asignacionesMppService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asignacionesMppKeys.all })
      queryClient.invalidateQueries({ queryKey: ['mpps'] })
    },
  })
}
