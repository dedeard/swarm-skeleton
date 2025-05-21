import React from 'react'

interface SubmitButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  LoadingIcon: React.ElementType
  SendIcon: React.ElementType
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  LoadingIcon,
  SendIcon,
}) => {
  const getButtonClasses = () => {
    let baseClasses =
      'flex items-center justify-center rounded-full p-2 text-white transition-colors duration-150 focus:outline-none'
    if (isLoading) {
      return `${baseClasses} cursor-wait bg-primary-500/70`
    }
    if (disabled) {
      return `${baseClasses} cursor-default bg-neutral-600`
    }
    return `${baseClasses} bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-black`
  }

  return (
    <button
      type="button"
      aria-label={isLoading ? 'Sending message' : 'Send message'}
      title={isLoading ? 'Sending message' : 'Send message'}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={getButtonClasses()}
    >
      {isLoading ? <LoadingIcon size={22} className="animate-spin" /> : <SendIcon size={22} />}
    </button>
  )
}

export default SubmitButton