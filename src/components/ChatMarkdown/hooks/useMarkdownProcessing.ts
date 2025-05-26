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

    const blockRegex = /!#block#!\s*(\{[\s\S]*?\})\s*!#\/block#!/gs
    const newCustomBlockDataMap: Record<string, CustomBlockData> = {}
    let blockIdCounter = 0

    const newMarkdown = markdownContent.replace(blockRegex, (_fullMatch, jsonString) => {
      try {
        const jsonData: CustomBlockData = JSON.parse(jsonString)
        const currentBlockId = `custom-block-${blockIdCounter++}`
        newCustomBlockDataMap[currentBlockId] = jsonData
        return `<div data-custom-block-id="${currentBlockId}"></div>`
      } catch (e) {
        console.error('Failed to parse custom block JSON:', e, jsonString)
        return ``
      }
    })

    setProcessedMarkdown(newMarkdown)
    setCustomBlockDataMap(newCustomBlockDataMap)
  }, [markdownContent])

  return { processedMarkdown, customBlockDataMap }
}
