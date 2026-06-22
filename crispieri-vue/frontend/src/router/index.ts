import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'cotizador',
      component: () => import('@/views/public/CotizadorView.vue'),
    },
    {
      path: '/admin',
      name: 'dashboard',
      component: () => import('@/views/admin/DashboardView.vue'),
    },
    {
      path: '/admin/quote/:id',
      name: 'quote-detail',
      component: () => import('@/views/admin/QuoteDetailView.vue'),
    },
    {
      path: '/admin/catalog',
      name: 'catalog',
      component: () => import('@/views/admin/CatalogView.vue'),
    },
  ],
})

export default router
