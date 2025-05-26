import React from 'react'
import { CustomBlockData } from '../types'
import { sanitizeHtml } from '../utils/domPurify'

interface CustomHtmlBlockProps {
  blockData: CustomBlockData
}

const CustomHtmlBlock: React.FC<CustomHtmlBlockProps> = ({ blockData }) => {
  const sanitizedHtml = sanitizeHtml(blockData.content)
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default CustomHtmlBlock
