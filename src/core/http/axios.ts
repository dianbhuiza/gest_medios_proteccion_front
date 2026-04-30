import axios from 'axios'

import { registerInterceptors } from './interceptors'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

registerInterceptors(apiClient)