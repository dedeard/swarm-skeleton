export interface ParsedSSEMessage {
  event: 'status' | 'token'
  data: {
    status?: string
    final_answer?: string
    token?: string
  }
}

export function parseSSEMessage(message: string): ParsedSSEMessage {
  const lines = message.split('\n')

  const eventLine = lines.find((line) => line.startsWith('event:'))
  const dataLine = lines.find((line) => line.startsWith('data:'))

  const event = eventLine?.replace('event: ', '').trim()
  const dataStr = dataLine?.replace('data: ', '').trim()

  let data: any = undefined
  if (dataStr) {
    try {
      data = JSON.parse(dataStr)
    } catch (e) {
      console.error('Failed to parse data JSON:', e)
    }
  }

  // @ts-expect-error
  return { event, data }
}
