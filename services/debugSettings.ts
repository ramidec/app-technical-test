import { storage } from './storage';

const SKELETON_KEY = 'debug-skeleton-enabled';
const SAVE_MESSAGES_KEY = 'debug-save-messages';
const AI_ENABLED_KEY = 'debug-ai-enabled';

export function getSkeletonEnabled(): boolean {
  return storage.getBoolean(SKELETON_KEY) ?? true;
}

export function setSkeletonEnabled(enabled: boolean): void {
  storage.set(SKELETON_KEY, enabled);
}

export function getSaveMessagesEnabled(): boolean {
  return storage.getBoolean(SAVE_MESSAGES_KEY) ?? true;
}

export function setSaveMessagesEnabled(enabled: boolean): void {
  storage.set(SAVE_MESSAGES_KEY, enabled);
}

export function getAIEnabled(): boolean {
  return storage.getBoolean(AI_ENABLED_KEY) ?? true;
}

export function setAIEnabled(enabled: boolean): void {
  storage.set(AI_ENABLED_KEY, enabled);
}
