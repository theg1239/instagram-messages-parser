// app/components/MessagesView.tsx

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from "../components/ui/scroll-area"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Send, Heart } from 'lucide-react'
import { Message } from '../types'

interface MessagesViewProps {
  messages: Message[]
  participant: string
}

const MessagesView: React.FC<MessagesViewProps> = ({ messages, participant }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set())
  const [newMessage, setNewMessage] = useState<string>('')

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const toggleLike = (index: number) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    // Implement message sending logic here
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
      <ScrollArea
        className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md overflow-y-auto"
        ref={scrollAreaRef}
      >
        {messages.map((message, index) => {
          const isYou = message.sender_name.toLowerCase() === 'you'
          const isLiked = likedMessages.has(index)
          return (
            <div key={index} className={`mb-4 flex ${isYou ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-xs px-4 py-2 rounded-3xl ${
                isYou
                  ? 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white dark:from-blue-700 dark:to-purple-700'
                  : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                <p className="text-sm">
                  {message.content || `[${message.type} message]`}
                </p>
                <span className="text-xs text-right block mt-1 text-gray-600 dark:text-gray-400">
                  {new Date(message.timestamp_ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  className="absolute -bottom-2 -right-2 focus:outline-none"
                  onClick={() => toggleLike(index)}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'text-pink-500 fill-current' : 'text-gray-500 dark:text-gray-400'}`}
                  />
                </button>
              </div>
              {/* Display Photos */}
              {message.photos && message.photos.length > 0 && (
                <div className={`mt-2 ml-2 ${isYou ? 'order-1 mr-2' : 'ml-2'}`}>
                  {message.photos.map((photo, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={photo.uri}
                      alt={`Photo ${photoIndex + 1}`}
                      className="w-32 h-32 object-cover rounded-md mb-2"
                    />
                  ))}
                </div>
              )}
              {/* Display Videos */}
              {message.videos && message.videos.length > 0 && (
                <div className={`mt-2 ml-2 ${isYou ? 'order-1 mr-2' : 'ml-2'}`}>
                  {message.videos.map((video, videoIndex) => (
                    <video
                      key={videoIndex}
                      controls
                      src={video.uri}
                      className="w-32 h-32 object-cover rounded-md mb-2"
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </ScrollArea>
      <div className="p-4 border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Input
            className="flex-1 mr-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
            className="flex items-center justify-center w-10 h-10 p-0 bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-600"
          >
            <Send className="w-4 h-4 text-white" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MessagesView
