import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface Cargo {
  id: number
  nombre: string
}

export interface CargoPayload {
  nombre: string
}

export const cargosService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<Cargo>>('/v1/cargos', { params })
    return data
  },
  async create(payload: CargoPayload) {
    const { data } = await apiClient.post<Cargo>('/v1/cargos', payload)
    return data
  },
  async update(id: number, payload: CargoPayload) {
    const { data } = await apiClient.put<Cargo>(`/v1/cargos/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/cargos/${id}`)
  },
}
