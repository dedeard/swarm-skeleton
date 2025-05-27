import useDynamicUrl from '@/hooks/use-dynamic-url'
import { PlusCircleIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SidebarLinks: React.FC = () => {
  const agenturl = useDynamicUrl('/agents')
  const newChatUrl = useDynamicUrl('/', ['thread'])

  return (
    <div className="flex flex-col gap-1">
      <Link
        to={agenturl}
        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
      >
        <span className="flex h-7 w-7 items-center justify-center">
          <SettingsIcon size={16} />
        </span>
        <span className="block">Agent Settings</span>
      </Link>
      <Link
        to={newChatUrl}
        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
      >
        <span className="flex h-7 w-7 items-center justify-center">
          <PlusCircleIcon size={16} />
        </span>
        <span className="block">New Chat</span>
      </Link>
      {/* <Link
        to={toolurl}
        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
      >
        <span className="flex h-7 w-7 items-center justify-center">
          <Settings2Icon size={16} />
        </span>
        <span className="block">Tool Configuration</span>
      </Link> */}
    </div>
  )
}

export default SidebarLinks
