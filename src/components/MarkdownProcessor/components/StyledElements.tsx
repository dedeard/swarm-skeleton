import React, { HTMLAttributes } from 'react'

// Props for elements that might receive 'node' from react-markdown
interface ReactMarkdownElementProps extends HTMLAttributes<HTMLElement> {
  node?: any
  children?: React.ReactNode
}

export const StyledParagraph: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <p className="text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </p>
)

export const StyledH1: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <h1 className="border-gray-200 pb-2 text-xl font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100 lg:text-2xl" {...props}>
    {children}
  </h1>
)

export const StyledH2: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <h2 className="border-gray-200 pb-1 text-lg font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-200 lg:text-xl" {...props}>
    {children}
  </h2>
)

export const StyledH3: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 lg:text-lg" {...props}>
    {children}
  </h3>
)

export const StyledUnorderedList: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <ul className="list-inside list-disc space-y-1 pl-5 text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </ul>
)

export const StyledOrderedList: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <ol className="list-inside list-decimal space-y-1 pl-5 text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </ol>
)

export const StyledListItem: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <li className="text-sm leading-normal" {...props}>
    {children}
  </li>
)

export const StyledLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { node?: any }> = ({
  node: _node,
  children,
  ...props
}) => (
  <a
    className="text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  >
    {children}
  </a>
)

export const StyledBlockquote: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <blockquote
    className="rounded-r-md border-l-4 border-gray-300 bg-gray-50 py-2 pl-4 text-sm italic leading-normal text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
    {...props}
  >
    {children}
  </blockquote>
)

export const StyledHorizontalRule: React.FC<ReactMarkdownElementProps> = ({ node: _node, ...props }) => (
  <hr className="border-gray-200 dark:border-gray-700" {...props} />
)

export const StyledTable: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <div className="overflow-x-auto">
    <table
      className="min-w-full divide-y divide-gray-200 rounded-md border border-gray-200 text-sm shadow-sm dark:divide-gray-700 dark:border-gray-700"
      {...props}
    >
      {children}
    </table>
  </div>
)

export const StyledTableHead: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <thead className="dark:bg-gray-750 bg-gray-50" {...props}>
    {children}
  </thead>
)

export const StyledTableHeaderCell: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300" {...props}>
    {children}
  </th>
)

export const StyledTableBody: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800" {...props}>
    {children}
  </tbody>
)

export const StyledTableCell: React.FC<ReactMarkdownElementProps> = ({ node: _node, children, ...props }) => (
  <td className="whitespace-nowrap px-4 py-2 text-sm leading-normal text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </td>
)
