import { Button } from '@heroui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

const ThemeToggle: React.FC = () => {
  const theme = useTheme()

  const toggleTheme = () => {
    if (theme.theme === 'dark') {
      theme.setTheme('light')
    } else {
      theme.setTheme('dark')
    }
  }

  return (
    <Button isIconOnly onPress={toggleTheme} variant="light">
      {theme.theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </Button>
  )
}

export default ThemeToggle
