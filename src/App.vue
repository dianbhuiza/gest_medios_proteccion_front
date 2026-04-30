<template>
  <v-app>
    <v-app-bar v-if="!isLoginRoute" color="primary" density="comfortable" flat>
      <v-app-bar-title>Panel de Administración</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid class="py-4">
        <v-card v-if="!isLoginRoute" class="mb-4">
          <v-tabs :model-value="route.path" color="primary" grow>
            <v-tab v-for="tab in tabs" :key="tab.to" :value="tab.to" :to="tab.to">{{ tab.label }}</v-tab>
          </v-tabs>
        </v-card>

        <router-view />
      </v-container>
    </v-main>

    <AppSnackbar
      :visible="uiStore.snackbarVisible"
      :message="uiStore.snackbarMessage"
      :color="uiStore.snackbarColor"
      @update:visible="onSnackbarUpdate"
    />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppSnackbar from '@/shared/components/AppSnackbar.vue'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const uiStore = useUiStore()
const isLoginRoute = computed(() => route.name === 'login')

const tabs = [
  { to: '/trabajadores', label: 'Trabajadores' },
  { to: '/tallas', label: 'Tallas' },
  { to: '/areas', label: 'Áreas' },
  { to: '/cargos', label: 'Cargos' },
  { to: '/epp', label: 'EPP' },
  { to: '/insumos-aseo', label: 'Insumos de Aseo' },
  { to: '/asignaciones-epp', label: 'Asignaciones EPP' },
  { to: '/asignaciones-aseo', label: 'Asignaciones Aseo' },
]

function onSnackbarUpdate(value: boolean) {
  if (!value) {
    uiStore.cerrarMensaje()
  }
}
</script>
