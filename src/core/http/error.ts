import axios from 'axios'

import type { ApiErrorNormalized } from '@/core/types/api'

export function normalizeHttpError(error: unknown): ApiErrorNormalized {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data
    const message =
      data?.message || data?.detail || data?.error || error.message || 'Error inesperado de red'

    return {
      message: String(message),
      status,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'Error inesperado' }
}
