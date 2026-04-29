export interface PaginationMeta {
  page: number
  pageSize: number
  totalPages: number
  total: number
}

export interface PaginatedResponse<T> {
  results: T[]
  meta: PaginationMeta
}

export interface ListParams {
  page: number
  pageSize: number
}

export interface ApiErrorNormalized {
  message: string
  status?: number
}
