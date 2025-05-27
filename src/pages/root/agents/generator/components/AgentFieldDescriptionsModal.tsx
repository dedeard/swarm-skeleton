import { IAvailableFieldInfo } from '@/types/agent'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React from 'react'

interface AgentFieldDescriptionsModalProps {
  isOpen: boolean
  onClose: () => void
  availableFieldsInfo: IAvailableFieldInfo | null
}

const AgentFieldDescriptionsModal: React.FC<AgentFieldDescriptionsModalProps> = ({ isOpen, onClose, availableFieldsInfo }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Agent Field Descriptions</ModalHeader>
        <ModalBody>
          {availableFieldsInfo && availableFieldsInfo.fields.length > 0 ? (
            <ul className="space-y-2">
              {availableFieldsInfo.fields.map((fieldName) => (
                <li key={fieldName}>
                  <p className="font-semibold">{fieldName}</p>
                  <p className="text-sm text-foreground-600">
                    {availableFieldsInfo?.descriptions[fieldName] || 'No description available.'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No field descriptions loaded or available (dummy data).</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AgentFieldDescriptionsModal
