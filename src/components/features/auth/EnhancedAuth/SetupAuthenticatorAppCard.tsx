import { Button } from '@heroui/button'
import { FingerprintIcon } from 'lucide-react'
import React from 'react'
import QRCode from 'react-qr-code'
import BackButton from './BackButton'
import MainCard from './MainCard'

const SetupAuthenticatorAppCard: React.FC<{ onCancel?: VoidFunction }> = ({ onCancel }) => {
  return (
    <MainCard title="Set Up Authenticator App" action={<BackButton onClick={onCancel} />}>
      <div>
        <h4 className="mb-2 text-center text-xs">Step 1: Scan this QR code with your authenticator app</h4>
        <div className="flex flex-col gap-3 rounded-lg border border-primary-500/10 p-6 text-sm hover:border-primary-500/30">
          <div className="m-auto w-full max-w-[200px] rounded-lg border-4 border-primary-500 bg-white p-3">
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={'ABCD EFGH IJKL'}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
        <p className="mt-2 text-center text-xs">
          Or enter this code manually: <span className="text-primary-500">ABCD EFGH IJKL</span>
        </p>
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

export default SetupAuthenticatorAppCard
