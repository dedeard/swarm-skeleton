import { Button } from '@heroui/button'
import { Link, useRouteError } from 'react-router-dom'

const ErrorBoundary: React.FC = () => {
  const error: any = useRouteError()

  const code = error.response?.status || error.status || 500
  const message = error.message || 'An error occurred.'

  let errorStatus
  switch (code) {
    case 400:
      errorStatus = 'Bad Request'
      break
    case 404:
      errorStatus = 'Page Not Found'
      break
    case 410:
      errorStatus = 'Gone'
      break
    default:
      errorStatus = 'Something Went Wrong'
  }

  if (import.meta.env.MODE === 'development') {
    console.log('Error Boundary :', error)
  }

  return (
    <>
      <section className="flex h-[calc(100vh-64px)]">
        <div className="container flex items-center justify-center">
          <div className="text-center">
            <h1 className="mb-2 text-[100px] font-bold leading-none tracking-wide md:text-[150px]">
              <HttpStatusCode code={code} />
            </h1>
            <h2 className="text-2xl font-light tracking-wide text-gray-800 md:text-4xl">Oops! {errorStatus}</h2>
            <p className="mb-5 text-sm md:text-base">{message}</p>
            <div className="flex justify-center">
              {code === 404 ? (
                <Button as={Link} className="px-6" color="primary" to="/">
                  Back To Home
                </Button>
              ) : (
                <Button type="button" className="w-32" color="primary" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const HttpStatusCode: React.FC<{
  code: number
}> = ({ code }) => {
  const firstDigit = Math.floor(code / 100)
  const secondDigit = Math.floor((code % 100) / 10)
  const thirdDigit = code % 10

  return (
    <>
      <span className="text-primary-600">{firstDigit}</span>
      <span>{secondDigit}</span>
      <span className="text-primary-600">{thirdDigit}</span>
    </>
  )
}

export default ErrorBoundary
