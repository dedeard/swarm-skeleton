import type { RouteObject } from 'react-router-dom'

/**
 * Settings route configuration
 */
const settingsRoutes: RouteObject[] = [
  {
    path: '',
    lazy: () => import('@/pages/root/settings/security/page'),
  },
  {
    path: 'profile',
    lazy: () => import('@/pages/root/settings/security/page'),
  },
  {
    path: 'preferences',
    lazy: () => import('@/pages/root/settings/security/page'),
  },
  {
    path: 'companies',
    lazy: () => import('@/pages/root/settings/security/page'),
  },
]

/**
 * Agents route configuration
 */
const agentsRoutes: RouteObject[] = [
  {
    path: 'create',
    lazy: () => import('@/pages/root/agents/create/page'),
  },
  {
    path: ':agentId/edit',
    lazy: () => import('@/pages/root/agents/edit/page'),
  },
]

/**
 * Tools route configuration
 */
const toolsRoutes: RouteObject[] = [
  {
    path: 'create',
    lazy: () => import('@/pages/root/tools/create/page'),
  },
  {
    path: ':toolId/edit',
    lazy: () => import('@/pages/root/tools/edit/page'),
  },
]

/**
 * Protected Routes Configuration
 * These routes require authentication
 */
const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('@/pages/root/page'),
    children: [
      {
        path: 'settings',
        lazy: () => import('@/pages/root/settings/page'),
        children: settingsRoutes,
      },
      {
        path: 'agents',
        lazy: () => import('@/pages/root/agents/page'),
        children: agentsRoutes,
      },
      {
        path: 'tools',
        lazy: () => import('@/pages/root/tools/page'),
        children: toolsRoutes,
      },
    ],
  },
]

export default routes
