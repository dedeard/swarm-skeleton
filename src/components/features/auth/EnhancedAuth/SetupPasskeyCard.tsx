import { Button } from '@heroui/button'
import { CheckIcon, FingerprintIcon } from 'lucide-react'
import React from 'react'
import BackButton from './BackButton'
import MainCard from './MainCard'

const SetupPasskeyCard: React.FC<{ onCancel?: VoidFunction }> = ({ onCancel }) => {
  const lists = ['Works even if you lose access to your social account', 'No passwords to remember or type', 'Faster than typing passwords']
  return (
    <MainCard title="Set Up Passkey" action={<BackButton onClick={onCancel} />}>
      <p className="text-xs">Create a passkey for this device to sign in without passwords using your fingerprint, face, or device PIN.</p>

      <div className="rounded-lg border border-primary-500/10 p-6 text-sm hover:border-primary-500/30">
        <ul className="flex flex-col gap-3">
          {lists.map((el, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon size={18} className="mr-2 text-primary-500" />
              <span className="block">{el}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs">When you click the button below, your browser will prompt you to use your device&apos;s authentication.</p>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer border-none p-0 text-xs text-neutral-700 outline-0 hover:text-primary-500 dark:text-neutral-300"
        >
          Cancel
        </button>
        <Button size="sm" color="primary" startContent={<FingerprintIcon size={16} />}>
          Create Passkey
        </Button>
      </div>
    </MainCard>
  )
}

export default SetupPasskeyCard
