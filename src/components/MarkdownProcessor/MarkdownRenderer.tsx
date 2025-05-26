import { useTheme } from 'next-themes'
import React, { HTMLAttributes, memo, useMemo } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw, { Options as RehypeRawOptions } from 'rehype-raw'

import CodeBlock from './components/CodeBlock'
import CustomHtmlBlock from './components/CustomHtmlBlock'
import CustomMarkdownBlock from './components/CustomMarkdownBlock'
import ImageWithLoader from './components/ImageWithLoader'
import {
  StyledBlockquote,
  StyledH1,
  StyledH2,
  StyledH3,
  StyledHorizontalRule,
  StyledLink,
  StyledListItem,
  StyledOrderedList,
  StyledParagraph,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledUnorderedList,
} from './components/StyledElements'
import { useCustomBlockParser } from './hooks/useMarkdownProcessing'
import { CustomCodeProps, MarkdownRendererProps } from './types'

const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content, className }) => {
  const { theme } = useTheme() // theme is used by CodeBlock, but components object is memoized here
  const { processedMarkdown, customBlockDataMap } = useCustomBlockParser(content)

  const rehypePluginsConfig = useMemo((): RehypeRawOptions[] => {
    return [[rehypeRaw, { passThrough: ['div'] }]] as any
  }, [])

  const components = useMemo((): Components => {
    // Define components object here, it will be closed over by the div handler
    const currentComponents: Components = {
      code: (props: CustomCodeProps) => <CodeBlock {...props} />,
      div: (props: HTMLAttributes<HTMLDivElement> & { node?: any; 'data-custom-block-id'?: string }) => {
        const blockId = props['data-custom-block-id']
        if (blockId && customBlockDataMap[blockId]) {
          const blockData = customBlockDataMap[blockId]
          if (blockData.type === 'html') {
            return <CustomHtmlBlock blockData={blockData} />
          } else if (blockData.type === 'markdown') {
            // Pass currentComponents and rehypePluginsConfig for recursive rendering
            return <CustomMarkdownBlock blockData={blockData} components={currentComponents} rehypePlugins={rehypePluginsConfig} />
          } else {
            console.warn(`Custom block "${blockId}" has unknown type: ${blockData.type}`)
            return (
              <div {...props}>
                Error: Custom block type '{blockData.type}' not handled. Placeholder content: {props.children}
              </div>
            )
          }
        }
        return <div {...props}>{props.children}</div>
      },
      img: (props) => <ImageWithLoader {...props} />,
      p: (props) => <StyledParagraph {...props} />,
      h1: (props) => <StyledH1 {...props} />,
      h2: (props) => <StyledH2 {...props} />,
      h3: (props) => <StyledH3 {...props} />,
      ul: (props) => <StyledUnorderedList {...props} />,
      ol: (props) => <StyledOrderedList {...props} />,
      li: (props) => <StyledListItem {...props} />,
      a: (props) => <StyledLink {...props} />,
      blockquote: (props) => <StyledBlockquote {...props} />,
      hr: (props) => <StyledHorizontalRule {...props} />,
      table: (props) => <StyledTable {...props} />,
      thead: (props) => <StyledTableHead {...props} />,
      th: (props) => <StyledTableHeaderCell {...props} />,
      tbody: (props) => <StyledTableBody {...props} />,
      td: (props) => <StyledTableCell {...props} />,
    }
    return currentComponents
  }, [customBlockDataMap, rehypePluginsConfig, theme]) // theme added as CodeBlock indirectly depends on it via components

  if (!processedMarkdown && Object.keys(customBlockDataMap).length === 0 && content) {
    // This case can happen if content is provided but processing is not yet complete or resulted in empty
    // We might want to show a loader or the original content briefly
    // For now, rendering with empty processedMarkdown until it's ready
  }

  return (
    <div className={className}>
      <ReactMarkdown components={components} rehypePlugins={rehypePluginsConfig as any}>
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'

export default MarkdownRenderer
