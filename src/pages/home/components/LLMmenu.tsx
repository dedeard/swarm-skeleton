import { useLLMStore } from '@/store/llm.store'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'

export const LLMmenu: React.FC<{ selected: string; onSelected: (model: string) => void }> = ({ selected, onSelected }) => {
  const { models } = useLLMStore()
  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          aria-label="More options"
          className="rounded-full p-2 text-neutral-400 transition-colors duration-150 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {selected || 'Select LLM'}
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Example with disabled actions" disabledKeys={['edit', 'delete']}>
        {models.map((el) => (
          <DropdownItem key={el} onClick={() => onSelected(el)}>
            {el}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
