export interface ButtonProps {
  primary?: boolean
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label: string
  onClick?: () => void
}

export const Button = ({ primary = false, size = 'medium', backgroundColor, label, ...props }: ButtonProps) => {
  const classList: string[] = [
    // Base styles often found in a 'storybook-button'
    'font-semibold',
    'rounded',
    'bg-primary-600',
    'cursor-pointer',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'transition-colors',
    'duration-150',
    'ease-in-out',
  ]

  // Size-specific styles (equivalent to `storybook-button--${size}`)
  // Vertical padding and text size. Horizontal padding is overridden by `!px-80`.
  if (size === 'small') {
    classList.push('py-1.5', 'text-sm')
  } else if (size === 'large') {
    classList.push('py-3', 'text-lg')
  } else {
    // medium
    classList.push('py-2', 'text-base')
  }

  // Mode-specific styles (equivalent to `mode` which is 'storybook-button--primary' or 'storybook-button--secondary')
  // These styles are applied assuming the background is already set (by `!bg-blue-500` or `backgroundColor` prop).
  if (primary) {
    // Styles for a primary button, working with the default '!bg-blue-500' (or custom backgroundColor)
    classList.push(
      'text-white', // Assuming a dark primary background
      'hover:bg-blue-600', // Darken the primary background on hover
      'focus:ring-blue-400', // Focus ring color for primary
    )
  } else {
    // Styles for a secondary button.
    // These styles will apply on top of the '!bg-blue-500' if `backgroundColor` is not set.
    // This is an unusual setup for a secondary button, but it's what the original class structure implies.
    // Typically, a secondary button would have its own distinct background.
    // Here, it might be more about text color, borders, or subtle hover effects on the primary-like background.
    classList.push(
      'text-blue-100', // Example: Lighter text on the 'blue-500' background
      'border',
      'border-blue-400', // Example: Border that complements the 'blue-500' background
      'hover:bg-blue-400', // Example: Hover effect that modifies the 'blue-500' background or text
      'focus:ring-blue-300',
    )
  }

  return (
    <button type="button" className={classList.filter(Boolean).join(' ')} style={backgroundColor ? { backgroundColor } : {}} {...props}>
      {label}
    </button>
  )
}
