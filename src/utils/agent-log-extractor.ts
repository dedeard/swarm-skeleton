import { IAgentLog, IChatHistory, IChatMessage, IThreadPreview } from '@/types/agent'

export function getThreadListPreview(log: IAgentLog, snippetMaxLength: number = 50): IThreadPreview[] {
  if (!log || !log.chat_history || log.chat_history.length === 0) {
    return []
  }

  return log.chat_history.map((history: IChatHistory) => {
    const messageCount = history.messages.length
    let firstMessage: IChatMessage | undefined = undefined
    let lastMessage: IChatMessage | undefined = undefined

    if (messageCount > 0) {
      firstMessage = history.messages[0]
      lastMessage = history.messages[messageCount - 1]
    }

    const firstMessageSnippet =
      firstMessage?.content.substring(0, snippetMaxLength) + (firstMessage && firstMessage.content.length > snippetMaxLength ? '...' : '')

    const lastMessageSnippet =
      lastMessage?.content.substring(0, snippetMaxLength) + (lastMessage && lastMessage.content.length > snippetMaxLength ? '...' : '')

    return {
      thread_id: history.thread_id,
      message_count: messageCount,
      first_message_timestamp: firstMessage?.timestamp,
      last_message_timestamp: lastMessage?.timestamp,
      first_message_snippet: firstMessage ? firstMessageSnippet : undefined,
      last_message_snippet: lastMessage ? lastMessageSnippet : undefined,
    }
  })
}

export function getThreadsByThreadId(log: IAgentLog, threadId: string): IChatHistory[] {
  if (!log || !log.chat_history) {
    return []
  }
  return log.chat_history.filter((history) => history.thread_id === threadId)
}

export function getMessagesByThreadId(log: IAgentLog, threadId: string): IChatMessage[] {
  if (!log || !log.chat_history) {
    return []
  }
  const matchingThread = log.chat_history.find((history) => history.thread_id === threadId)
  return matchingThread ? matchingThread.messages : []
}

export function getAllMessagesByThreadId(log: IAgentLog, threadId: string): IChatMessage[] {
  if (!log || !log.chat_history) {
    return []
  }
  return log.chat_history
    .filter((history) => history.thread_id === threadId)
    .reduce((allMessages, currentHistory) => {
      return allMessages.concat(currentHistory.messages)
    }, [] as IChatMessage[])
}
