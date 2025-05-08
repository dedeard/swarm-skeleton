import { Button } from '@heroui/button'
import { Input, Select, SelectItem, Textarea } from '@heroui/react'
import { Switch } from '@heroui/switch'
import { HomeIcon, RefreshCwIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CreateAgent: React.FC = () => {
  const [enabled, setEnabled] = useState(true)
  return (
    <div className="absolute left-0 z-10 flex h-screen max-h-screen w-full flex-1 flex-col bg-white dark:bg-neutral-950 lg:static lg:w-[calc(100vw-400px)] lg:max-w-3xl">
      <div className="flex justify-between px-3 py-4">
        <div>
          <span className="block text-lg">Create Agent</span>
          <span className="block text-xs opacity-75">Define the properties for your new backend agent.</span>
        </div>
        <Button as={Link} isIconOnly size="sm" to="/agents" variant="light" radius="full">
          <XIcon size={20} />
        </Button>
      </div>

      <div className="grid h-[calc(100%-76px)] w-full grid-cols-1 gap-3 overflow-y-auto px-4">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-500/10 text-primary-500">
                <HomeIcon size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">New Agent</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Agent summary will be automatically generated after saving</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch isSelected={enabled} onValueChange={setEnabled} color="success" className="ml-2" />
                <span className={`text-sm ${enabled ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <Input label="Agent Name" placeholder="e.g., Customer Support Bot" isRequired variant="bordered" className="w-full" />

          <div className="relative">
            <Textarea
              label="Description"
              placeholder="Describe what this agent does"
              minRows={4}
              maxRows={8}
              variant="bordered"
              className="w-full"
            />
            <Button
              variant="light"
              color="default"
              startContent={<RefreshCwIcon size={16} />}
              size="sm"
              className="absolute right-1 top-1 text-gray-700 dark:text-gray-300"
            >
              Optimize by AI
            </Button>
          </div>
          <div className="relative">
            <Textarea
              label="Agent Style / Instructions"
              placeholder="e.g., conversational, or provide specific instructions"
              minRows={4}
              maxRows={8}
              variant="bordered"
              className="w-full"
              classNames={{ mainWrapper: '!border-primary-600' }}
            />
            <Button
              variant="light"
              color="default"
              startContent={<RefreshCwIcon size={16} />}
              size="sm"
              className="absolute right-1 top-1 text-gray-700 dark:text-gray-300"
            >
              Optimize by AI
            </Button>
          </div>

          <Select
            label="Category"
            isDisabled
            placeholder="Select a category"
            variant="bordered"
            defaultSelectedKeys={['general']}
            className="w-full"
          >
            <SelectItem key="general">General Assistant</SelectItem>
            <SelectItem key="customer">Customer Support</SelectItem>
            <SelectItem key="sales">Sales Assistant</SelectItem>
            <SelectItem key="coding">Coding Assistant</SelectItem>
          </Select>

          <Select label="Default LLM" placeholder="Select LLM..." variant="bordered" className="w-full">
            <SelectItem key="gpt4">GPT-4</SelectItem>
            <SelectItem key="claude">Claude</SelectItem>
            <SelectItem key="llama">Llama 3</SelectItem>
            <SelectItem key="mistral">Mistral</SelectItem>
          </Select>

          <Select label="Tools" placeholder="Select tools..." variant="bordered" className="w-full" selectionMode="multiple">
            <SelectItem key="gpt4">GPT-4</SelectItem>
            <SelectItem key="claude">Claude</SelectItem>
            <SelectItem key="llama">Llama 3</SelectItem>
            <SelectItem key="mistral">Mistral</SelectItem>
          </Select>

          <div className="flex justify-end gap-2">
            <Button variant="flat" color="default" className="font-medium">
              Cancel
            </Button>
            <Button color="primary" className="bg-primary-500 font-medium dark:bg-primary-600">
              Create Agent
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAgent
