// app/page.tsx

'use client'

import React, { useState } from 'react'
import UploadForm from './components/UploadForm'
import ConversationsList from './components/ConversationsList'
import MessagesView from './components/MessagesView'
import DarkModeToggle from './components/DarkModeToggle'
import { Conversation } from './types'

const HomePage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const handleUploadSuccess = (uploadedConversations: Conversation[]) => {
    setConversations(uploadedConversations)
    console.log('Conversations set:', uploadedConversations)
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    console.log('Selected Conversation:', conversation)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      {/* Sidebar */}
      <div className="w-1/3 border-r dark:border-gray-700 flex flex-col bg-gray-100 dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700">
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationsList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedConversation={selectedConversation}
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        {selectedConversation ? (
          <>
            <div className="px-4 py-2 border-b dark:border-gray-700 flex items-center bg-gray-100 dark:bg-gray-800">
              <h2 className="text-lg font-semibold">{selectedConversation.title}</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessagesView
                messages={selectedConversation.messages}
                participant={
                  selectedConversation.participants.find(p => p.name.toLowerCase() !== 'you')?.name || 'Unknown'
                }
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
