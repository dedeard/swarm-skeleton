import DOMPurify from 'dompurify'

export const sanitizeHtml = (htmlContent: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(htmlContent)
  }
  return htmlContent // Return as is if not in browser (SSR)
}
