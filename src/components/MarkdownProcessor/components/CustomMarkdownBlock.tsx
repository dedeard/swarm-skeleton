import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { Options as RehypeRawOptions } from 'rehype-raw'
import { CustomBlockData } from '../types'

interface CustomMarkdownBlockProps {
  blockData: CustomBlockData
  // Pass down the main components and plugins to ensure consistent rendering
  components: Components
  rehypePlugins: RehypeRawOptions[]
}

const CustomMarkdownBlock: React.FC<CustomMarkdownBlockProps> = ({ blockData, components, rehypePlugins }) => {
  return (
    <ReactMarkdown
      components={components}
      rehypePlugins={rehypePlugins as any} // Cast as any if specific type causes issues
    >
      {blockData.content}
    </ReactMarkdown>
  )
}

export default CustomMarkdownBlock
