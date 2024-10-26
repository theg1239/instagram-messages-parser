// app/types.ts

export interface Participant {
    name: string
  }
  
  export interface Media {
    uri: string
    type: 'photo' | 'video'
  }
  
  export interface Message {
    sender_name: string
    timestamp_ms: number
    content?: string
    is_geoblocked_for_viewer: boolean
    type?: string // e.g., "Generic", "Share"
    photos?: Media[]
    videos?: Media[]
  }
  
  export interface Conversation {
    participants: Participant[]
    messages: Message[]
    title: string
    is_still_participant: boolean
    thread_path: string
    magic_words: string[]
  }
  
  export type MessagesFile = Conversation[]
  