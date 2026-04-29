import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface AsignacionAseoItem {
  id?: number
  asignacion_id?: number
  aseo_id: number
  cantidad: number
}

export interface AsignacionAseo {
  id: number
  fecha: string
  trabajador_id: number
  items: AsignacionAseoItem[]
}

export interface AsignacionAseoPayload {
  trabajador_id: number
  fecha?: string
  items?: Array<{
    aseo_id: number
    cantidad: number
  }>
}

export const asignacionesAseoService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<AsignacionAseo>>('/v1/asignaciones-aseo', { params })
    return data
  },
  async create(payload: AsignacionAseoPayload) {
    const { data } = await apiClient.post<AsignacionAseo>('/v1/asignaciones-aseo', payload)
    return data
  },
  async update(id: number, payload: AsignacionAseoPayload) {
    const { data } = await apiClient.put<AsignacionAseo>(`/v1/asignaciones-aseo/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/asignaciones-aseo/${id}`)
  },
}
