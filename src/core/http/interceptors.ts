import type { AxiosInstance } from 'axios'

export function registerInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      return Promise.reject(error)
    },
  )
}