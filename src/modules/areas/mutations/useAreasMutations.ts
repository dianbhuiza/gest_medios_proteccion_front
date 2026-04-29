import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { areasService, type AreaPayload } from '@/modules/areas/api/areas.service'
import { areasKeys } from '@/modules/areas/queries/useAreasQueries'

export function useCreateAreaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AreaPayload) => areasService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areasKeys.all }),
  })
}

export function useUpdateAreaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AreaPayload }) => areasService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areasKeys.all }),
  })
}

export function useDeleteAreaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => areasService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areasKeys.all }),
  })
}
