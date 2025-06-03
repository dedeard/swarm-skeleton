import { Spinner } from '@heroui/spinner'
import { cn } from '@heroui/theme' // Assuming this is the correct import path
import React from 'react'

interface SubmitButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  SendIcon: React.ElementType
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, isLoading, SendIcon }) => {
  return (
    <button
      type="button"
      aria-label={isLoading ? 'Sending message' : 'Send message'}
      title={isLoading ? 'Sending message' : 'Send message'}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={cn(
        'relative flex items-center justify-center rounded-full p-2 text-white transition-colors duration-150 focus:outline-none',
        {
          'bg-primary-500': isLoading,
          'cursor-default bg-primary-500 opacity-50': !isLoading && disabled,
          'bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-black':
            !isLoading && !disabled,
        },
      )}
    >
      {isLoading && <Spinner size="lg" className="absolute" />}
      <SendIcon size={18} className="relative top-[3px] -rotate-45" />
    </button>
  )
}

export default SubmitButton
