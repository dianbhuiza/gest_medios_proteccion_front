import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { areasService, type AreaPayload, type SubAreaPayload } from '@/modules/areas/api/areas.service'
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

export function useCreateSubAreaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ areaId, payload }: { areaId: number; payload: SubAreaPayload }) =>
      areasService.createSubArea(areaId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areasKeys.all }),
  })
}

export function useUpdateSubAreaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      areaId,
      subAreaId,
      payload,
    }: {
      areaId: number
      subAreaId: number
      payload: SubAreaPayload
    }) => areasService.updateSubArea(areaId, subAreaId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areasKeys.all }),
  })
}

export function useDeleteSubAreaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ areaId, subAreaId }: { areaId: number; subAreaId: number }) =>
      areasService.removeSubArea(areaId, subAreaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: areasKeys.all }),
  })
}
