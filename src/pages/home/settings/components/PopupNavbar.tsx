import { XIcon } from 'lucide-react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

const TabLink: React.FC<{ title: string; to: string }> = ({ title, to }) => {
  const { pathname } = useLocation()
  return (
    <Link
      to={to}
      className={twMerge(
        'block border-b-2 border-transparent py-2 text-center text-xs',
        pathname === to && 'border-primary-500 text-primary-500',
      )}
    >
      {title}
    </Link>
  )
}

const PopupNavbar: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex items-center justify-between border-b border-primary-500/20 p-3">
        <span className="block font-semibold">{children}</span>
        <button
          onClick={() => navigate('/')}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-transparent p-1 transition hover:bg-primary-500/10 focus:outline-none"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-4 border-b border-primary-500/20">
        <TabLink title="Security" to="/settings" />
        <TabLink title="Profile" to="/settings/profile" />
        <TabLink title="Preferences" to="/settings/preferences" />
        <TabLink title="Companies" to="/settings/companies" />
      </div>
    </>
  )
}

export default PopupNavbar
