import type { RouteObject } from 'react-router-dom'

/**
 * Protected Routes Configuration
 * These routes require authentication
 */
const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('@/pages/root/page'),
    children: [
      // Settings routes
      {
        path: 'settings',
        lazy: () => import('@/pages/root/settings/page'),
        children: [
          // Default settings page (security)
          {
            path: '',
            lazy: () => import('@/pages/root/settings/security/page'),
          },
          // Profile settings
          {
            path: 'profile',
            lazy: () => import('@/pages/root/settings/security/page'),
          },
          // Preferences settings
          {
            path: 'preferences',
            lazy: () => import('@/pages/root/settings/security/page'),
          },
          // Companies settings
          {
            path: 'companies',
            lazy: () => import('@/pages/root/settings/security/page'),
          },
        ],
      },

      // Agents routes
      {
        path: 'agents',
        lazy: () => import('@/pages/root/agents/page'),
        children: [
          // Create agent
          {
            path: 'create',
            lazy: () => import('@/pages/root/agents/create/page'),
          },
          // Edit agent
          {
            path: ':agentId/edit',
            lazy: () => import('@/pages/root/agents/edit/page'),
          },
        ],
      },

      // Tools routes
      {
        path: '/tools',
        lazy: () => import('@/pages/root/tools/page'),
        children: [
          // Create tool
          {
            path: 'create',
            lazy: () => import('@/pages/root/tools/create/page'),
          },
          // Edit tool
          {
            path: ':toolId/edit',
            lazy: () => import('@/pages/root/tools/edit/page'),
          },
        ],
      },
    ],
  },
]

export default routes
