import { Button } from '@heroui/button'
import { SettingsIcon } from 'lucide-react'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen flex-col">
      <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 p-3">
        <div>
          <Button className="glass-box h-9 border-transparent text-xs font-normal text-primary-500 shadow-lg dark:border-primary-500/10">
            <div className="flex items-center justify-center gap-2">
              <SettingsIcon className="block" size={14} />
              <span className="block">Agents</span>
              <span className="leading-1 block rounded-lg bg-primary-500 p-1 text-[9px] font-bold text-black">3</span>
            </div>
          </Button>
        </div>
      </div>
      <main className="container mx-auto max-w-7xl flex-grow px-6 pt-16">{children}</main>
    </div>
  )
}
