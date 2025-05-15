import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import '@/styles/globals.css'
import Boot from './boot'
import router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Boot>
      <RouterProvider router={router} />
    </Boot>
    {/* <div
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{
        backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(0, 90, 45, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(0, 60, 30, 0.15) 0%, transparent 70%)`,
      }}
    /> */}
  </React.StrictMode>,
)
