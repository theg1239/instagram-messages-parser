// app/types.ts

export interface Participant {
  name: string;
}

export interface Photo {
  uri: string;
  type: string;
}

export interface Video {
  uri: string;
  type: string;
}

export interface AudioFile {
  uri: string;
  type: string;
}

export interface Message {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  is_geoblocked_for_viewer: boolean;
  type?: string;
  photos?: Photo[];
  videos?: Video[];
  audio_files?: AudioFile[]; // Support for audio files
}

export interface Conversation {
  participants: Participant[];
  messages: Message[];
  title: string;
  thread_path: string;
  is_still_participant: boolean;
  magic_words: string[];
}
