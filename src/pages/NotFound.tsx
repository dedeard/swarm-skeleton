import { Button } from '@heroui/button'
import { Link } from 'react-router-dom'

const NotFound: React.FC<{
  message?: null | string
}> = ({ message }) => {
  return (
    <section className="flex h-screen w-full">
      <div className="container flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-[100px] font-bold leading-none tracking-wide md:text-[150px]">
            <span className="text-primary-600">4</span>
            <span>0</span>
            <span className="text-primary-600">4</span>
          </h1>
          <h2 className="text-2xl font-light tracking-wide text-gray-800 md:text-4xl">Page Not Found</h2>
          <p className="mb-5 text-sm md:text-base">{message || 'The page you requested was not found.'}</p>
          <div className="flex justify-center">
            <Button as={Link} className="px-6" color="primary" to="/">
              Back To Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
