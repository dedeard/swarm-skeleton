import React from 'react'
import { CustomBlockData } from '../types'
import { sanitizeHtml } from '../utils/domPurify'

interface CustomHtmlBlockProps {
  blockData: CustomBlockData
}

const CustomHtmlBlock: React.FC<CustomHtmlBlockProps> = ({ blockData }) => {
  const content = typeof blockData.content === 'string' ? blockData.content : ''
  const sanitizedHtml = sanitizeHtml(content)
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default CustomHtmlBlock
