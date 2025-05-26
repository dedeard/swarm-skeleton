import { useEffect, useState } from 'react'
import { CustomBlockData } from '../types'

export const useCustomBlockParser = (markdownContent: string) => {
  const [processedMarkdown, setProcessedMarkdown] = useState<string>('')
  const [customBlockDataMap, setCustomBlockDataMap] = useState<Record<string, CustomBlockData>>({})

  useEffect(() => {
    if (!markdownContent) {
      setProcessedMarkdown('')
      setCustomBlockDataMap({})
      return
    }

    // Regex for complete blocks
    const completeBlockRegex = /!#block#!\s*(\{[\s\S]*?\})\s*!#\/block#!/gs
    // Regex for incomplete blocks (missing closing tag)
    const incompleteBlockRegex = /!#block#!\s*(\{[\s\S]*?)(?:!#\/block#!|$)/gs

    const newCustomBlockDataMap: Record<string, CustomBlockData> = {}
    let blockIdCounter = 0
    let processedContent = markdownContent

    // First, handle complete blocks
    processedContent = processedContent.replace(completeBlockRegex, (_fullMatch, jsonString) => {
      try {
        const jsonData: CustomBlockData = JSON.parse(jsonString)
        const currentBlockId = `custom-block-${blockIdCounter++}`
        newCustomBlockDataMap[currentBlockId] = {
          ...jsonData,
          isComplete: true,
          isLoading: false,
        }
        return `<div data-custom-block-id="${currentBlockId}"></div>`
      } catch (e) {
        console.error('Failed to parse complete block JSON:', e, jsonString)
        const currentBlockId = `custom-block-${blockIdCounter++}`
        newCustomBlockDataMap[currentBlockId] = {
          type: 'unknown',
          content: '',
          isComplete: false,
          isLoading: true,
          parseError: `JSON parse error: ${e instanceof Error ? e.message : 'Unknown error'}`,
        }
        return `<div data-custom-block-id="${currentBlockId}"></div>`
      }
    })

    // Then, handle incomplete blocks (those without closing tags or with incomplete JSON)
    const remainingIncompleteMatches = Array.from(processedContent.matchAll(/!#block#!\s*(\{[\s\S]*?)$/gm))

    for (const match of remainingIncompleteMatches) {
      const jsonString = match[1]
      const currentBlockId = `custom-block-${blockIdCounter++}`

      // Try to parse the JSON to see if it's at least valid so far
      let blockData: CustomBlockData
      try {
        // Check if JSON is potentially incomplete by looking for common incomplete patterns
        const isLikelyIncomplete =
          !jsonString.trim().endsWith('}') ||
          (jsonString.includes('"type":"video"') && !jsonString.includes('"src"')) ||
          (jsonString.match(/"/g) || []).length % 2 !== 0 // Odd number of quotes

        if (isLikelyIncomplete) {
          // Create a loading placeholder for video blocks
          const typeMatch = jsonString.match(/"type"\s*:\s*"([^"]*)"/)
          const blockType = typeMatch ? typeMatch[1] : 'unknown'

          // Try to extract width/height from incomplete JSON to prevent size changes
          const widthMatch = jsonString.match(/"width"\s*:\s*"?([^",}]*)"?/)
          const heightMatch = jsonString.match(/"height"\s*:\s*"?([^",}]*)"?/)

          const extractedWidth = widthMatch ? widthMatch[1] : '100%'
          const extractedHeight = heightMatch ? heightMatch[1] : 'auto'

          blockData = {
            type: blockType,
            content:
              blockType === 'video'
                ? {
                    src: '',
                    alt: 'Loading video...',
                    additional: {
                      width: extractedWidth,
                      height: extractedHeight,
                    },
                  }
                : '',
            isComplete: false,
            isLoading: true,
          }
        } else {
          // Try to parse complete JSON
          const parsedData = JSON.parse(jsonString)
          blockData = {
            ...parsedData,
            isComplete: false,
            isLoading: true,
          }
        }
      } catch (e) {
        // JSON is incomplete or invalid
        const typeMatch = jsonString.match(/"type"\s*:\s*"([^"]*)"/)
        const blockType = typeMatch ? typeMatch[1] : 'unknown'

        // Try to extract width/height from incomplete JSON to prevent size changes
        const widthMatch = jsonString.match(/"width"\s*:\s*"?([^",}]*)"?/)
        const heightMatch = jsonString.match(/"height"\s*:\s*"?([^",}]*)"?/)

        const extractedWidth = widthMatch ? widthMatch[1] : '100%'
        const extractedHeight = heightMatch ? heightMatch[1] : 'auto'

        blockData = {
          type: blockType,
          content:
            blockType === 'video'
              ? {
                  src: '',
                  alt: 'Loading video...',
                  additional: {
                    width: extractedWidth,
                    height: extractedHeight,
                  },
                }
              : '',
          isComplete: false,
          isLoading: true,
          parseError: `Incomplete or invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`,
        }
      }

      newCustomBlockDataMap[currentBlockId] = blockData

      // Replace the incomplete block with a placeholder
      processedContent = processedContent.replace(match[0], `<div data-custom-block-id="${currentBlockId}"></div>`)
    }

    // Only update state if there are actual changes to prevent unnecessary re-renders
    setProcessedMarkdown((prev) => (prev !== processedContent ? processedContent : prev))
    setCustomBlockDataMap((prev) => {
      const hasChanges = JSON.stringify(prev) !== JSON.stringify(newCustomBlockDataMap)
      return hasChanges ? newCustomBlockDataMap : prev
    })
  }, [markdownContent])

  return { processedMarkdown, customBlockDataMap }
}
