import { useMutation, useQueryClient } from '@tanstack/vue-query'

import {
  asignacionesAseoService,
  type AsignacionAseoPayload,
} from '@/modules/asignaciones-aseo/api/asignaciones-aseo.service'
import { asignacionesAseoKeys } from '@/modules/asignaciones-aseo/queries/useAsignacionesAseoQueries'

export function useCreateAsignacionAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AsignacionAseoPayload) => asignacionesAseoService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asignacionesAseoKeys.all })
      queryClient.invalidateQueries({ queryKey: ['aseos'] })
    },
  })
}

export function useUpdateAsignacionAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AsignacionAseoPayload }) =>
      asignacionesAseoService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asignacionesAseoKeys.all })
      queryClient.invalidateQueries({ queryKey: ['aseos'] })
    },
  })
}

export function useDeleteAsignacionAseoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => asignacionesAseoService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asignacionesAseoKeys.all })
      queryClient.invalidateQueries({ queryKey: ['aseos'] })
    },
  })
}
