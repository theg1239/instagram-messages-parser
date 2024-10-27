// app/components/MessagesView.tsx

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from "../components/ui/scroll-area"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Send } from 'lucide-react'
import { Message } from '../types'
import LazyLoad from 'react-lazyload'
import { decodeUnicode } from '../../lib/decodeUnicode'

interface MessagesViewProps {
  messages: Message[]
  yourName: string
}

const MessagesView: React.FC<MessagesViewProps> = ({ messages, yourName }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [newMessage, setNewMessage] = useState<string>('')

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  // Expanded function to identify reaction messages and filter them out
  const isReactionMessage = (content: string | undefined): boolean => {
    if (!content) return false

    // Decode Unicode for accurate comparison
    const decodedContent = decodeUnicode(content)

    // Identify reaction messages, accounting for different languages or phrases
    const reactionPattern = /(liked|reacted|ಸಂದೇಶವನ್ನು\s+ಇಷ್ಟಪಟ್ಟಿದ್ದಾರೆ)/i
    return reactionPattern.test(decodedContent)
  }

  // Filter out messages that match the reaction pattern
  const filteredMessages = messages.filter(message => !isReactionMessage(message.content))

  const isConsecutiveMessage = (index: number) => {
    if (index === 0) return false
    return filteredMessages[index].sender_name === filteredMessages[index - 1].sender_name
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
      <ScrollArea
        className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md overflow-y-auto"
        ref={scrollAreaRef}
      >
        {filteredMessages.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center">No messages available</div>
        ) : (
          filteredMessages.map((message, index) => {
            const isYou = message.sender_name.toLowerCase() === yourName.toLowerCase()
            const displaySenderName = !isConsecutiveMessage(index)

            return (
              <div key={index} className={`mb-2 ${displaySenderName ? 'mt-4' : ''}`}>
                {displaySenderName && (
                  <p className={`text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 ${isYou ? 'text-right' : 'text-left'}`}>
                    {message.sender_name}
                  </p>
                )}
                <div className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-xs px-4 py-2 rounded-3xl ${
                    isYou
                      ? 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white dark:from-blue-700 dark:to-purple-700'
                      : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  } ${isConsecutiveMessage(index) ? 'mt-1' : 'mt-2'}`}>
                    
                    <p className="text-sm break-words">
                      {decodeUnicode(message.content || `[${message.type} message]`)}
                    </p>

                    {/* Display Photos */}
                    {message.photos && message.photos.length > 0 && (
                      <div className="mt-2">
                        {message.photos.map((photo, photoIndex) => (
                          <LazyLoad key={photoIndex} height={192} offset={100} once>
                            <img
                              src={photo.uri}
                              alt={`Photo ${photoIndex + 1}`}
                              className="w-48 h-48 object-cover rounded-md mb-2"
                              onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-image.png'} 
                            />
                          </LazyLoad>
                        ))}
                      </div>
                    )}

                    {/* Display Videos */}
                    {message.videos && message.videos.length > 0 && (
                      <div className="mt-2">
                        {message.videos.map((video, videoIndex) => (
                          <LazyLoad key={videoIndex} height={192} offset={100} once>
                            <video
                              controls
                              src={video.uri}
                              className="w-48 h-48 object-cover rounded-md mb-2"
                              onError={(e) => {
                                console.warn(`Video failed to load: ${video.uri}`)
                              }}
                            />
                          </LazyLoad>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-gray-600 mt-1 block">
                      {new Date(message.timestamp_ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </ScrollArea>

      {/* Input area for new messages */}
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
