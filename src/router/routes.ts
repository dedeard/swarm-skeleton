import type { RouteObject } from 'react-router-dom'

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('@/pages/home/page'),
    children: [
      {
        path: 'settings',
        lazy: () => import('@/pages/home/settings/page'),
        children: [
          {
            path: '',
            lazy: () => import('@/pages/home/settings/security/page'),
          },
          {
            path: 'profile',
            lazy: () => import('@/pages/home/settings/security/page'),
          },
          {
            path: 'preferences',
            lazy: () => import('@/pages/home/settings/security/page'),
          },
          {
            path: 'companies',
            lazy: () => import('@/pages/home/settings/security/page'),
          },
        ],
      },
      {
        path: 'agents',
        lazy: () => import('@/pages/home/agents/page'),
        children: [
          {
            path: 'create',
            lazy: () => import('@/pages/home/agents/create/page'),
          },
          {
            path: ':agentId/edit',
            lazy: () => import('@/pages/home/agents/edit/page'),
          },
        ],
      },
    ],
  },
]

export default routes
