import { HTMLAttributes } from 'react'

export interface MarkdownRendererProps {
  content: string
  className?: string
}

export interface CustomCodeProps extends HTMLAttributes<HTMLElement> {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export interface CustomBlockData {
  type: string
  content: string
  additional?: Record<string, any>
}
