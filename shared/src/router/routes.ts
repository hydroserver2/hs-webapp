import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/:catchAll(.*)*',
    name: 'PageNotFound',
    component: () => import('../pages/PageNotFound.vue'),
    meta: { title: 'Page Not Found' },
  },
]
