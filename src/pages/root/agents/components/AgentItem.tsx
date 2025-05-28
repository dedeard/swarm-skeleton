import { useAgentStore } from '@/store/agent.store'
import { IAgent } from '@/types/agent'
import { Button } from '@heroui/button' // Existing HeroUI Button
import { addToast } from '@heroui/react' // Assuming this is the correct path for addToast
import { DotIcon, HomeIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AgentUsageChart } from './AgentUsageChart'

// Import HeroUI Modal components and useDisclosure hook
// Assuming these are the correct export paths.
// The useDisclosure hook might be re-exported from "@heroui/react" or a specific hooks package
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal' // Corrected path based on your files
import { useDisclosure } from '@heroui/use-disclosure' // Corrected path based on your files

const AgentItem: React.FC<{ agent: IAgent }> = ({ agent }) => {
  const [loading, setLoading] = useState(false)
  const agentStore = useAgentStore()
  // useDisclosure is used to control the modal's visibility
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      await agentStore.removeAgent(agent.agent_id)
      addToast({
        title: 'Success',
        description: 'Agent deleted successfully',
        color: 'success',
      })
      onClose() // Close the modal on success
    } catch (e) {
      addToast({
        title: 'Error',
        description: 'Failed to delete agent. Please try again.',
        color: 'danger',
      })
      // setLoading(false) will be handled by finally
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-start gap-3 rounded border border-primary-500/20 p-3">
        <div className="shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-500/20 text-primary-500">
            <HomeIcon size={18} />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="block h-3 w-3 rounded-full bg-primary-500"></span>
            <span className="block text-[10px] font-semibold dark:text-neutral-300">Agent Category</span>
          </div>
          <div className="truncate text-sm font-medium">{agent.agent_name}</div>
          <div className="truncate text-xs opacity-75">{agent.description}</div>

          <div className="flex items-center text-[10px] opacity-60">
            <span className="block">Used 78 times</span>
            <DotIcon size={18} />
            <span className="block">Last used 1 day ago</span>
          </div>

          <div className="flex gap-1">
            <span className="block border border-neutral-500/20 bg-neutral-500/10 px-1 text-[10px] text-neutral-500">LLM: Claude 3</span>
            <span className="block border border-neutral-500/20 bg-neutral-500/10 px-1 text-[10px] text-neutral-500">
              Tools: {agent.tools.length}
            </span>
          </div>

          <div className="mt-3 flex gap-3">
            <Button as={Link} to={`/?agent=${agent.agent_id}`} variant="flat" size="sm" color="success">
              Chat
            </Button>
            <Button as={Link} to={`/agents/${agent.agent_id}/edit`} variant="light" size="sm" color="secondary">
              Edit
            </Button>
            {/* The original delete button now opens the modal */}
            {/* The HeroUI Button is used here */}
            <Button type="button" variant="light" size="sm" color="danger" onPress={onOpen} disabled={loading}>
              Delete
            </Button>
          </div>
        </div>

        <div className="shrink-0">
          <AgentUsageChart color="#10b981" />
        </div>
      </div>

      {/* Confirmation Modal using HeroUI */}
      {/* The Modal component from HeroUI is used to display modal dialogs */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {/* ModalContent is a required child of Modal */}
        <ModalContent>
          {/* onClose is available from useDisclosure and can be passed to children of ModalContent */}
          {(
            _onClose, // _onClose is provided by ModalContent, but we can also use onClose from useDisclosure
          ) => (
            <>
              {/* ModalHeader is a component for the modal's header section */}
              <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
              {/* ModalBody is a component for the modal's main content area */}
              <ModalBody>
                <p>Are you sure you want to delete the agent "{agent.agent_name}"?</p>
                <p className="text-sm text-default-500">This action cannot be undone.</p>
              </ModalBody>
              {/* ModalFooter is a component for the modal's footer, typically containing action buttons */}
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose} disabled={loading}>
                  Cancel
                </Button>
                {/* The HeroUI Button supports an isLoading prop */}
                <Button color="danger" onPress={handleConfirmDelete} isLoading={loading} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete Agent'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default AgentItem
