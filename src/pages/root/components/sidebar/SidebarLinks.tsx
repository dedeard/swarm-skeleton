import { Settings2Icon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface SidebarLinksProps {
  agent?: any
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ agent }) => (
  <div className="flex flex-col gap-1">
    <Link
      to={`/?agent=${agent?.agent_id}`}
      className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
    >
      <span className="flex h-7 w-7 items-center justify-center">
        <SettingsIcon size={16} />
      </span>
      <span className="block">Agent Settings</span>
    </Link>
    <Link
      to={`/?agent=${agent?.agent_id}`}
      className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
    >
      <span className="flex h-7 w-7 items-center justify-center">
        <Settings2Icon size={16} />
      </span>
      <span className="block">Tool Configuration</span>
    </Link>
  </div>
)

export default SidebarLinks
