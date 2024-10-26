// app/api/upload/route.ts

import { NextResponse } from 'next/server';
import AdmZip, { IZipEntry } from 'adm-zip';
import { Conversation, Message, Media } from '../../types';

export const config = {
  api: {
    bodyParser: false, // Disallow Next.js's default body parsing
  },
};

/**
 * Custom interface for ZIP entries after declaring them in types.d.ts
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Debug: Log file information
    console.log('File received:', file);
    console.log('File type:', file.type);
    console.log('File name:', file.name);

    // Adjust file type validation
    if (!file || !file.name.endsWith('.zip')) {
      console.error("Invalid file type or missing file.");
      return NextResponse.json({ error: 'Please upload a valid ZIP file' }, { status: 400 });
    }

    // Read the ZIP file contents
    const arrayBuffer = await file.arrayBuffer();
    const zip = new AdmZip(Buffer.from(arrayBuffer));
    const zipEntries: IZipEntry[] = zip.getEntries();

    const conversations: Conversation[] = [];

    zipEntries.forEach((entry: IZipEntry) => {
      console.log(`Processing entry: ${entry.entryName}`);
      const pathParts = entry.entryName.split('/');
      console.log('Path breakdown:', pathParts);

      if (pathParts.length < 2 || pathParts[0].toLowerCase() !== 'inbox') {
        console.warn(`Skipping entry not in 'inbox/' folder: ${entry.entryName}`);
        return;
      }

      const conversationFolder = pathParts[1];
      const fileName = pathParts[pathParts.length - 1];
      const subPath = pathParts.slice(2);

      let conversation = conversations.find(conv => conv.thread_path === conversationFolder);
      if (!conversation) {
        console.log(`Creating new conversation for folder: ${conversationFolder}`);
        conversation = {
          participants: [],
          messages: [],
          title: conversationFolder,
          thread_path: conversationFolder,
          is_still_participant: true,
          magic_words: [],
        };
        conversations.push(conversation);
      }

      if (fileName.startsWith('message') && fileName.endsWith('.json')) {
        const jsonData = entry.getDataAsText();
        try {
          console.log(`Parsing JSON message file: ${fileName}`);
          const parsed: Conversation = JSON.parse(jsonData);

          if (conversation.participants.length === 0) {
            console.log(`Setting participants for conversation ${conversationFolder}`);
            conversation.participants = parsed.participants;
          }

          console.log(`Adding messages to conversation ${conversationFolder}`);
          conversation.messages.push(...parsed.messages);
        } catch (err) {
          console.error(`Error parsing JSON file ${fileName} in ${conversationFolder}:`, err);
        }
      }

      if (subPath.length > 0) {
        const mediaTypeFolder = subPath[0].toLowerCase();
        if (mediaTypeFolder === 'photos' || mediaTypeFolder === 'videos') {
          const mediaType: 'photo' | 'video' = mediaTypeFolder === 'photos' ? 'photo' : 'video';
          const mediaBuffer = zip.readFile(entry);

          if (mediaBuffer) {
            console.log(`Processing media file: ${fileName} as ${mediaType}`);
            const mimeType = mediaType === 'photo' ? 'image/jpeg' : 'video/mp4';
            const mediaUri = `data:${mimeType};base64,${mediaBuffer.toString('base64')}`;

            const mediaMessage: Message = {
              sender_name: 'Instagram',
              timestamp_ms: Date.now(),
              content: `[Media ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}]`,
              is_geoblocked_for_viewer: false,
              type: 'Share',
              ...(mediaType === 'photo' ? { photos: [{ uri: mediaUri, type: 'photo' }] } : { videos: [{ uri: mediaUri, type: 'video' }] }),
            };

            conversation.messages.push(mediaMessage);
          } else {
            console.warn(`Failed to read media file: ${fileName}`);
          }
        }
      }
    });

    conversations.forEach(conversation => {
      conversation.messages.sort((a, b) => a.timestamp_ms - b.timestamp_ms);
    });

    console.log('Conversations processed:', conversations);
    return NextResponse.json({ success: true, conversations }, { status: 200 });
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
