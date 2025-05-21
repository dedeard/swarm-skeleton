import { ChatProvider } from '@/contexts/ChatContext'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from './components/Layout'

export const Component: React.FC = () => {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[5] h-full w-full opacity-50"
        style={{
          backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(0, 90, 45, 0.2) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(0, 60, 30, 0.15) 0%, transparent 70%)`,
        }}
      />

      <ChatProvider>
        <Outlet />

        <Layout></Layout>
      </ChatProvider>
    </>
  )
}
