import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface AsignacionMppItem {
  id?: number
  asignacion_id?: number
  mpp_id: number
  talla_id: number
}

export interface AsignacionMpp {
  id: number
  fecha: string
  trabajador_id: number
  items: AsignacionMppItem[]
}

export interface AsignacionMppPayload {
  trabajador_id: number
  fecha?: string
  items?: Array<{
    mpp_id: number
    talla_id: number
  }>
}

export const asignacionesMppService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<AsignacionMpp>>('/v1/asignaciones-mpp', { params })
    return data
  },
  async create(payload: AsignacionMppPayload) {
    const { data } = await apiClient.post<AsignacionMpp>('/v1/asignaciones-mpp', payload)
    return data
  },
  async update(id: number, payload: AsignacionMppPayload) {
    const { data } = await apiClient.put<AsignacionMpp>(`/v1/asignaciones-mpp/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/asignaciones-mpp/${id}`)
  },
}
