import { createMMKV } from 'react-native-mmkv';
import type { Message } from '@/types/message';

export const storage = createMMKV({ id: 'chat-storage' });

const MESSAGES_KEY = 'cached-messages';
const CACHE_VERSION_KEY = 'cache-version';
const CURRENT_CACHE_VERSION = 1;

export function getCachedMessages(): Message[] | null {
  try {
    const version = storage.getNumber(CACHE_VERSION_KEY);
    if (version !== CURRENT_CACHE_VERSION) {
      storage.set(MESSAGES_KEY, '');
      return null;
    }
    const raw = storage.getString(MESSAGES_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Message[];
  } catch {
    return null;
  }
}

export function setCachedMessages(messages: Message[]): void {
  try {
    storage.set(MESSAGES_KEY, JSON.stringify(messages));
    storage.set(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
  } catch (e) {
    if (__DEV__) {
      console.error('[storage] Failed to cache messages:', e);
    }
  }
}

export function clearCachedMessages(): void {
  storage.remove(MESSAGES_KEY);
}
