import React from 'react'
import BackButton from './BackButton'

const HelpCard: React.FC<{ onClick: VoidFunction }> = ({ onClick }) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary-500/20 p-6 hover:border-primary-500/30">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Why add this security layer?</h3>
        <BackButton onClick={onClick} />
      </div>
      <p className="text-sm">
        Even if someone gains access to your social account, they still can&apos;t access SWARM without your passkey or authenticator code.
      </p>
      <p className="text-sm">
        This additional layer of security ensures that only you can access your SWARM account, even if your social login credentials are
        compromised.
      </p>
    </div>
  )
}

export default HelpCard
