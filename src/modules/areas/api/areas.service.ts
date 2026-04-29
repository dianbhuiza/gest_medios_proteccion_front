import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface Area {
  id: number
  nombre: string
}

export interface AreaPayload {
  nombre: string
}

export const areasService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<Area>>('/v1/areas', { params })
    return data
  },
  async create(payload: AreaPayload) {
    const { data } = await apiClient.post<Area>('/v1/areas', payload)
    return data
  },
  async update(id: number, payload: AreaPayload) {
    const { data } = await apiClient.put<Area>(`/v1/areas/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/areas/${id}`)
  },
}
