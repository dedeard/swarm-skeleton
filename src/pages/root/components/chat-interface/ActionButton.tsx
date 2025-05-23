import React from 'react'

interface ActionButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaLabel: string
  className?: string
  title?: string
  iconColorClass?: string
  hoverIconColorClass?: string
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  disabled,
  ariaLabel,
  className,
  title,
  iconColorClass = 'text-primary-500',
  hoverIconColorClass = 'hover:text-primary-600',
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    title={title || ariaLabel}
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full p-1.5 transition-colors duration-150 focus:bg-white/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${iconColorClass} ${hoverIconColorClass} ${className || ''}`}
  >
    {icon}
  </button>
)

export default ActionButton
