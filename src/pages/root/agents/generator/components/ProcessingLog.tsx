import { IChatMessage } from '@/types/agent'
import { Card, CardBody, CardHeader } from '@heroui/react' // Assuming Card components are from @heroui/react
import { ClipboardList } from 'lucide-react' // Added UserCircle and Bot for potential icon usage
import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

interface ProcessingLogProps {
  chatMessages: IChatMessage[]
}

const ProcessingLog: React.FC<ProcessingLogProps> = ({ chatMessages }) => {
  // If there are no messages, don't render the component.
  // Alternatively, you could render a Card with an "empty log" message.
  if (chatMessages.length === 0) {
    return null
  }

  // Helper function to determine message styling based on role
  const getMessageStyles = (role: string) => {
    const baseClasses = 'rounded-lg p-3 text-sm shadow-sm'
    if (role === 'user') {
      return `${baseClasses} bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200 border border-primary-100 dark:border-primary-700/50`
    }
    // For assistant or system messages
    return `${baseClasses} bg-neutral-200/50 dark:bg-neutral-800/50 border border-divider`
  }

  return (
    <Card shadow="sm" className="mt-6 border border-divider bg-background">
      <CardHeader className="border-b border-divider pb-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ClipboardList size={20} className="text-primary" /> Processing Log
        </h3>
      </CardHeader>
      <CardBody className="max-h-72 p-0">
        <PerfectScrollbar
          className="h-full w-full" // Takes full height/width of CardBody
          options={{ suppressScrollX: true, wheelPropagation: false }}
        >
          <div className="space-y-3 p-3">
            {chatMessages.map((msg, i) => (
              <div key={i} className={getMessageStyles(msg.role)}>
                <p className="mb-1 flex items-center text-xs font-semibold capitalize opacity-80">{msg.role}</p>
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              </div>
            ))}
          </div>
        </PerfectScrollbar>
      </CardBody>
    </Card>
  )
}

export default ProcessingLog
