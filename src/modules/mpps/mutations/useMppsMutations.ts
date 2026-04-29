import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { type MppPayload, mppsService, type MppStockMovementPayload } from '@/modules/mpps/api/mpps.service'
import { mppsKeys } from '@/modules/mpps/queries/useMppsQueries'

export function useCreateMppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MppPayload) => mppsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}

export function useUpdateMppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MppPayload }) => mppsService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}

export function useDeleteMppMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => mppsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}

export function useSetMppStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mppId, tallaId, cantidad }: { mppId: number; tallaId: number; cantidad: number }) =>
      mppsService.setStock(mppId, tallaId, cantidad),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}

export function useRemoveMppStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mppId, tallaId }: { mppId: number; tallaId: number }) =>
      mppsService.removeStock(mppId, tallaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}

export function useIngresoMppStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mppId, payload }: { mppId: number; payload: MppStockMovementPayload }) =>
      mppsService.ingresoStock(mppId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}

export function useRetiroMppStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mppId, payload }: { mppId: number; payload: MppStockMovementPayload }) =>
      mppsService.retiroStock(mppId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mppsKeys.all }),
  })
}
