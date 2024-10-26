import { NextResponse } from 'next/server'
import { Conversation } from '../../types'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function processFile(file: File): Promise<Conversation[] | null> {
  try {
    const text = await file.text()
    const jsonData = JSON.parse(text)

    if (!Array.isArray(jsonData)) {
      console.error('Validation Error: Data is not an array.')
      return null
    }

    return jsonData as Conversation[]
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('file') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    let allConversations: Conversation[] = []

    for (const file of files) {
      if (file.type === 'application/json') {
        const fileConversations = await processFile(file)
        if (fileConversations) {
          allConversations = allConversations.concat(fileConversations)
        }
      }
    }

    if (allConversations.length === 0) {
      return NextResponse.json({ error: 'No valid conversations found in the uploaded files.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, conversations: allConversations })
  } catch (error) {
    console.error('Error processing upload:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
