import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import '@/styles/globals.css'
import Boot from './boot'
import router from './router'

/**
 * Application Entry Point
 * Renders the root component with providers
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Boot>
    <RouterProvider router={router} />
  </Boot>,
)
