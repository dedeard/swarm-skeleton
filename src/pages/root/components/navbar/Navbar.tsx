import ThemeToggle from '@/components/layouts/ThemeToggle'
import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import { useLayoutContext } from '@/contexts/LayoutContext'
import useDynamicUrl from '@/hooks/use-dynamic-url'
import { Button } from '@heroui/button'
import { PanelLeftOpenIcon, PenBoxIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'

const Navbar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useLayoutContext()
  const url = useDynamicUrl('/agents')
  return (
    <div className="relative z-10 h-16 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-full items-center justify-center px-3">
        <div className="flex flex-1 items-center gap-3">
          {!sidebarOpen && (
            <div className="flex">
              <Button isIconOnly variant="light" onPress={toggleSidebar}>
                <PanelLeftOpenIcon className="h-5 w-5" />
              </Button>
              <Button isIconOnly variant="light">
                <PenBoxIcon className="h-5 w-5" />
              </Button>
            </div>
          )}

          <Button as={Link} to={url} variant="flat" startContent={<SettingsIcon size={18} />} color="success">
            Agents
          </Button>
          <h1 className="px-3 text-xl font-bold text-gray-800 dark:text-white">
            <SwarmTextGradient>SWARM</SwarmTextGradient>
          </h1>
        </div>

        <div className="flex">
          <ProfileDropdown />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default Navbar
