'use client'

import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Conversation, Message, Media } from '../types'

interface UploadFormProps {
  onUploadSuccess: (conversations: Conversation[]) => void
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setSelectedFiles(e.target.files)
  }

  const validateJSON = (data: any): data is Conversation[] => {
    if (!Array.isArray(data)) {
      console.error("Validation Error: Data is not an array.")
      return false
    }

    return data.every((conv: any, convIndex: number) => {
      if (typeof conv.title !== 'string') {
        console.error(`Validation Error: title missing or not a string in conversation at index ${convIndex}.`)
        return false
      }

      if (typeof conv.thread_type !== 'string') {
        console.error(`Validation Error: thread_type missing or not a string in conversation at index ${convIndex}.`)
        return false
      }

      if (typeof conv.thread_path !== 'string') {
        console.error(`Validation Error: thread_path missing or not a string in conversation at index ${convIndex}.`)
        return false
      }

      if (typeof conv.is_still_participant !== 'boolean') {
        console.error(`Validation Error: is_still_participant missing or not a boolean in conversation at index ${convIndex}.`)
        return false
      }

      if (!Array.isArray(conv.participants)) {
        console.error(`Validation Error: participants is missing or not an array in conversation at index ${convIndex}.`)
        return false
      }

      const participantsValid = conv.participants.every((participant: any, pIndex: number) => {
        if (typeof participant.name !== 'string') {
          console.error(`Validation Error: name missing or not a string in participant at index ${pIndex} in conversation at index ${convIndex}.`)
          return false
        }
        return true
      })

      if (!participantsValid) {
        console.error(`Validation Error: One or more participants are invalid in conversation at index ${convIndex}.`)
        return false
      }

      if (!Array.isArray(conv.messages)) {
        console.error(`Validation Error: messages is missing or not an array in conversation at index ${convIndex}.`)
        return false
      }

      const allMessagesValid = conv.messages.every((msg: any, msgIndex: number) => {
        if (typeof msg.sender_name !== 'string') {
          console.error(`Validation Error: sender_name missing or not a string in message at index ${msgIndex} in conversation at index ${convIndex}.`)
          return false
        }

        if (typeof msg.timestamp_ms !== 'number') {
          console.error(`Validation Error: timestamp_ms missing or not a number in message at index ${msgIndex} in conversation at index ${convIndex}.`)
          return false
        }

        if (msg.content && typeof msg.content !== 'string') {
          console.error(`Validation Error: content is not a string in message at index ${msgIndex} in conversation at index ${convIndex}.`)
          return false
        }

        if (typeof msg.type !== 'string') {
          console.error(`Validation Error: type missing or not a string in message at index ${msgIndex} in conversation at index ${convIndex}.`)
          return false
        }

        if (msg.photos) {
          if (!Array.isArray(msg.photos)) {
            console.error(`Validation Error: photos is not an array in message at index ${msgIndex} in conversation at index ${convIndex}.`)
            return false
          }
          const photosValid = msg.photos.every((photo: any, photoIndex: number) => {
            if (typeof photo.uri !== 'string') {
              console.error(`Validation Error: uri missing or not a string in photo at index ${photoIndex} in message at index ${msgIndex} in conversation at index ${convIndex}.`)
              return false
            }
            return true
          })
          if (!photosValid) {
            console.error(`Validation Error: One or more photos are invalid in message at index ${msgIndex} in conversation at index ${convIndex}.`)
            return false
          }
        }

        if (msg.videos) {
          if (!Array.isArray(msg.videos)) {
            console.error(`Validation Error: videos is not an array in message at index ${msgIndex} in conversation at index ${convIndex}.`)
            return false
          }
          const videosValid = msg.videos.every((video: any, videoIndex: number) => {
            if (typeof video.uri !== 'string') {
              console.error(`Validation Error: uri missing or not a string in video at index ${videoIndex} in message at index ${msgIndex} in conversation at index ${convIndex}.`)
              return false
            }
            return true
          })
          if (!videosValid) {
            console.error(`Validation Error: One or more videos are invalid in message at index ${msgIndex} in conversation at index ${convIndex}.`)
            return false
          }
        }

        return true
      })

      if (!allMessagesValid) {
        console.error(`Validation Error: One or more messages are invalid in conversation at index ${convIndex}.`)
        return false
      }

      return true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select at least one JSON file.')
      return
    }

    try {
      setLoading(true)
      const conversations: Conversation[] = []

      for (const file of Array.from(selectedFiles)) {
        const text = await file.text()
        const data = JSON.parse(text)

        // Validate the structure
        if (validateJSON(data)) {
          conversations.push(...data)
        } else {
          setError(`File ${file.name} does not match the expected structure.`)
          return
        }
      }

      onUploadSuccess(conversations)
      console.log('Uploaded Conversations:', conversations)
      setSelectedFiles(null)
      ;(document.getElementById('fileInput') as HTMLInputElement).value = ''
    } catch (err) {
      console.error('Parse error:', err)
      setError('An error occurred while parsing the JSON file(s).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".json"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Upload Instagram DMs JSON
        </p>

        {selectedFiles && (
          <div className="mt-2 w-full text-center">
            <p className="text-sm text-gray-600">
              {Array.from(selectedFiles).length} file(s) selected
            </p>
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        <Button
          type="submit"
          disabled={loading || !selectedFiles}
          className="mt-4 w-full max-w-xs"
          variant={loading ? "outline" : "default"}
        >
          {loading ? 'Parsing...' : 'Parse JSON'}
        </Button>
      </form>
    </div>
  )
}

export default UploadForm
