import { Checkbox } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import ActionCard from './ActionCard'
import HelpCard from './HelpCard'
import MainCard from './MainCard'
import SetupAuthenticatorAppCard from './SetupAuthenticatorAppCard'
import SetupPasskeyCard from './SetupPasskeyCard'

const LOCAL_STORAGE_KEY_DONT_SHOW = 'enhancedAuthUIDontShow'

const EnhancedAuth: React.FC<{ skipable?: boolean }> = ({ skipable }) => {
  const [view, setView] = useState<'passkey' | 'authenticator_app' | null>(null)
  const [toggleHelp, setToggleHelp] = useState(false)
  const [dontShowPermanently, setDontShowPermanently] = useState(false)
  const [isVisibleThisSession, setIsVisibleThisSession] = useState(true)

  useEffect(() => {
    const shouldHidePermanently = localStorage.getItem(LOCAL_STORAGE_KEY_DONT_SHOW) === 'true'
    if (shouldHidePermanently) {
      setDontShowPermanently(true)
      setIsVisibleThisSession(false)
    }
  }, [])

  const handleSkipForNow = () => {
    setIsVisibleThisSession(false)
    if (dontShowPermanently) {
      localStorage.setItem(LOCAL_STORAGE_KEY_DONT_SHOW, 'true')
    }
  }

  const handleDontShowAgainChange = (isSelected: boolean) => {
    setDontShowPermanently(isSelected)
    if (isSelected) {
      localStorage.setItem(LOCAL_STORAGE_KEY_DONT_SHOW, 'true')
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_DONT_SHOW)
    }
  }

  if (!isVisibleThisSession && skipable) {
    return null
  }

  if (view === 'passkey') {
    return <SetupPasskeyCard onCancel={() => setView(null)} />
  }

  if (view === 'authenticator_app') {
    return <SetupAuthenticatorAppCard onCancel={() => setView(null)} />
  }

  return (
    <MainCard
      title="Enhance Your Account Security"
      action={
        <button
          type="button"
          onClick={() => setToggleHelp((v) => !v)}
          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-neutral-950"
        >
          <span className="font-bold">?</span>
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <ActionCard
          action={() => setView('passkey')}
          title="Passkey"
          desc="Use your device's biometrics for quick, passwordless login"
          isRecomended
        />
        <ActionCard
          action={() => setView('authenticator_app')}
          title="Authenticator App"
          desc="Generate one-time codes with apps like Google Authenticator"
        />
      </div>
      {toggleHelp && <HelpCard onClick={() => setToggleHelp((v) => !v)} />}
      {skipable && (
        <div className="mt-4 flex items-center justify-between">
          <Checkbox
            isSelected={dontShowPermanently}
            onChange={(e) => handleDontShowAgainChange(e.currentTarget.checked)}
            aria-label="Don't show this notification again"
          >
            Don&apos;t show again
          </Checkbox>
          <button
            onClick={handleSkipForNow}
            type="button"
            className="cursor-pointer border-none bg-transparent p-0 text-xs text-neutral-700 outline-0 hover:text-primary-500 dark:text-neutral-300"
          >
            Skip for now
          </button>
        </div>
      )}
    </MainCard>
  )
}

export default EnhancedAuth
