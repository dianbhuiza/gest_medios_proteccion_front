import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export type MppTipoTalla = 'overol' | 'botas' | 'sin_talla'

export interface Mpp {
  id: number
  nombre: string
  tipo_talla: MppTipoTalla
}

export interface MppPayload {
  nombre: string
  tipo_talla: MppTipoTalla
}

export interface MppStock {
  mpp_id: number
  talla_id: number
  cantidad: number
}

export interface MppStockMovementPayload {
  stocks: Array<{
    talla_id: number
    cantidad: number
  }>
}

export const mppsService = {
  async list(params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<Mpp>>('/v1/mpps', { params })
    return data
  },
  async create(payload: MppPayload) {
    const { data } = await apiClient.post<Mpp>('/v1/mpps', payload)
    return data
  },
  async update(id: number, payload: MppPayload) {
    const { data } = await apiClient.put<Mpp>(`/v1/mpps/${id}`, payload)
    return data
  },
  async remove(id: number) {
    await apiClient.delete(`/v1/mpps/${id}`)
  },
  async listStocks(mppId: number, params: ListParams) {
    const { data } = await apiClient.get<PaginatedResponse<MppStock>>(`/v1/mpps/${mppId}/stocks`, { params })
    return data
  },
  async setStock(mppId: number, tallaId: number, cantidad: number) {
    const { data } = await apiClient.put<MppStock>(`/v1/mpps/${mppId}/stocks/${tallaId}`, {
      talla_id: tallaId,
      cantidad,
    })
    return data
  },
  async removeStock(mppId: number, tallaId: number) {
    await apiClient.delete(`/v1/mpps/${mppId}/stocks/${tallaId}`)
  },
  async ingresoStock(mppId: number, payload: MppStockMovementPayload) {
    const { data } = await apiClient.post<PaginatedResponse<MppStock>>(`/v1/mpps/${mppId}/ingresos-stock`, payload)
    return data
  },
  async retiroStock(mppId: number, payload: MppStockMovementPayload) {
    const { data } = await apiClient.post<PaginatedResponse<MppStock>>(`/v1/mpps/${mppId}/retiros-stock`, payload)
    return data
  },
}
