import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success' as 'success' | 'error' | 'warning' | 'info',
  }),
  actions: {
    mostrarMensaje(message: string, color: 'success' | 'error' | 'warning' | 'info' = 'success') {
      this.snackbarMessage = message
      this.snackbarColor = color
      this.snackbarVisible = true
    },
    cerrarMensaje() {
      this.snackbarVisible = false
    },
  },
})
