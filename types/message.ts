export enum MessageRole {
  User = 'user',
  Client = 'client',
}

// --- Attachment types (discriminated union) ---

export interface ImageAttachment {
  type: 'image';
  uri: string;
  width: number;
  height: number;
  caption?: string;
}

export interface AudioAttachment {
  type: 'audio';
  uri: string;
  durationMs: number;
  waveform?: number[]; // normalized 0-1 amplitude samples
}

export interface VideoAttachment {
  type: 'video';
  uri: string;
  thumbnailUri: string;
  durationMs: number;
  width: number;
  height: number;
}

export interface FileAttachment {
  type: 'file';
  uri: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
}

export type MessageAttachment =
  | ImageAttachment
  | AudioAttachment
  | VideoAttachment
  | FileAttachment;

// --- Message ---

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments?: MessageAttachment[];
  status?: 'sending' | 'sent' | 'failed';
  senderName?: string;
  senderAvatar?: string;
}

// --- Pagination ---

export interface MessagesPage {
  messages: Message[];
  nextCursor?: string;
}
