<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      v-if="!isLoginRoute"
      color="surface"
      elevation="0"
      density="comfortable"
      border="b"
    >
      <template #prepend>
        <v-app-bar-nav-icon
          variant="text"
          color="on-surface"
          class="ml-1"
          @click="drawer = !drawer"
        />
        <div class="brand ml-2 d-flex align-center">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L33 10V26L18 34L3 26V10L18 2Z" stroke="#F59E0B" stroke-width="1.5" fill="rgba(245,158,11,0.07)"></path>
            <path d="M18 8L27 13V22L18 27L9 22V13L18 8Z" stroke="#F59E0B" stroke-width="1" stroke-opacity="0.35" fill="none"></path>
            <circle cx="18" cy="18" r="3.5" fill="#F59E0B"></circle>
            <line x1="18" y1="8" x2="18" y2="11.5" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.55"></line>
            <line x1="18" y1="24.5" x2="18" y2="28" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.55"></line>
            <line x1="8.5" y1="12.8" x2="11.5" y2="14.5" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.55"></line>
            <line x1="24.5" y1="21.5" x2="27.5" y2="23.2" stroke="#F59E0B" stroke-width="1.5" stroke-opacity="0.55"></line>
          </svg>
          <div class="brand-text ml-2">
            <div class="brand-name">REFINERÍA</div>
            <div class="brand-sub">SISTEMA DE GESTIÓN</div>
          </div>
        </div>
      </template>
      <template #append>
        <div class="status-indicator mr-4 d-flex align-center" style="gap: 6px">
          <span class="status-dot"></span>
          <span class="status-label">EN LÍNEA</span>
        </div>
      </template>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-if="!isLoginRoute"
      v-model="drawer"
      color="surface"
      :width="240"
      border="e"
    >
      <div class="drawer-accent-line"></div>
      <v-list nav density="compact" class="nav-list pt-3">
        <v-list-item
          v-for="item in standaloneItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.label"
          rounded="lg"
          class="nav-item mb-1"
          active-class="nav-item--active"
        />
        <div class="nav-section-label mt-3 mb-1 px-3">MÓDULOS</div>
        <v-list-group value="epp">
          <template #activator="{ props: groupProps, isOpen }">
            <v-list-item
              v-bind="groupProps"
              prepend-icon="mdi-hard-hat"
              title="EPP"
              rounded="lg"
              class="nav-item mb-1"
              :class="{ 'nav-group--active': isEppActive }"
            >
              <template #append>
                <v-icon size="14" :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" style="opacity: 0.45"></v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list-item to="/epp" prepend-icon="mdi-package-variant-closed" title="Inventario" rounded="lg" class="nav-item nav-item--child mb-1" active-class="nav-item--active" />
          <v-list-item to="/asignaciones-epp" prepend-icon="mdi-clipboard-account" title="Asignaciones" rounded="lg" class="nav-item nav-item--child mb-1" active-class="nav-item--active" />
        </v-list-group>
        <v-list-group value="aseo">
          <template #activator="{ props: groupProps, isOpen }">
            <v-list-item
              v-bind="groupProps"
              prepend-icon="mdi-spray-bottle"
              title="Aseo"
              rounded="lg"
              class="nav-item mb-1"
              :class="{ 'nav-group--active': isAseoActive }"
            >
              <template #append>
                <v-icon size="14" :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" style="opacity: 0.45"></v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list-item to="/insumos-aseo" prepend-icon="mdi-package-variant-closed" title="Inventario" rounded="lg" class="nav-item nav-item--child mb-1" active-class="nav-item--active" />
          <v-list-item to="/asignaciones-aseo" prepend-icon="mdi-clipboard-text" title="Asignaciones" rounded="lg" class="nav-item nav-item--child mb-1" active-class="nav-item--active" />
        </v-list-group>
      </v-list>
      <template #append>
        <div class="drawer-footer px-4 py-3">
          <div class="drawer-footer-text">v1.0</div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main -->
    <v-main>
      <v-container fluid class="py-4">
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSnackbar from '@/shared/components/AppSnackbar.vue'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const uiStore = useUiStore()
const isLoginRoute = computed(() => route.name === 'login')
const drawer = ref(true)

const standaloneItems = [
  { to: '/trabajadores', label: 'Trabajadores', icon: 'mdi-account-group' },
  { to: '/areas', label: 'Áreas', icon: 'mdi-layers-triple' },
  { to: '/cargos', label: 'Cargos', icon: 'mdi-briefcase-variant' },
]

const isEppActive = computed(() =>
  route.path === '/epp' || route.path === '/asignaciones-epp'
)
const isAseoActive = computed(() =>
  route.path === '/insumos-aseo' || route.path === '/asignaciones-aseo'
)

function onSnackbarUpdate(value: boolean) {
  if (!value) uiStore.cerrarMensaje()
}
</script>

<style scoped>
.brand { gap: 0; }
.brand-name {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.2em;
  color: #F59E0B;
  line-height: 1.1;
}
.brand-sub {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.57rem;
  letter-spacing: 0.16em;
  opacity: 0.4;
  line-height: 1;
  color: #CBD5E1;
}
.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34D399;
  box-shadow: 0 0 6px #34D399;
  animation: pulse-dot 2.4s ease-in-out infinite;
}
.status-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  color: #34D399;
  opacity: 0.75;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px #34D399; }
  50% { opacity: 0.5; box-shadow: 0 0 2px #34D399; }
}
.drawer-accent-line {
  height: 2px;
  background: linear-gradient(90deg, #F59E0B 0%, transparent 100%);
  margin-bottom: 4px;
}
.nav-list { padding-left: 8px; padding-right: 8px; }
.nav-item :deep(.v-list-item-title) {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.nav-item :deep(.v-list-item__prepend .v-icon) { opacity: 0.55; font-size: 18px; }
.nav-item--active :deep(.v-list-item__prepend .v-icon) { opacity: 1; color: #F59E0B !important; }
.nav-item--active { background: rgba(245, 158, 11, 0.1) !important; }
.nav-item--active :deep(.v-list-item-title) { color: #F59E0B; }
.nav-group--active :deep(.v-list-item-title) { color: #F59E0B; opacity: 1; }
.nav-group--active :deep(.v-list-item__prepend .v-icon) { opacity: 1; color: #F59E0B !important; }
.nav-item--child { padding-left: 12px !important; }
.nav-item--child :deep(.v-list-item__prepend) { margin-inline-start: 8px !important; }
.nav-section-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: #64748B;
  text-transform: uppercase;
}
.drawer-footer { border-top: 1px solid rgba(30, 45, 64, 1); }
.drawer-footer-text {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: #64748B;
}
</style>