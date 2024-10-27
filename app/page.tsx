// app/page.tsx

'use client'

import React, { useState } from 'react'
import UploadForm from './components/UploadForm'
import ConversationsList from './components/ConversationsList'
import MessagesView from './components/MessagesView'
import { Conversation } from './types'
import { decodeUnicode } from '../lib/decodeUnicode'
import DarkModeToggle from './components/DarkModeToggle'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const HomePage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [yourName, setYourName] = useState<string>('')
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [uploadCollapsed, setUploadCollapsed] = useState<boolean>(false)
  const [searchConvo, setSearchConvo] = useState<string>('')
  const [searchMessage, setSearchMessage] = useState<string>('')
  const [debugCollapsed, setDebugCollapsed] = useState<boolean>(false)

  const handleUploadSuccess = (uploadedConversations: Conversation[]) => {
    setConversations(prev => [...prev, ...uploadedConversations])
    addDebugLog('Conversations successfully uploaded and set.')
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    addDebugLog(`Selected Conversation: "${conversation.title}"`)
  }

  const addDebugLog = (message: string) => {
    setDebugLogs(prevLogs => [...prevLogs, message])
  }

  const filteredConversations = conversations.filter(conv => decodeUnicode(conv.title).toLowerCase().includes(searchConvo.toLowerCase()))

  const filteredMessages = selectedConversation ? selectedConversation.messages.filter(msg => decodeUnicode(msg.content || '').toLowerCase().includes(searchMessage.toLowerCase())) : []

  return (
    <div className="flex h-screen bg-background dark:bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-box-border flex flex-col bg-background text-foreground">
        <div className="p-4 border-b border-box-border flex items-center justify-between">
          <span className="text-lg font-bold"></span>
          <input
            type="text"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="Enter your name"
            className="shadow appearance-none border border-box-border rounded w-full py-2 px-3 text-input-text bg-input-bg leading-tight focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="p-4 border-b border-box-border flex items-center justify-between">
          <button
            onClick={() => setUploadCollapsed(!uploadCollapsed)}
            className="flex items-center justify-center w-full text-gray-500 dark:text-gray-400 focus:ring focus:ring-blue-500"
          >
            {uploadCollapsed ? <ChevronDown /> : <ChevronUp />}
          </button>
        </div>
        {!uploadCollapsed && (
          <div className="p-4 border-b border-box-border">
            <UploadForm onUploadSuccess={handleUploadSuccess} addDebugLog={addDebugLog} />
          </div>
        )}
        {conversations.length > 0 && (
          <div className="p-4">
            <input
              type="text"
              placeholder="Search Conversations"
              value={searchConvo}
              onChange={(e) => setSearchConvo(e.target.value)}
              className="w-full p-2 bg-input-bg text-input-text border border-box-border rounded-md focus:ring focus:ring-blue-500"
            />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <ConversationsList
            conversations={filteredConversations}
            onSelectConversation={handleSelectConversation}
            selectedConversation={selectedConversation}
            yourName={yourName}
          />
        </div>
      </div>

      {/* Conversation View */}
      <div className="flex-1 flex flex-col bg-background dark:bg-background text-foreground">
        <div className="px-4 py-2 border-b border-box-border flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedConversation ? decodeUnicode(selectedConversation.title) : 'Select a conversation'}
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="🔎"
              value={searchMessage}
              onChange={(e) => setSearchMessage(e.target.value)}
              className="w-1/5 p-2 bg-input-bg text-input-text border border-box-border rounded-md focus:ring focus:ring-blue-500"
            />
            <DarkModeToggle />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {selectedConversation ? (
            <MessagesView messages={filteredMessages} yourName={yourName} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Logs */}
      <div className={`flex flex-col ${debugCollapsed ? 'w-10' : 'w-1/4'} bg-background dark:bg-background border-box-border border-l overflow-y-auto transition-width duration-300`}>
        <button
          onClick={() => setDebugCollapsed(!debugCollapsed)}
          className="p-2 bg-input-bg dark:bg-input-bg text-gray-600 dark:text-gray-400 focus:ring focus:ring-blue-500"
          aria-label="Toggle Debug Panel"
        >
          {debugCollapsed ? <ChevronLeft /> : <ChevronRight />}
        </button>
        {!debugCollapsed && debugLogs.length > 0 && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <ul className="space-y-2">
              {debugLogs.map((log, index) => (
                <li key={index} className="text-sm text-foreground dark:text-input-text">
                  {log}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
