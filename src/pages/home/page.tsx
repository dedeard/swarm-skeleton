import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

export const Component: React.FC = () => {
  return (
    <>
      <Outlet />
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">This is a simple home page</p>
      </div>
    </>
  )
}

export default Component
