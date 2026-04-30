<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" width="100%" max-width="440" rounded="xl" elevation="4">
      <v-card-title class="text-h5 font-weight-bold mb-1">Iniciar sesion</v-card-title>
      <v-card-subtitle class="mb-4">Ingresa tus credenciales para continuar</v-card-subtitle>

      <v-form @submit.prevent="onSubmit">
        <v-text-field
          v-model="credencial"
          label="Usuario o correo"
          autocomplete="username"
          :disabled="isLoading"
          required
          class="mb-3"
        />

        <v-text-field
          v-model="password"
          label="Contrasena"
          type="password"
          autocomplete="current-password"
          :disabled="isLoading"
          required
          class="mb-6"
        />

        <v-btn type="submit" color="primary" size="large" block :loading="isLoading">Entrar</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { normalizeHttpError } from '@/core/http/error'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const credencial = ref('')
const password = ref('')
const isLoading = ref(false)

async function onSubmit() {
  if (!credencial.value || !password.value || isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    await authStore.signIn({
      credencial: credencial.value,
      password: password.value,
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/trabajadores'
    await router.replace(redirect)
  } catch (error) {
    const normalized = normalizeHttpError(error)
    uiStore.mostrarMensaje(normalized.message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
