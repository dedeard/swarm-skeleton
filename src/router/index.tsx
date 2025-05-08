import AuthChecker from '@/pages/AuthChecker'
import ErrorBoundary from '@/pages/ErrorBoundary'
import NotFound from '@/pages/NotFound'
import { Providers } from '@/pages/Providers'
import { createBrowserRouter } from 'react-router-dom'
import routes from './routes'

const router = createBrowserRouter([
  {
    children: [
      {
        children: routes,
        element: <AuthChecker private />,
      },
      {
        children: [{ path: '/auth', lazy: () => import('@/pages/auth/page') }],
        element: <AuthChecker guest />,
      },
      {
        element: <NotFound />,
        path: '*',
      },
    ],
    element: <Providers />,
    errorElement: <ErrorBoundary />,
  },
])

export default router
