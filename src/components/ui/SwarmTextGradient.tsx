import { twMerge } from 'tailwind-merge'

const SwarmTextGradient: React.FC<JSX.IntrinsicElements['span']> = ({ className, ...props }) => {
  return <span className={twMerge('bg-gradient-to-r from-primary-500 to-cyan-600 bg-clip-text text-transparent', className)} {...props} />
}

export default SwarmTextGradient
