import { useAuthStore } from '@/store/auth.store'
import { Spinner } from '@heroui/spinner'
import { Provider } from '@supabase/supabase-js'
import { useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

type SSOButtonProps = {
  icon: React.ElementType
  label: string
  provider: string
}

const SSOButton: React.FC<SSOButtonProps> = ({ icon: Icon, label, provider }) => {
  const [loading, setLoading] = useState(false)
  const auth = useAuthStore()

  const isLastUsed = auth.lastAuthedUser?.app_metadata?.provider === provider
  const avatar = auth.lastAuthedUser?.user_metadata?.picture || ''

  const handleClick = async () => {
    setLoading(true)
    try {
      await auth.signInWithProvider(provider as Provider)
    } catch {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={twMerge(
        'relative flex w-full cursor-pointer items-center justify-start overflow-hidden rounded-xl border border-primary-500/10 transition duration-300 hover:scale-110 hover:border-primary-500 hover:bg-primary-500/10 md:flex-col md:justify-center md:py-3',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
        loading && 'cursor-default',
        isLastUsed && 'border-primary-500 bg-primary-500/10',
      )}
      onClick={handleClick}
      disabled={loading}
      aria-label={`Sign in with ${label}`}
      aria-disabled={loading}
      title={`Sign in with ${label}`}
    >
      {isLastUsed && avatar && (
        <img
          src={avatar}
          alt="Avatar"
          className="absolute bottom-1 right-1 block h-4 w-4 rounded-full border-2 border-primary-500 md:bottom-auto md:top-1"
        />
      )}
      <span className={twMerge('flex h-12 w-12 items-center justify-center md:h-10 md:w-10', loading && 'text-transparent')}>
        <Icon className="h-5 w-5 md:h-7 md:w-7" />
      </span>
      <span className={twMerge('block', loading && 'text-transparent')}>
        <span className="md:hidden">Sign in with </span>
        <span className={twJoin(isLastUsed && 'md:text-transparent')}>{label}</span>
      </span>
      {loading && (
        <div className={twMerge('z-100 absolute inset-0 flex items-center justify-center bg-black/50')}>
          <Spinner size="lg" />
        </div>
      )}
      {isLastUsed && (
        <span className="md:rounded-bl-0 absolute right-0 top-0 block rounded-bl-md bg-primary-500/10 px-2 py-1 text-xs font-bold text-primary-500 md:bottom-0 md:left-0 md:top-auto">
          Last used
        </span>
      )}
    </button>
  )
}

export default SSOButton
