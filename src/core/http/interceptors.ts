import type { AxiosInstance } from 'axios'
import type { Router } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'

interface RetryableRequestConfig {
  _retry?: boolean
  skipAuthRefresh?: boolean
  url?: string
}

let refreshPromise: Promise<boolean> | null = null
let routerInstance: Router | null = null

export function setRouter(router: Router) {
  routerInstance = router
}

function shouldSkipAuthHandling(url?: string) {
  return Boolean(url && /\/v1\/auth\/(signin|refresh|validate)/.test(url))
}

function redirectToLogin() {
  const authStore = useAuthStore()
  authStore.setAnonymous()

  if (!routerInstance) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      const redirect = `${window.location.pathname}${window.location.search}`
      window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`)
    }
    return
  }

  if (routerInstance.currentRoute.value.path === '/login') {
    return
  }

  const redirect = routerInstance.currentRoute.value.fullPath
  routerInstance.push({
    name: 'login',
    query: { redirect },
  })
}

async function refreshAccessToken(client: AxiosInstance) {
  if (!refreshPromise) {
    refreshPromise = client
      .post('/v1/auth/refresh')
      .then((response) => {
        const authStore = useAuthStore()
        authStore.setAuthenticated(response.data)
        return true
      })
      .catch(() => {
        redirectToLogin()
        return false
      })
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
      }

      return Promise.reject(error)
    },
  )
}