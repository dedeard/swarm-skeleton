import { useLayoutContext } from '@/contexts/LayoutContext'
import { Button } from '@heroui/button'
import { PanelLeftOpenIcon, PenBoxIcon } from 'lucide-react'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

const MainSidebar: React.FC = () => {
  const { toggleSidebar } = useLayoutContext()
  return (
    <>
      <div className="absolute z-50 h-full w-64 bg-neutral-100 dark:bg-neutral-950 md:relative">
        <div className="flex h-16 items-center justify-between bg-neutral-100 p-3 dark:bg-neutral-950">
          <Button isIconOnly variant="light" onPress={toggleSidebar}>
            <PanelLeftOpenIcon className="h-5 w-5" />
          </Button>
          <Button isIconOnly variant="light">
            <PenBoxIcon className="h-5 w-5" />
          </Button>
        </div>
        <PerfectScrollbar className="h-[calc(100vh-4rem)]">
          <div className="flex h-[300vh] flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Main Sidebar</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">This is the main sidebar content.</p>
          </div>
        </PerfectScrollbar>
      </div>
      <div className="absolute inset-0 z-40 bg-white opacity-80 dark:bg-neutral-900 md:hidden"></div>
    </>
  )
}

export default MainSidebar
