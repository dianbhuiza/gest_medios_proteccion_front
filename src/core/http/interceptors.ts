import type { AxiosInstance, AxiosRequestConfig } from 'axios'

interface RetryableRequestConfig {
  _retry?: boolean
  skipAuthRefresh?: boolean
  url?: string
}

let refreshPromise: Promise<boolean> | null = null

function shouldSkipAuthHandling(url?: string) {
  return Boolean(url && /\/v1\/auth\/(signin|refresh|validate)/.test(url))
}

function redirectToLogin() {
  if (typeof window === 'undefined') {
    return
  }

  if (window.location.pathname === '/login') {
    return
  }

  const redirect = `${window.location.pathname}${window.location.search}`
  window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`)
}

async function refreshAccessToken(client: AxiosInstance) {
  if (!refreshPromise) {
    const refreshConfig: AxiosRequestConfig & RetryableRequestConfig = {
      skipAuthRefresh: true,
    }

    refreshPromise = client
      .post('/v1/auth/refresh', undefined, refreshConfig)
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export function registerInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status
      const requestConfig = (error.config ?? {}) as RetryableRequestConfig

      if (status === 401 && !requestConfig.skipAuthRefresh && !requestConfig._retry && !shouldSkipAuthHandling(requestConfig.url)) {
        requestConfig._retry = true

        const refreshed = await refreshAccessToken(client)
        if (refreshed) {
          return client(requestConfig)
        }

        redirectToLogin()
      }

      return Promise.reject(error)
    },
  )
}