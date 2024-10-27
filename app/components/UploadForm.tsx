// app/components/UploadForm.tsx

'use client'

import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Conversation } from '../types'

interface UploadFormProps {
  onUploadSuccess: (conversations: Conversation[]) => void
  addDebugLog: (message: string) => void
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
      const errorMsg = 'Please select at least one ZIP file.'
      setError(errorMsg)
      addDebugLog(errorMsg)
      return
    }

    const file = selectedFiles[0]
    if (!file.name.endsWith('.zip')) {
      const errorMsg = 'Please upload a valid ZIP file.'
      setError(errorMsg)
      addDebugLog(errorMsg)
      return
    }

    addDebugLog(`Uploading ${file.name} as ZIP file.`)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let done = false
      let partialData = ''

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          partialData += decoder.decode(value)
          try {
            const parsed = JSON.parse(partialData)
            if (parsed.conversations) {
              onUploadSuccess(parsed.conversations)
              addDebugLog('Conversations uploaded successfully.')
              partialData = ''
            }
          } catch {}
        }
      }
    } catch (error) {
      const errorMsg = 'An error occurred during the upload.'
      setError(errorMsg)
      addDebugLog(errorMsg)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500 dark:bg-blue-700 rounded-full">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-sm text-gray-500 mt-2 text-center dark:text-gray-400">
          Upload Instagram DMs ZIP File
        </p>

        {selectedFiles && (
          <div className="mt-2 w-full text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
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
          Parse ZIP
        </Button>
      </form>
    </div>
  )
}

export default UploadForm
