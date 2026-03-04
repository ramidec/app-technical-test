// Safe wrapper for expo-audio — NitroModules are unavailable in Expo Go.
// Exports real hooks when available, stubs otherwise.

let _useAudioPlayer: any;
let _useAudioPlayerStatus: any;
let _available = false;

try {
  const mod = require('expo-audio');
  _useAudioPlayer = mod.useAudioPlayer;
  _useAudioPlayerStatus = mod.useAudioPlayerStatus;
  _available = true;
} catch {
  // Expo Go — provide no-op stubs
}

const NOOP_STATUS = {
  playing: false,
  currentTime: 0,
  duration: 0,
  didJustFinish: false,
};

const NOOP_PLAYER = {
  play: () => {},
  pause: () => {},
  seekTo: (_pos: number) => {},
  setPlaybackRate: (_rate: number) => {},
};

export const isAudioAvailable = _available;

export function useAudioPlayer(uri: string | undefined, opts?: any) {
  if (_available) return _useAudioPlayer(uri, opts);
  return NOOP_PLAYER;
}

export function useAudioPlayerStatus(player: any) {
  if (_available) return _useAudioPlayerStatus(player);
  return NOOP_STATUS;
}
