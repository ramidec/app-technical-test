import { createMMKV } from 'react-native-mmkv';
import type { Message } from '@/types/message';

export const storage = createMMKV({ id: 'chat-storage' });

const MESSAGES_KEY = 'cached-messages';

export function getCachedMessages(): Message[] | null {
  const raw = storage.getString(MESSAGES_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Message[];
  } catch {
    return null;
  }
}

export function setCachedMessages(messages: Message[]): void {
  storage.set(MESSAGES_KEY, JSON.stringify(messages));
}
