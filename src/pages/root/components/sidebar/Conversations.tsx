import { Spinner } from '@heroui/spinner'
import { MessagesSquareIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface ConversationsProps {
  loading: boolean
  threads: any[]
  agent: any
}

const Conversations: React.FC<ConversationsProps> = ({ loading, threads, agent }) => (
  <div className="flex flex-col gap-2 py-3">
    <span className="block px-3 text-sm font-semibold text-neutral-600 dark:text-neutral-200">Conversations</span>
    {loading && (
      <div className="flex flex-col items-center justify-center gap-2 rounded border bg-neutral-100 px-3 py-10 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        <Spinner />
        <span className="text-sm">Loading conversations...</span>
      </div>
    )}
    {!loading &&
      threads.map((thread) => (
        <Link
          key={thread.thread_id}
          to={`/?agent=${agent?.agent_id}&thread=${thread.thread_id}`}
          className="block truncate rounded px-3 py-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-900"
        >
          {thread.first_message_snippet || 'New Conversation'}
        </Link>
      ))}
    {!loading && threads.length === 0 && (
      <div className="flex flex-col items-center justify-center gap-2 rounded border bg-neutral-100 px-3 py-10 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
        <MessagesSquareIcon className="mb-3 h-10 w-10 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
        <span className="text-sm font-semibold">No conversations yet</span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">New conversations with this agent will appear here.</span>
      </div>
    )}
  </div>
)

export default Conversations
