import { apiClient } from '@/core/http/axios'
import type { ListParams, PaginatedResponse } from '@/core/types/api'

export interface SubArea {
  id: number
  nombre: string
  area_id: number
  area_nombre?: string
}

export interface Area {
  id: number
  nombre: string
  sub_areas: SubArea[]
}

export interface AreaPayload {
  nombre: string
}

export type SubAreaPayload = AreaPayload

export interface SubAreasListParams extends ListParams {
  search?: string
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

  async createSubArea(areaId: number, payload: SubAreaPayload) {
    const { data } = await apiClient.post<SubArea>(`/v1/areas/${areaId}/subareas`, payload)
    return data
  },
  async listSubAreas(params: SubAreasListParams) {
    const { data } = await apiClient.get<PaginatedResponse<SubArea>>('/v1/areas/subareas', { params })
    return data
  },
  async updateSubArea(areaId: number, subAreaId: number, payload: SubAreaPayload) {
    const { data } = await apiClient.put<SubArea>(`/v1/areas/${areaId}/subareas/${subAreaId}`, payload)
    return data
  },
  async removeSubArea(areaId: number, subAreaId: number) {
    await apiClient.delete(`/v1/areas/${areaId}/subareas/${subAreaId}`)
  },
}
