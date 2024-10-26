export interface Participant {
    name: string
  }
  
  export interface Media {
    uri: string
  }
  
  export interface Message {
    sender_name: string
    timestamp_ms: number
    content?: string
    type: string
    photos?: Media[]
    videos?: Media[]
  }
  
  export interface Conversation {
    title: string
    thread_type: string
    thread_path: string
    is_still_participant: boolean
    participants: Participant[]
    messages: Message[]
  }
  
  export type MessagesFile = Conversation[]
  