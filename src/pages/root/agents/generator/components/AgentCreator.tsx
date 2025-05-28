import { getAgentFieldMetadata } from '@/services/agent.service'
import { useToolStore } from '@/store/tool.store'
import { IAvailableFieldInfo } from '@/types/agent'
import { Button, Tab, Tabs, useDisclosure } from '@heroui/react'
import { Info } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AgentFieldDescriptionsModal from './AgentFieldDescriptionsModal'
import { useMultiAgentLogic } from './hooks/useMultiAgentLogic'
import { useSingleAgentLogic } from './hooks/useSingleAgentLogic'
import MultiAgentCreator from './MultiAgentCreator'
import SingleAgentCreator from './SingleAgentCreator'

const AgentCreator: React.FC = () => {
  const { fetchTools } = useToolStore()
  const [isToolsLoading, setIsToolsLoading] = useState(true)
  const [availableFieldsInfo, setAvailableFieldsInfo] = useState<IAvailableFieldInfo | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>('single')

  const { isOpen: isFieldHelpModalOpen, onOpen: onFieldHelpModalOpen, onClose: onFieldHelpModalClose } = useDisclosure()

  // Initialize hooks
  const singleAgentLogic = useSingleAgentLogic()
  const multiAgentLogic = useMultiAgentLogic()

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load tools
        await fetchTools()

        // Load field metadata
        const fieldMetadata = await getAgentFieldMetadata()
        setAvailableFieldsInfo(fieldMetadata)

        // Initialize welcome messages
        singleAgentLogic.initializeWithWelcomeMessage()
        multiAgentLogic.initializeWithWelcomeMessage()
      } catch (error) {
        console.error('Failed to initialize agent creator:', error)
      } finally {
        setIsToolsLoading(false)
      }
    }

    initializeData()
  }, [fetchTools])

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key as string)
  }

  if (isToolsLoading) {
    return (
      <div className="container mx-auto max-w-5xl space-y-6 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-foreground-600">Loading Agent Creator...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4">
      <header className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Agent Creator</h1>
        <p className="text-foreground-600">Describe your agent in detail and our AI will extract the necessary information</p>
      </header>

      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <Button isIconOnly variant="light" onPress={onFieldHelpModalOpen} title="Available Fields">
          <Info size={20} />
        </Button>
      </div>

      <Tabs
        aria-label="Agent Creation Mode"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        variant="underlined"
        classNames={{
          tabList: 'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-primary',
        }}
      >
        <Tab
          key="single"
          title={
            <div className="flex items-center space-x-2">
              <span>Single Agent</span>
            </div>
          }
        >
          <div className="mt-6">
            <SingleAgentCreator
              userInput={singleAgentLogic.userInput}
              extractedAgentData={singleAgentLogic.extractedAgentData}
              mcphubRecommendations={singleAgentLogic.mcphubRecommendations}
              chatMessages={singleAgentLogic.chatMessages}
              isProcessing={singleAgentLogic.isProcessing}
              isToolsAutofilling={singleAgentLogic.isToolsAutofilling}
              toolSearchTerm={singleAgentLogic.toolSearchTerm}
              availableTools={singleAgentLogic.availableTools}
              setUserInput={singleAgentLogic.setUserInput}
              setToolSearchTerm={singleAgentLogic.setToolSearchTerm}
              handleProcessUserInput={singleAgentLogic.handleProcessUserInput}
              handleCreateAgent={singleAgentLogic.handleCreateAgent}
              handleReset={singleAgentLogic.handleReset}
              handleToolSelectionChange={singleAgentLogic.handleToolSelectionChange}
              canCreate={singleAgentLogic.canCreate}
            />
          </div>
        </Tab>
        <Tab
          key="multiple"
          title={
            <div className="flex items-center space-x-2">
              <span>Multiple Agents</span>
            </div>
          }
        >
          <div className="mt-6">
            <MultiAgentCreator
              userInput={multiAgentLogic.userInput}
              multiAgentParseResponse={multiAgentLogic.multiAgentParseResponse}
              chatMessages={multiAgentLogic.chatMessages}
              isProcessing={multiAgentLogic.isProcessing}
              isToolsAutofilling={multiAgentLogic.isToolsAutofilling}
              multiToolSearchTerms={multiAgentLogic.multiToolSearchTerms}
              availableTools={multiAgentLogic.availableTools}
              setUserInput={multiAgentLogic.setUserInput}
              setMultiToolSearchTerm={multiAgentLogic.setMultiToolSearchTerm}
              handleProcessUserInput={multiAgentLogic.handleProcessUserInput}
              handleCreateAgents={multiAgentLogic.handleCreateAgents}
              handleReset={multiAgentLogic.handleReset}
              handleToolSelectionChange={multiAgentLogic.handleToolSelectionChange}
              canCreate={multiAgentLogic.canCreate}
            />
          </div>
        </Tab>
      </Tabs>

      <AgentFieldDescriptionsModal
        isOpen={isFieldHelpModalOpen}
        onClose={onFieldHelpModalClose}
        availableFieldsInfo={availableFieldsInfo}
      />
    </div>
  )
}

const AgentCreatorPage: React.FC = () => {
  return <AgentCreator />
}

export default AgentCreatorPage
