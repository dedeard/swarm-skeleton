interface StatusEventData {
  status: string
  final_answer?: string
}

interface TokenEventData {
  token: string
}

interface ParsedStatusMessage {
  event: 'status'
  data: StatusEventData
  error?: undefined
}

interface ParsedTokenMessage {
  event: 'token'
  data: TokenEventData
  error?: undefined
}

interface ParsedErrorMessage {
  event: 'status' | 'token' | string | undefined
  data: undefined
  error: string
}

export type ParsedSSEMessage = ParsedStatusMessage | ParsedTokenMessage | ParsedErrorMessage

export function parseSSEMessage(sseBlock: string): ParsedSSEMessage {
  let eventName: string | undefined = undefined
  let jsonDataString: string | undefined = undefined
  const lines = sseBlock.split('\n')

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.substring('event:'.length).trim()
    } else if (line.startsWith('data:')) {
      jsonDataString = line.substring('data:'.length).trim()
    }
  }

  if (!eventName) {
    return {
      event: undefined,
      data: undefined,
      error: "SSE message block is missing 'event:' line.",
    }
  }

  if (jsonDataString === undefined) {
    return {
      event: eventName,
      data: undefined,
      error: "SSE message block is missing 'data:' line or data payload is empty.",
    }
  }

  let parsedData: any
  const prefix = `{"status": "Agent Execution End", "final_answer": "`
  try {
    if (jsonDataString.startsWith(prefix)) {
      parsedData = {
        status: 'Agent Execution End',
        final_answer: jsonDataString.substring(prefix.length, jsonDataString.length - 3),
      }
    } else {
      parsedData = JSON.parse(jsonDataString)
    }
  } catch (e) {
    console.error(`Failed to parse JSON: "${jsonDataString}" for event "${eventName}"`, e)
    return {
      event: eventName,
      data: undefined,
      error: `JSON parsing error: ${e instanceof Error ? e.message : String(e)}`,
    }
  }

  if (eventName === 'status') {
    if (parsedData && typeof parsedData.status === 'string') {
      const statusData: StatusEventData = { status: parsedData.status }
      if (typeof parsedData.final_answer === 'string') {
        statusData.final_answer = parsedData.final_answer
      }
      return { event: 'status', data: statusData }
    } else {
      return {
        event: 'status',
        data: undefined,
        error: "Invalid or missing 'status' field in 'status' event data.",
      }
    }
  } else if (eventName === 'token') {
    if (parsedData && typeof parsedData.token === 'string') {
      const tokenData: TokenEventData = { token: parsedData.token }
      return { event: 'token', data: tokenData }
    } else {
      return {
        event: 'token',
        data: undefined,
        error: "Invalid or missing 'token' field in 'token' event data.",
      }
    }
  } else {
    return {
      event: eventName,
      data: undefined,
      error: `Unknown or unhandled event type: "${eventName}".`,
    }
  }
}
