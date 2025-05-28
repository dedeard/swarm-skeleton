import { IChatMessage } from '@/types/agent'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { ClipboardList } from 'lucide-react'
import React from 'react'

interface ProcessingLogProps {
  chatMessages: IChatMessage[]
}

const ProcessingLog: React.FC<ProcessingLogProps> = ({ chatMessages }) => {
  if (chatMessages.length === 0) return null

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <ClipboardList /> Processing Log
        </h3>
      </CardHeader>
      <CardBody className="max-h-60 space-y-2 overflow-y-auto pr-2">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-md p-2 text-sm ${
              msg.role === 'user' ? 'bg-primary-50 text-primary-700' : 'bg-content2 text-foreground-700'
            }`}
          >
            <span className="font-semibold capitalize">{msg.role}: </span>
            {msg.content}
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default ProcessingLog
