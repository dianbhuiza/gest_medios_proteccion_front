import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { tallasService, type TallaPayload } from '@/modules/tallas/api/tallas.service'
import { tallasKeys } from '@/modules/tallas/queries/useTallasQueries'

export function useCreateTallaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TallaPayload) => tallasService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tallasKeys.all }),
  })
}

export function useUpdateTallaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TallaPayload }) =>
      tallasService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tallasKeys.all }),
  })
}

export function useDeleteTallaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tallasService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tallasKeys.all }),
  })
}
