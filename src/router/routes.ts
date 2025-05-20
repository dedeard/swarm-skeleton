import type { RouteObject } from 'react-router-dom'

/**
 * Protected Routes Configuration
 * These routes require authentication
 */
const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('@/pages/root/page'),
    // children: [
    //   // Settings routes
    //   {
    //     path: 'settings',
    //     lazy: () => import('@/pages/home/settings/page'),
    //     children: [
    //       // Default settings page (security)
    //       {
    //         path: '',
    //         lazy: () => import('@/pages/home/settings/security/page'),
    //       },
    //       // Profile settings
    //       {
    //         path: 'profile',
    //         lazy: () => import('@/pages/home/settings/security/page'),
    //       },
    //       // Preferences settings
    //       {
    //         path: 'preferences',
    //         lazy: () => import('@/pages/home/settings/security/page'),
    //       },
    //       // Companies settings
    //       {
    //         path: 'companies',
    //         lazy: () => import('@/pages/home/settings/security/page'),
    //       },
    //     ],
    //   },

    //   // Agents routes
    //   {
    //     path: 'agents',
    //     lazy: () => import('@/pages/home/agents/page'),
    //     children: [
    //       // Create agent
    //       {
    //         path: 'create',
    //         lazy: () => import('@/pages/home/agents/create/page'),
    //       },
    //       // Edit agent
    //       {
    //         path: ':agentId/edit',
    //         lazy: () => import('@/pages/home/agents/edit/page'),
    //       },
    //     ],
    //   },
    // ],
  },
]

export default routes
