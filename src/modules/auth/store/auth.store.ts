import { defineStore } from 'pinia'

import { authService, type AuthSession, type SignInPayload } from '@/modules/auth/api/auth.service'

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous'

interface AuthState {
  status: AuthStatus
  session: AuthSession | null
}

let ensureSessionPromise: Promise<boolean> | null = null

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    status: 'unknown',
    session: null,
  }),
  getters: {
    isAuthenticated: (state) => state.status === 'authenticated',
  },
  actions: {
    setAuthenticated(session: AuthSession) {
      this.session = session
      this.status = 'authenticated'
    },
    setAnonymous() {
      this.session = null
      this.status = 'anonymous'
    },
    async signIn(payload: SignInPayload) {
      const session = await authService.signIn(payload)
      this.setAuthenticated(session)
      return session
    },
    async validateSession() {
      const result = await authService.validate()
      if (result.valido) {
        this.setAuthenticated({
          token_type: 'bearer',
          usuario_id: result.usuario_id,
          credencial: result.credencial,
        })
        return true
      }

      this.setAnonymous()
      return false
    },
    async refreshSession() {
      const session = await authService.refresh()
      this.setAuthenticated(session)
      return true
    },
    async ensureSession() {
      if (this.isAuthenticated) {
        return true
      }

      if (this.status === 'anonymous') {
        return false
      }

      if (ensureSessionPromise) {
        return ensureSessionPromise
      }

      ensureSessionPromise = (async () => {
        let valid = false

        try {
          valid = await this.validateSession()
        } catch {
          valid = false
        }

        if (valid) {
          return true
        }

        try {
          return await this.refreshSession()
        } catch {
          this.setAnonymous()
          return false
        } finally {
          ensureSessionPromise = null
        }
      })()

      return ensureSessionPromise
    },
  },
})
