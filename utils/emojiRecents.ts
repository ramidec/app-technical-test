import { storage } from '@/services/storage';

const RECENTS_KEY = 'emoji-recents';
const MAX_RECENTS = 30;

export function getRecentEmojis(): string[] {
  try {
    const raw = storage.getString(RECENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function addRecentEmoji(emoji: string): void {
  try {
    const recents = getRecentEmojis();
    // Remove if already present (move to front)
    const filtered = recents.filter((e) => e !== emoji);
    filtered.unshift(emoji);
    // Cap at MAX_RECENTS
    const trimmed = filtered.slice(0, MAX_RECENTS);
    storage.set(RECENTS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('[emojiRecents] Failed to save recent emoji:', e);
  }
}
