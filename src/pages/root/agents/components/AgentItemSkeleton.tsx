import React from 'react'

const AgentItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="h-6 w-6 animate-pulse rounded bg-neutral-300 dark:bg-neutral-700" />
    </div>
  )
}

export default AgentItemSkeleton
