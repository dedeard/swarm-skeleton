import { useTheme } from 'next-themes'
import React from 'react'
import { CustomCodeProps } from '../types'
import { LANGUAGE_MAP, SyntaxHighlighter, oneDark, oneLight } from '../utils/syntaxHighlighter'

const CodeBlock: React.FC<CustomCodeProps> = (props) => {
  const { theme } = useTheme()
  const { className: codeClassName, children, inline, node: _node, ...rest } = props
  const match = /language-(\w+)/.exec(codeClassName || '')
  let language = match ? match[1] : undefined

  if (language && LANGUAGE_MAP[language]) {
    language = LANGUAGE_MAP[language]
  }

  if (inline) {
    return (
      <code className="rounded-sm bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-700" {...rest}>
        {children}
      </code>
    )
  }

  if (language) {
    return (
      <SyntaxHighlighter
        style={(theme === 'light' ? oneLight : oneDark) as any}
        language={language}
        PreTag="div"
        className="rounded-md text-sm shadow-md"
        showLineNumbers={false}
        wrapLines={true}
        lineProps={{
          style: {
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
            fontSize: '0.875rem',
          },
        }}
        {...rest}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    )
  }

  return (
    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm leading-normal shadow-md dark:bg-neutral-900" {...rest}>
      <code className={codeClassName}>{children}</code>
    </pre>
  )
}

export default CodeBlock
