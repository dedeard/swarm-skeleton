import React from 'react'
import Layout from './components/Layout'

export const Component: React.FC = () => {
  return (
    <Layout>
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to the Root Page</h1>
      </div>
    </Layout>
  )
}
