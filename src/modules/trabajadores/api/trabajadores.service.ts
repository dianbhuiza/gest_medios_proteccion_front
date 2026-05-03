import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface Trabajador {
  id: number
  nombre: string
  sub_area_id: number
  cargo_id: number
  talla_overol_id: number
  talla_botas_id: number
}

export interface TrabajadorPayload {
  nombre: string
  sub_area_id: number
  cargo_id: number
  talla_overol_id: number
  talla_botas_id: number
}

export const trabajadoresService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<Trabajador>>('/v1/trabajadores', { params })
    return data
  },
  async create(payload: TrabajadorPayload) {
    const { data } = await apiClient.post<Trabajador>('/v1/trabajadores', payload)
    return data
  },
  async update(id: number, payload: TrabajadorPayload) {
    const { data } = await apiClient.put<Trabajador>(`/v1/trabajadores/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/trabajadores/${id}`)
  },
}
