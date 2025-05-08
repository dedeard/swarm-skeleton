import ThemeToggle from '@/components/layouts/ThemeToggle'
import { Button } from '@heroui/button'
import { SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'

const Navbar: React.FC = () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 p-3">
      <div>
        <Button as={Link} to="/agents" variant="bordered" color="success" startContent={<SettingsIcon size={14} />}>
          Agents
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <ProfileDropdown />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Navbar
