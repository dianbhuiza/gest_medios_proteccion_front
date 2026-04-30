import { apiClient } from '@/core/http/axios'

export interface SignInPayload {
  credencial: string
  password: string
}

export interface AuthSession {
  usuario_id: number
  credencial: string
  token_type: string
}

export interface ValidateResponse {
  valido: boolean
  usuario_id: number
  credencial: string
}

export const authService = {
  async signIn(payload: SignInPayload) {
    const { data } = await apiClient.post<AuthSession>('/v1/auth/signin', payload)
    return data
  },
  async refresh() {
    const { data } = await apiClient.post<AuthSession>('/v1/auth/refresh')
    return data
  },
  async validate() {
    const { data } = await apiClient.get<ValidateResponse>('/v1/auth/validate')
    return data
  },
}
