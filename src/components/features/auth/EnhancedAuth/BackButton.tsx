import { ArrowLeftIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const BackButton: React.FC<React.JSX.IntrinsicElements['button']> = ({ className, ...props }) => {
  return (
    <button
      type="button"
      className={twMerge(
        'flex cursor-pointer items-center justify-center gap-1 border-0 bg-transparent text-xs text-primary-500 transition-all hover:gap-2 hover:text-primary-600 focus:outline-0',
        className,
      )}
      {...props}
    >
      <ArrowLeftIcon size={16} />
      <span className="block">Back</span>
    </button>
  )
}

export default BackButton
