'use client'

import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Conversation } from '../types'

interface UploadFormProps {
  onUploadSuccess: (conversations: Conversation[]) => void
  addDebugLog: (message: string) => void // New prop for logging
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess, addDebugLog }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setSelectedFiles(e.target.files)
    addDebugLog('File selected for upload.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFiles || selectedFiles.length === 0) {
      const errorMsg = 'Please select at least one JSON file.'
      setError(errorMsg)
      addDebugLog(errorMsg)
      return
    }

    try {
      addDebugLog(`Attempting to upload ${selectedFiles.length} file(s).`)
      const conversations: Conversation[] = []

      for (const file of Array.from(selectedFiles)) {
        addDebugLog(`Processing file: ${file.name}`)
        const text = await file.text()
        const data = JSON.parse(text)

        // Example validation log
        if (Array.isArray(data)) {
          addDebugLog(`File ${file.name} parsed successfully.`)
          conversations.push(...data)
        } else {
          const errorMsg = `File ${file.name} does not match the expected structure.`
          setError(errorMsg)
          addDebugLog(errorMsg)
          return
        }
      }

      onUploadSuccess(conversations)
      setSelectedFiles(null)
      ;(document.getElementById('fileInput') as HTMLInputElement).value = ''
    } catch (err) {
      console.error('Parse error:', err)
      const errorMsg = 'An error occurred while parsing the JSON file(s).'
      setError(errorMsg)
      addDebugLog(errorMsg)
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
          disabled={!selectedFiles}
          className="mt-4 w-full max-w-xs"
        >
          Parse JSON
        </Button>
      </form>
    </div>
  )
}

export default UploadForm
