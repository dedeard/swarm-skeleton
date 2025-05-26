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

SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('markdown', markdownLang)

export const LANGUAGE_MAP: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  md: 'markdown',
}

export { oneDark, oneLight, SyntaxHighlighter }
