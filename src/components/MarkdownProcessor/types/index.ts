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
  content: string | Record<string, any>
  additional?: Record<string, any>
}

export interface VideoBlockData extends Omit<CustomBlockData, 'content'> {
  type: 'video'
  content: {
    src: string
    alt?: string
    additional?: {
      autoplay?: boolean
      controls?: boolean
      width?: string | number
      height?: string | number
      poster?: string
      muted?: boolean
      loop?: boolean
      preload?: 'none' | 'metadata' | 'auto'
    }
  }
}
