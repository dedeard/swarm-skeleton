import { IAgent } from '@/types/agent'
import { Button } from '@heroui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import ToolCard from './ToolCard'

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800">
    <h4 className="mb-2 flex items-center text-sm font-semibold text-neutral-700 dark:text-neutral-200">{title}</h4>
    <div className="text-xs text-neutral-600 dark:text-neutral-300">{children}</div>
  </div>
)

const AgentDetailCard: React.FC<{ agent: IAgent }> = ({ agent }) => {
  const [isAgentDetailsVisible, setIsAgentDetailsVisible] = useState(false)

  const toggleAgentDetails = () => {
    setIsAgentDetailsVisible(!isAgentDetailsVisible)
  }

  return (
    <>
      <Button
        fullWidth
        variant="bordered"
        disableAnimation
        className="flex items-center justify-between truncate rounded-none border-x-0 px-4 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
        endContent={
          isAgentDetailsVisible ? (
            <ChevronUp className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          )
        }
        onPress={toggleAgentDetails}
      >
        {agent.agent_name}
      </Button>

      {isAgentDetailsVisible && (
        <div className="absolute px-3">
          <div className="shadow">
            <DetailSection title="Description">
              <p className="leading-relaxed">{agent.description || 'No description available.'}</p>
            </DetailSection>

            {agent.tools && agent.tools.length > 0 && (
              <DetailSection title="Tools">
                <ul className="flex flex-col gap-2 divide-y-1 dark:divide-neutral-600">
                  {agent.tools.map((tool, index) => (
                    <li key={index}>
                      <ToolCard toolId={tool} />
                    </li>
                  ))}
                </ul>
              </DetailSection>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AgentDetailCard
