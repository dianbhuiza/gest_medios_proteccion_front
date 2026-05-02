import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/modules/auth/store/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/trabajadores' },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/trabajadores',
      name: 'trabajadores',
      component: () => import('@/modules/trabajadores/views/TrabajadoresView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/areas',
      name: 'areas',
      component: () => import('@/modules/areas/views/AreasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cargos',
      name: 'cargos',
      component: () => import('@/modules/cargos/views/CargosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/epp',
      name: 'epp',
      component: () => import('@/modules/mpps/views/MppsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/insumos-aseo',
      name: 'insumos-aseo',
      component: () => import('@/modules/aseos/views/AseosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/asignaciones-epp',
      name: 'asignaciones-epp',
      component: () => import('@/modules/asignaciones-mpp/views/AsignacionesMppView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/asignaciones-aseo',
      name: 'asignaciones-aseo',
      component: () => import('@/modules/asignaciones-aseo/views/AsignacionesAseoView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const isPublicRoute = to.matched.some((record) => record.meta.public === true)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true)

  if (isPublicRoute) {
    if (to.name === 'login') {
      const hasSession = await authStore.ensureSession()
      if (hasSession) {
        const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/trabajadores'
        return redirect
      }
    }

    return true
  }

  if (requiresAuth) {
    const hasSession = await authStore.ensureSession()
    if (!hasSession) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }
  }

  return true
})

export default router
