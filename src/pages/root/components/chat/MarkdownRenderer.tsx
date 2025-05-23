import { useTheme } from 'next-themes'
import React, { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markdownLang from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Register languages once at module level
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('markdown', markdownLang)

// Language mapping for common aliases
const LANGUAGE_MAP: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  md: 'markdown',
}

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CustomCodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any
  inline?: boolean
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ content, className }) => {
  const { theme } = useTheme()

  const components = useMemo(
    () => ({
      code: (props: CustomCodeProps) => {
        const { className: codeClassName, children, inline, node: _node, ...rest } = props
        const match = /language-(\w+)/.exec(codeClassName || '')
        let language = match ? match[1] : undefined

        // Use language mapping for common aliases
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
                  lineHeight: 1,
                  fontSize: 11,
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
      },
      img: ({ node: _node, src, alt, ...props }: any) => (
        <img src={src} alt={alt} loading="lazy" className="mx-auto block h-auto max-w-full rounded-md shadow-md" {...props} />
      ),
      p: ({ node: _node, children, ...props }: any) => (
        <p className="text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
          {children}
        </p>
      ),
      h1: ({ node: _node, children, ...props }: any) => (
        <h1 className="border-gray-200 pb-2 text-xl font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100 lg:text-2xl" {...props}>
          {children}
        </h1>
      ),
      h2: ({ node: _node, children, ...props }: any) => (
        <h2
          className="border-gray-200 pb-1 text-lg font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-200 lg:text-xl"
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ node: _node, children, ...props }: any) => (
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 lg:text-lg" {...props}>
          {children}
        </h3>
      ),
      ul: ({ node: _node, children, ...props }: any) => (
        <ul className="list-inside list-disc space-y-1 pl-5 text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
          {children}
        </ul>
      ),
      ol: ({ node: _node, children, ...props }: any) => (
        <ol className="list-inside list-decimal space-y-1 pl-5 text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
          {children}
        </ol>
      ),
      li: ({ node: _node, children, ...props }: any) => (
        <li className="text-sm leading-normal" {...props}>
          {children}
        </li>
      ),
      a: ({ node: _node, children, ...props }: any) => (
        <a
          className="text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      ),
      blockquote: ({ node: _node, children, ...props }: any) => (
        <blockquote
          className="rounded-r-md border-l-4 border-gray-300 bg-gray-50 py-2 pl-4 text-sm italic leading-normal text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
          {...props}
        >
          {children}
        </blockquote>
      ),
      hr: ({ node: _node, ...props }: any) => <hr className="border-gray-200 dark:border-gray-700" {...props} />,
      table: ({ node: _node, children, ...props }: any) => (
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y divide-gray-200 rounded-md border border-gray-200 text-sm shadow-sm dark:divide-gray-700 dark:border-gray-700"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ node: _node, children, ...props }: any) => (
        <thead className="dark:bg-gray-750 bg-gray-50" {...props}>
          {children}
        </thead>
      ),
      th: ({ node: _node, children, ...props }: any) => (
        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300" {...props}>
          {children}
        </th>
      ),
      tbody: ({ node: _node, children, ...props }: any) => (
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800" {...props}>
          {children}
        </tbody>
      ),
      td: ({ node: _node, children, ...props }: any) => (
        <td className="whitespace-nowrap px-4 py-2 text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
          {children}
        </td>
      ),
    }),
    [theme],
  )

  return (
    <div className={className}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'

export default MarkdownRenderer
