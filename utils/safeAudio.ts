// Safe wrapper for expo-audio — NitroModules are unavailable in Expo Go.
// Exports real hooks when available, stubs otherwise.

interface AudioPlayer {
  play: () => void;
  pause: () => void;
  seekTo: (position: number) => void;
  setPlaybackRate: (rate: number) => void;
}

interface AudioPlayerStatus {
  playing: boolean;
  currentTime: number;
  duration: number;
  didJustFinish: boolean;
}

const NOOP_PLAYER: AudioPlayer = {
  play: () => {},
  pause: () => {},
  seekTo: (_pos: number) => {},
  setPlaybackRate: (_rate: number) => {},
};

const NOOP_STATUS: AudioPlayerStatus = {
  playing: false,
  currentTime: 0,
  duration: 0,
  didJustFinish: false,
};

function useNoopAudioPlayer(
  _uri: string | undefined,
  _opts?: { updateInterval?: number },
): AudioPlayer {
  return NOOP_PLAYER;
}

function useNoopAudioPlayerStatus(_player: AudioPlayer): AudioPlayerStatus {
  return NOOP_STATUS;
}

let _useAudioPlayer: (uri: string | undefined, opts?: { updateInterval?: number }) => AudioPlayer;
let _useAudioPlayerStatus: (player: AudioPlayer) => AudioPlayerStatus;
let _available = false;

try {
  const mod = require('expo-audio');
  _useAudioPlayer = mod.useAudioPlayer;
  _useAudioPlayerStatus = mod.useAudioPlayerStatus;
  _available = true;
} catch {
  // Expo Go — provide no-op stubs
  _useAudioPlayer = useNoopAudioPlayer;
  _useAudioPlayerStatus = useNoopAudioPlayerStatus;
}

export const isAudioAvailable = _available;

export const useAudioPlayer = _useAudioPlayer;
export const useAudioPlayerStatus = _useAudioPlayerStatus;
