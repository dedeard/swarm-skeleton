import { IAvailableFieldInfo } from '@/types/agent'
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react' // Added Divider
import { Info } from 'lucide-react' // Example Icon
import React from 'react'

interface AgentFieldDescriptionsModalProps {
  isOpen: boolean
  onClose: () => void
  availableFieldsInfo: IAvailableFieldInfo | null
}

const AgentFieldDescriptionsModal: React.FC<AgentFieldDescriptionsModalProps> = ({ isOpen, onClose, availableFieldsInfo }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" backdrop="blur">
      {/*
        Modal, ModalContent, ModalHeader, ModalBody, ModalFooter are components from HeroUI.
       
      */}
      <ModalContent className="max-h-[70vh]">
        <ModalHeader className="border-b border-divider">
          <div className="flex items-center gap-2">
            <Info size={24} className="text-primary" />
            <span className="text-xl">Agent Field Descriptions</span>
          </div>
        </ModalHeader>
        <ModalBody className="p-4 sm:p-6">
          {availableFieldsInfo && availableFieldsInfo.fields.length > 0 ? (
            <div className="space-y-4">
              {availableFieldsInfo.fields.map((fieldName, index) => (
                <React.Fragment key={fieldName}>
                  <div className="flex flex-col gap-1 rounded-lg border border-divider bg-content1 p-3 shadow-sm">
                    <p className="text-md font-semibold capitalize text-primary-600 dark:text-primary-400">
                      {fieldName.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-foreground-600 dark:text-foreground-400">
                      {availableFieldsInfo?.descriptions[fieldName] || (
                        <span className="italic text-foreground-500">No description available.</span>
                      )}
                    </p>
                  </div>
                  {/* The Divider component is used for visual separation */}
                  {index < availableFieldsInfo.fields.length - 1 && <Divider className="my-2" />}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-10">
              <Info size={48} className="mb-4 text-foreground-400" />
              <p className="text-lg text-foreground-500">No field descriptions available.</p>
              <p className="text-sm text-foreground-400">(Dummy data might not be loaded)</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="border-t border-divider">
          {/* The Button component from HeroUI is used for actions */}
          <Button color="primary" variant="solid" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AgentFieldDescriptionsModal
