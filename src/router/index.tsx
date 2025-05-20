import AuthChecker from '@/pages/AuthChecker'
import ErrorBoundary from '@/pages/ErrorBoundary'
import NotFound from '@/pages/NotFound'
import { Providers } from '@/pages/Providers'
import { createBrowserRouter } from 'react-router-dom'
import routes from './routes'

/**
 * Application Router Configuration
 * Defines the routing structure of the application
 */
const router = createBrowserRouter([
  {
    // Root element with providers
    element: <Providers />,
    errorElement: <ErrorBoundary />,
    children: [
      // Protected routes (require authentication)
      {
        element: <AuthChecker private />,
        children: routes,
      },

      // Guest routes (require no authentication)
      {
        element: <AuthChecker guest />,
        children: [
          {
            path: '/auth',
            lazy: () => import('@/pages/auth/page'),
          },
        ],
      },

      // Catch-all route for 404
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

export default router
