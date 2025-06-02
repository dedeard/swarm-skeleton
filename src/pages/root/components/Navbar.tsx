import ProfileDropdown from '@/components/layouts/ProfileDropdown'
import ThemeToggle from '@/components/layouts/ThemeToggle'
import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import { useLayoutContext } from '@/contexts/LayoutContext'
import useDynamicUrl from '@/hooks/use-dynamic-url'
import { Button } from '@heroui/button'
import { PanelLeftOpenIcon, PenBoxIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const Navbar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useLayoutContext()
  const [searchParams] = useSearchParams()
  const agentId = searchParams.get('agent')
  const url = useDynamicUrl('/agents')
  return (
    <div className="relative z-10 h-16">
      <div className="flex h-full items-center justify-center px-3">
        <div className="flex flex-1 items-center gap-3">
          {!sidebarOpen && (
            <div className="flex">
              <Button isIconOnly variant="light" onPress={toggleSidebar}>
                <PanelLeftOpenIcon className="h-5 w-5" />
              </Button>
              <Button as={Link} to={`/?agent=${agentId}`} isIconOnly variant="light">
                <PenBoxIcon className="h-5 w-5" />
              </Button>
            </div>
          )}

          <Button as={Link} to={url} variant="flat" startContent={<SettingsIcon size={18} />} color="success" className="hidden md:flex">
            Agents
          </Button>

          <Link to="/" className="hidden px-3 text-xl font-bold text-gray-800 dark:text-white md:flex">
            <SwarmTextGradient>SWARM</SwarmTextGradient>
          </Link>
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
