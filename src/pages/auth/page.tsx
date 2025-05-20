import ThemeToggle from '@/components/layouts/ThemeToggle'
import Squares from '@/components/ui/Squaress'
import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import authConfig from '@/config/auth.config'
import Message from './components/Message'
import SSOButton from './components/SSOButton'

export const Component: React.FC = () => {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        style={{
          backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(0, 90, 45, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(0, 60, 30, 0.15) 0%, transparent 70%)`,
        }}
      />
      <div className="fixed top-0 z-50 hidden w-full p-3 md:block">
        <div className="container mx-auto flex justify-between py-3">
          <h1 className="flex">
            <div className="flex items-center">
              <span className="text-2xl font-bold leading-3">SWARM</span>
            </div>
          </h1>
          <ThemeToggle />
        </div>
      </div>
      <Squares className="fixed top-0 z-10 h-screen w-full opacity-10" borderColor="#2cad3b" squareSize={500} speed={0.1} />
      <div className="relative top-0 flex min-h-screen w-full flex-col justify-center">
        <div className="relative z-10 flex items-center justify-center px-4 py-24">
          <div className="w-full max-w-md space-y-8 text-center">
            <Message />

            <div className="backdrop-blur-xs flex flex-col gap-8 rounded-lg border border-primary-500/10 p-6 transition-colors hover:border-primary-500/30">
              <p>
                <SwarmTextGradient>Sign up</SwarmTextGradient> or <SwarmTextGradient>login</SwarmTextGradient> using
              </p>

              <div className="grid grid-cols-1 justify-center gap-3 md:flex md:grid-cols-2">
                {authConfig.providers.map((provider) => (
                  <SSOButton key={provider.provider} {...provider} />
                ))}
              </div>

              <p className="text-xs">
                By using <SwarmTextGradient>SWARM</SwarmTextGradient>, you agree to our{' '}
                <a href="/terms" className="text-primary-500 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary-500 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
