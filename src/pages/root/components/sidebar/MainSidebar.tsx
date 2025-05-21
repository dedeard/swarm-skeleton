import { useChatContext } from '@/contexts/ChatContext'
import { useLayoutContext } from '@/contexts/LayoutContext'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { PanelLeftOpenIcon, PenBoxIcon, Settings2Icon, SettingsIcon } from 'lucide-react'
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from 'react-router-dom'

const MainSidebar: React.FC = () => {
  const { toggleSidebar } = useLayoutContext()
  const { loading, threads, agent } = useChatContext()

  return (
    <>
      <div className="absolute z-50 h-full w-64 bg-neutral-100 dark:bg-neutral-950 md:relative">
        <div className="flex h-16 items-center justify-between bg-neutral-100 p-3 dark:bg-neutral-950">
          <Button isIconOnly variant="light" onPress={toggleSidebar}>
            <PanelLeftOpenIcon className="h-5 w-5" />
          </Button>
          <Button as={Link} to={`/?agent=${agent?.agent_id}`} isIconOnly variant="light">
            <PenBoxIcon className="h-5 w-5" />
          </Button>
        </div>
        <PerfectScrollbar className="h-[calc(100vh-4rem)] p-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Link
                to={`/?agent=${agent?.agent_id}`}
                className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                <span className="flex h-7 w-7 items-center justify-center">
                  <SettingsIcon size={16} />
                </span>
                <span className="block">Agents</span>
              </Link>

              <Link
                to={`/?agent=${agent?.agent_id}`}
                className="flex items-center gap-2 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                <span className="flex h-7 w-7 items-center justify-center">
                  <Settings2Icon size={16} />
                </span>
                <span className="block">Tools</span>
              </Link>
            </div>

            <div className="flex flex-col py-3">
              <span className="mb-3 block px-3 text-sm font-semibold text-neutral-600 dark:text-neutral-200">Threads</span>
              {loading && (
                <div className="flex flex-col items-center justify-center gap-2 rounded px-3 py-8 text-sm text-neutral-600 dark:text-neutral-200">
                  <Spinner />
                  <span className="text-sm">Loading agent threads...</span>
                </div>
              )}
              {!loading &&
                threads.map((thread) => (
                  <Link
                    key={thread.thread_id}
                    to={`/?agent=${agent?.agent_id}&thread=${thread.thread_id}`}
                    className="block truncate rounded px-3 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-900"
                  >
                    {thread.first_message_snippet}
                  </Link>
                ))}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
      <div className="absolute inset-0 z-40 bg-white opacity-80 dark:bg-neutral-900 md:hidden"></div>
    </>
  )
}

export default MainSidebar
