// app/components/ConversationsList.tsx

'use client'

import React from 'react'
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { ScrollArea } from "../components/ui/scroll-area"
import { Conversation } from '../types'
import { decodeUnicode } from '../../lib/decodeUnicode'

interface ConversationsListProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
  selectedConversation: Conversation | null
  yourName: string 
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations = [],
  onSelectConversation,
  selectedConversation,
  yourName
}) => {

  const isReactionMessage = (content: string | undefined): boolean => {
    if (!content) return false

    const decodedContent = decodeUnicode(content)

    const reactionPattern = /(liked this message|reacted to|ಸಂದೇಶವನ್ನು\s+ಇಷ್ಟಪಟ್ಟಿದ್ದಾರೆ|ನಿಮ್ಮ\s+ಸಂದೇಶದ\s+ಗೆ)/i
    return reactionPattern.test(decodedContent)
  }

  return (
    <ScrollArea className="h-full scroll-area">
      <div className="px-4 py-2">
        <ul className="space-y-2">
          {conversations.map((conversation, index) => {
            const nonReactionMessages = conversation.messages.filter(msg => !isReactionMessage(msg.content))
            const lastMessage = nonReactionMessages[nonReactionMessages.length - 1] || null
            const isSelected = selectedConversation?.thread_path === conversation.thread_path

            const conversationTitle = conversation.title
              ? decodeUnicode(conversation.title)
              : conversation.participants?.map(p => p.name).join(', ')

            return (
              <li
                key={conversation.thread_path || index}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isSelected ? 'bg-gray-200 dark:bg-gray-700' : ''
                } transition-colors duration-200`}
                onClick={() => onSelectConversation(conversation)}
              >
                <Avatar className="w-14 h-14 mr-3">
                  <AvatarFallback>{conversationTitle ? conversationTitle[0] : '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-foreground dark:text-input-text truncate">
                      {conversationTitle}
                    </p>
                    {lastMessage && lastMessage.timestamp_ms && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(lastMessage.timestamp_ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-foreground dark:text-input-text truncate">
                      {lastMessage.sender_name.toLowerCase() === yourName.toLowerCase() ? 'You: ' : ''}
                      {decodeUnicode(lastMessage.content || `[${lastMessage.type || 'Unknown'} message]`)}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </ScrollArea>
  )
}

export default ConversationsList
