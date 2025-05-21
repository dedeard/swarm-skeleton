import { Button } from '@heroui/button'
import { PanelLeftOpenIcon, PenBoxIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface SidebarHeaderProps {
  agent?: any
  toggleSidebar: () => void
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ agent, toggleSidebar }) => (
  <div className="flex h-16 items-center justify-between bg-neutral-100 p-3 dark:bg-neutral-950">
    <Button isIconOnly variant="light" onPress={toggleSidebar} aria-label="Toggle Sidebar">
      <PanelLeftOpenIcon className="h-5 w-5" />
    </Button>
    <Button as={Link} to={`/?agent=${agent?.agent_id}`} isIconOnly variant="light" aria-label="New Chat">
      <PenBoxIcon className="h-5 w-5" />
    </Button>
  </div>
)

export default SidebarHeader
