import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router'
import { guards as baseGuards, RouteGuard } from './guards'
import { routes as baseRoutes } from './routes'

export let router: Router | null = null

/**
 * Function to create the router by combining base routes and guards with app specific routes and guards.
 * If the router instance exists, just return it.
 **/
export function getOrCreateRouter(
  routes: RouteRecordRaw[] = [],
  guards: RouteGuard[] = []
) {
  if (router) return router

  router = createRouter({
    history: createWebHistory(),
    routes: [...baseRoutes, ...routes],
  })

  const allGuards = [...baseGuards, ...guards]

  allGuards.forEach((guard) => {
    router!.beforeEach(async (to, from, next) => {
      const activatedRouteGuard = await guard(to, from, next)
      activatedRouteGuard ? next(activatedRouteGuard) : next()
    })
  })

  return router
}
