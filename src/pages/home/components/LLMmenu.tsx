import { useLLMStore } from '@/store/llm.store'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import React from 'react'

interface LLMmenuProps {
  selected: string
  onSelected: (model: string) => void
  disabled?: boolean
}

export const LLMmenu: React.FC<LLMmenuProps> = ({ selected, onSelected, disabled }) => {
  const { models } = useLLMStore()

  const buttonTextColor = selected ? 'text-gray-700 dark:text-neutral-200' : 'text-gray-500 dark:text-neutral-400'

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          aria-label="Select LLM model"
          disabled={disabled}
          className={`rounded-full px-3 py-2 ${buttonTextColor} whitespace-nowrap text-sm transition-colors duration-150 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 sm:text-base`}
        >
          {selected || 'Select LLM'}
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="LLM models">
        {models.map((modelName) => (
          <DropdownItem key={modelName} onClick={() => onSelected(modelName)}>
            {modelName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
