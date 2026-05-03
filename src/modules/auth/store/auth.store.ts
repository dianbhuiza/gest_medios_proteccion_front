import { defineStore } from 'pinia'

import { authService, type AuthSession, type SignInPayload } from '@/modules/auth/api/auth.service'

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous'

const STORAGE_KEY = 'auth_state'

interface PersistedState {
  status: AuthStatus
  session: AuthSession | null
}

function loadPersistedState(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.status === 'authenticated' && parsed.session) {
        return parsed
      }
    }
  } catch {
    // ignore
  }
  return { status: 'unknown', session: null }
}

function savePersistedState(state: PersistedState) {
  if (state.status === 'authenticated' && state.session) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }
}

function clearPersistedState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

interface AuthState {
  status: AuthStatus
  session: AuthSession | null
}

let ensureSessionPromise: Promise<boolean> | null = null

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const persisted = loadPersistedState()
    return {
      status: persisted.status,
      session: persisted.session,
    }
  },
  getters: {
    isAuthenticated: (state) => state.status === 'authenticated',
  },
  actions: {
    setAuthenticated(session: AuthSession) {
      this.session = session
      this.status = 'authenticated'
      savePersistedState({ status: 'authenticated', session })
    },
    setAnonymous() {
      this.session = null
      this.status = 'anonymous'
      clearPersistedState()
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
