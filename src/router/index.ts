import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/trabajadores' },
    {
      path: '/trabajadores',
      name: 'trabajadores',
      component: () => import('@/modules/trabajadores/views/TrabajadoresView.vue'),
    },
    {
      path: '/tallas',
      name: 'tallas',
      component: () => import('@/modules/tallas/views/TallasView.vue'),
    },
    {
      path: '/areas',
      name: 'areas',
      component: () => import('@/modules/areas/views/AreasView.vue'),
    },
    {
      path: '/cargos',
      name: 'cargos',
      component: () => import('@/modules/cargos/views/CargosView.vue'),
    },
    {
      path: '/epp',
      name: 'epp',
      component: () => import('@/modules/mpps/views/MppsView.vue'),
    },
    {
      path: '/insumos-aseo',
      name: 'insumos-aseo',
      component: () => import('@/modules/aseos/views/AseosView.vue'),
    },
    {
      path: '/asignaciones-epp',
      name: 'asignaciones-epp',
      component: () => import('@/modules/asignaciones-mpp/views/AsignacionesMppView.vue'),
    },
    {
      path: '/asignaciones-aseo',
      name: 'asignaciones-aseo',
      component: () => import('@/modules/asignaciones-aseo/views/AsignacionesAseoView.vue'),
    },
  ],
})

export default router
