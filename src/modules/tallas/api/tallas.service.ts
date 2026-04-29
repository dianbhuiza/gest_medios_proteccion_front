import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface Talla {
  id: number
  valor: string
  tipo: string
  orden: number
}

export interface TallaPayload {
  valor: string
  tipo: string
  orden: number
}

export const tallasService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<Talla>>('/v1/tallas', { params })
    return data
  },
  async create(payload: TallaPayload) {
    const { data } = await apiClient.post<Talla>('/v1/tallas', payload)
    return data
  },
  async update(id: number, payload: TallaPayload) {
    const { data } = await apiClient.put<Talla>(`/v1/tallas/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/tallas/${id}`)
  },
}
