'use client'

import React, { useState } from 'react'
import UploadForm from './components/UploadForm'
import ConversationsList from './components/ConversationsList'
import MessagesView from './components/MessagesView'
import { Conversation } from './types'
import { decodeUnicode } from '../lib/decodeUnicode'


const HomePage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [yourName, setYourName] = useState<string>('') 
  const [debugLogs, setDebugLogs] = useState<string[]>([]) 

  const handleUploadSuccess = (uploadedConversations: Conversation[]) => {
    setConversations(uploadedConversations)
    addDebugLog('Conversations successfully uploaded and set.')
    console.log('Conversations set:')
    uploadedConversations.forEach(conv => {
      console.log(`- "${conv.title}": ${conv.messages.length} messages`)
    })
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    addDebugLog(`Selected Conversation: "${conversation.title}"`)
    console.log('Selected Conversation:', conversation)
  }

  const addDebugLog = (message: string) => {
    setDebugLogs(prevLogs => [...prevLogs, message])
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-1/4 border-r flex flex-col">
        <div className="p-4 border-b">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="Enter your name (e.g., Ishaan)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="p-4 border-b">
          <UploadForm onUploadSuccess={handleUploadSuccess} addDebugLog={addDebugLog} />
        </div>

        <div className="flex-1 overflow-hidden">
          <ConversationsList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedConversation={selectedConversation}
            yourName={yourName} 
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="px-4 py-2 border-b flex items-center">
              <h2 className="text-lg font-semibold">{decodeUnicode(selectedConversation.title)}</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessagesView
                messages={selectedConversation.messages}
                yourName={yourName}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>

      <div className="w-1/4 p-4 bg-gray-200 dark:bg-gray-800 border-l overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
        <ul className="space-y-2">
          {debugLogs.map((log, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HomePage
