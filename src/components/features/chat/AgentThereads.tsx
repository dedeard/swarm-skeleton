import { IThreadPreview } from '@/types/agent' // Assuming this type is correctly defined
import { cn } from '@heroui/theme' // Assuming cn is a utility for conditional class names, like clsx or classnames
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Threads: React.FC<{
  /**
   * An array of thread preview objects to display.
   */
  threads: IThreadPreview[]
}> = ({ threads }) => {
  const location = useLocation()
  const threadId = new URLSearchParams(location.search).get('thread') || ''
  const agentId = new URLSearchParams(location.search).get('agent') || ''

  if (!threads || threads.length === 0) {
    return <div>No threads available.</div>
  }

  return (
    <ul className="space-y-1 p-3">
      {threads.map((thread) => {
        const isActive = threadId === thread.thread_id
        const threadUrl = `/?agent=${agentId || ''}&thread=${thread.thread_id}`

        return (
          <li key={thread.thread_id}>
            <Link
              to={threadUrl}
              className={cn(
                'block rounded-md p-3 transition-colors duration-150 ease-in-out',
                'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                isActive
                  ? 'bg-neutral-200 font-semibold text-neutral-900 dark:bg-neutral-600 dark:text-neutral-100'
                  : 'bg-transparent text-neutral-700 dark:text-neutral-300',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="mb-0.5 truncate text-sm font-medium">
                {thread.first_message_snippet || `Thread (${thread.message_count} messages)`}
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="truncate" title={`Thread ID: ${thread.thread_id}`}>
                  ID: {thread.thread_id.substring(0, 8)}...
                </span>
                {thread.last_message_timestamp && (
                  <span className="ml-2 flex-shrink-0">
                    {new Date(thread.last_message_timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default Threads
