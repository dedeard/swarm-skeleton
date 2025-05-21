'use client'

import SwarmTextGradient from '@/components/ui/SwarmTextGradient'
import { useAuthStore } from '@/store/auth.store'
import { supabase } from '@/utils/supabase'
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { ChevronDownIcon, LockIcon, LogOutIcon, SettingsIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileDropdown: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const avatar = user?.user_metadata?.picture || `https://cdn.dedeard.my.id/avatar/${user?.user_metadata?.full_name}.jpg?size=300`

  const menuItems = [
    {
      key: 'settings',
      title: 'Settings',
      icon: <SettingsIcon size={14} className="text-primary-500" />,
      action: () => navigate('/settings'),
    },
    {
      key: 'totp',
      title: 'TOTP Codes',
      icon: <LockIcon size={14} className="text-primary-500" />,
      action: () => console.log('TOTP'),
    },
    {
      key: 'signout',
      title: 'Sign Out',
      icon: <LogOutIcon size={14} className="text-primary-500" />,
      action: () => supabase.auth.signOut(),
    },
  ]

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button className="flex min-w-10 !scale-100 items-center gap-2 px-1" variant="light">
          <Avatar src={avatar} alt={user?.user_metadata?.full_name} className="h-7 w-7 border-2 border-primary-600" />
          <div className="hidden flex-col items-start text-left leading-none md:flex">
            <span className="text-xs font-medium leading-none">
              <SwarmTextGradient>{user?.user_metadata?.full_name}</SwarmTextGradient>
            </span>
            <span className="text-[12px] font-normal leading-none text-neutral-700 dark:text-neutral-300">
              {user?.user_metadata?.email}
            </span>
          </div>
          <ChevronDownIcon className="hidden h-5 w-5 text-primary-600 md:block" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        onAction={(key) => {
          const item = menuItems.find((item) => item.key === key)
          item?.action?.()
        }}
      >
        {menuItems.map((item) => (
          <DropdownItem key={item.key} startContent={item.icon}>
            <span className="text-xs">{item.title}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
