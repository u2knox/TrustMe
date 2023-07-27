import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/repo/:owner/:name',
      name: 'repository',
      props: true,
      component: () => import('@/views/RepoView.vue')
    },
  ]
})

export default router
