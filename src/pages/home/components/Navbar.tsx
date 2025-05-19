import ThemeToggle from '@/components/layouts/ThemeToggle'
import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import useDynamicUrl from '@/hooks/use-dynamic-url'
import { Button } from '@heroui/button'
import { SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'

const Navbar: React.FC = () => {
  const url = useDynamicUrl('/agents')
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 border-b bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex w-[300px] justify-between p-3 pr-0 dark:border-neutral-800">
        <span className="hidden text-2xl font-bold text-neutral-900 dark:text-neutral-100 md:block">
          <SwarmTextGradient>SWARM</SwarmTextGradient>
        </span>

        <Button as={Link} to={url} variant="flat" startContent={<SettingsIcon size={18} />} size="sm" color="success">
          Agents
        </Button>
      </div>

      <div className="flex items-center gap-3 p-3">
        <ProfileDropdown />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Navbar
