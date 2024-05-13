import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      hasAuthGuard: true,
      title: 'Home',
      hasRibbon: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@shared/pages/account/Login.vue'),
    meta: {
      title: 'Login',
      hasLoggedOutGuard: true,
      redirectAfterLogin: 'Home',
      disablePasswordReset: true,
    },
  },
]
