import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface Aseo {
  id: number
  nombre: string
  cantidad: number
}

export interface AseoPayload {
  nombre: string
  cantidad: number
}

export const aseosService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<Aseo>>('/v1/aseos', { params })
    return data
  },
  async create(payload: AseoPayload) {
    const { data } = await apiClient.post<Aseo>('/v1/aseos', payload)
    return data
  },
  async update(id: number, payload: AseoPayload) {
    const { data } = await apiClient.put<Aseo>(`/v1/aseos/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/aseos/${id}`)
  },
  async ingresoCantidad(id: number, cantidad: number) {
    const { data } = await apiClient.post<Aseo>(`/v1/aseos/${id}/ingresos-cantidad`, { cantidad })
    return data
  },
  async retiroCantidad(id: number, cantidad: number) {
    const { data } = await apiClient.post<Aseo>(`/v1/aseos/${id}/retiros-cantidad`, { cantidad })
    return data
  },
}
