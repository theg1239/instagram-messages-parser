// app/components/ConversationsList.tsx

'use client'

import React from 'react'
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { ScrollArea } from "../components/ui/scroll-area"
import { Conversation } from '../types'

interface ConversationsListProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
  selectedConversation: Conversation | null
}

const ConversationsList: React.FC<ConversationsListProps> = ({ conversations, onSelectConversation, selectedConversation }) => {
  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-2">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <ul className="space-y-2">
          {conversations.map((conversation, index) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1] || null
            const isSelected = selectedConversation?.title === conversation.title
            const participant = conversation.participants.find(p => p.name.toLowerCase() !== 'you')?.name || "Unknown"

            return (
              <li
                key={index}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${isSelected ? 'bg-gray-100' : ''}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <Avatar className="w-14 h-14 mr-3">
                  <AvatarFallback>{participant[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-gray-900 truncate">{participant}</p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.timestamp_ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage.sender_name.toLowerCase() === 'you' ? 'You: ' : ''}
                      {lastMessage.content || `[${lastMessage.type} message]`}
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
