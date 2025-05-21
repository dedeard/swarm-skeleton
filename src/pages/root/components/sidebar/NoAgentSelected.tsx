import { Button } from '@heroui/button'
import { UserPlusIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const NoAgentSelected: React.FC = () => (
  <div className="my-3 flex flex-col items-center justify-center rounded border p-6 text-center dark:border-neutral-700 dark:bg-neutral-900">
    <UserPlusIcon className="mb-4 h-12 w-12 text-green-500" strokeWidth={1.5} />
    <h3 className="text-md mb-2 font-semibold text-neutral-700 dark:text-neutral-200">No Agent Selected</h3>
    <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">Please select an agent to start a conversation.</p>
    <Button as={Link} to="/agents" startContent={<UserPlusIcon size={16} />} variant="flat" size="sm" color="success">
      Select Agent
    </Button>
  </div>
)

export default NoAgentSelected
