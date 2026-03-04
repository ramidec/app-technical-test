import { Asset } from 'expo-asset';
import {
  Message,
  MessageRole,
  MessagesPage,
  MessageAttachment,
} from '@/types/message';

// --- Sample attachment data ---

const SAMPLE_IMAGE: MessageAttachment = {
  type: 'image',
  uri: 'https://picsum.photos/seed/chat1/400/300',
  width: 400,
  height: 300,
  caption: 'Project mockup',
};

const SAMPLE_AUDIO: MessageAttachment = {
  type: 'audio',
  uri: '', // resolved lazily from local asset
  durationMs: 5_000,
  waveform: [0.2, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.9, 0.4, 0.2],
};

const SAMPLE_VIDEO: MessageAttachment = {
  type: 'video',
  uri: '', // resolved lazily from local asset
  thumbnailUri: 'https://picsum.photos/seed/video1/400/225',
  durationMs: 3_000,
  width: 640,
  height: 360,
};

const SAMPLE_FILE: MessageAttachment = {
  type: 'file',
  uri: '', // resolved lazily from local asset
  fileName: 'Project-Brief-Q2.pdf',
  fileSizeBytes: 2_450,
  mimeType: 'application/pdf',
};

const SAMPLE_IMAGE_2: MessageAttachment = {
  type: 'image',
  uri: 'https://picsum.photos/seed/chat2/600/400',
  width: 600,
  height: 400,
};

// --- Lazy asset resolution (runs once on first fetch) ---

let assetsResolved = false;

async function ensureLocalAssets(): Promise<void> {
  if (assetsResolved) return;

  const [audioAsset, videoAsset, pdfAsset] = await Promise.all([
    Asset.fromModule(require('@/assets/media/sample-audio.mp3')).downloadAsync(),
    Asset.fromModule(require('@/assets/media/sample-video.mp4')).downloadAsync(),
    Asset.fromModule(require('@/assets/media/sample-document.pdf')).downloadAsync(),
  ]);

  (SAMPLE_AUDIO as any).uri = audioAsset.localUri ?? audioAsset.uri;
  (SAMPLE_VIDEO as any).uri = videoAsset.localUri ?? videoAsset.uri;
  (SAMPLE_FILE as any).uri = pdfAsset.localUri ?? pdfAsset.uri;

  assetsResolved = true;
}

// --- Seed messages (newest first for cursor pagination) ---

function makeTime(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

const AVATAR_ALEXANDRA = 'https://i.pravatar.cc/56?u=alexandra';
const AVATAR_GEORGE = 'https://i.pravatar.cc/56?u=george';

const ALL_MESSAGES: Message[] = [
  // Page 1 (most recent)
  {
    id: 'msg-01',
    role: MessageRole.Client,
    content: "Hey! Are you free to catch up this afternoon? I wanted to go over the project timeline before tomorrow's meeting.",
    createdAt: makeTime(42),
    updatedAt: makeTime(42),
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-02',
    role: MessageRole.User,
    content: "Sure, I'm free after 2pm.",
    createdAt: makeTime(40),
    updatedAt: makeTime(40),
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  },
  {
    id: 'msg-03',
    role: MessageRole.Client,
    content: "Perfect. Let's say 2:30? I'll share the Figma designs on the call.",
    createdAt: makeTime(38),
    updatedAt: makeTime(38),
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-04',
    role: MessageRole.User,
    content: "Works for me. Here's the mockup I was working on:",
    createdAt: makeTime(35),
    updatedAt: makeTime(35),
    attachments: [SAMPLE_IMAGE],
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  },
  {
    id: 'msg-05',
    role: MessageRole.Client,
    content: "Nice! The layout looks solid. I recorded a quick walkthrough of the flow:",
    createdAt: makeTime(32),
    updatedAt: makeTime(32),
    attachments: [SAMPLE_VIDEO],
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-06',
    role: MessageRole.User,
    content: "That's really helpful, thanks.",
    createdAt: makeTime(28),
    updatedAt: makeTime(28),
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  },
  {
    id: 'msg-06b',
    role: MessageRole.Client,
    content: "Let me send you a voice note with my thoughts.",
    createdAt: makeTime(27),
    updatedAt: makeTime(27),
    attachments: [SAMPLE_AUDIO],
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-07',
    role: MessageRole.Client,
    content: "Got it! Also here's the brief doc we discussed last week.",
    createdAt: makeTime(25),
    updatedAt: makeTime(25),
    attachments: [SAMPLE_FILE],
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  // Page 2 (older)
  {
    id: 'msg-08',
    role: MessageRole.User,
    content: "Thanks, downloading now. The timeline looks tight but doable if we scope Phase 1 properly.",
    createdAt: makeTime(22),
    updatedAt: makeTime(22),
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  },
  {
    id: 'msg-09',
    role: MessageRole.Client,
    content: "Agreed. I think we should focus on the input redesign first. Check these reference screenshots:",
    createdAt: makeTime(18),
    updatedAt: makeTime(18),
    attachments: [SAMPLE_IMAGE_2],
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-10',
    role: MessageRole.User,
    content: "Love it. The expandable input and the send button animation are key. I'll prototype those today.",
    createdAt: makeTime(15),
    updatedAt: makeTime(15),
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  },
  {
    id: 'msg-11',
    role: MessageRole.Client,
    content: "Sounds good! Let me know if you need the design tokens.",
    createdAt: makeTime(12),
    updatedAt: makeTime(12),
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-11b',
    role: MessageRole.Client,
    content: "I'll push them to the shared Figma file.",
    createdAt: makeTime(11),
    updatedAt: makeTime(11),
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
  {
    id: 'msg-12',
    role: MessageRole.User,
    content: "Will do. See you at 2:30!",
    createdAt: makeTime(10),
    updatedAt: makeTime(10),
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  },
  {
    id: 'msg-13',
    role: MessageRole.Client,
    content: "See you then! 👋",
    createdAt: makeTime(8),
    updatedAt: makeTime(8),
    senderName: 'Alexandra Velcaz',
    senderAvatar: AVATAR_ALEXANDRA,
  },
];

const PAGE_SIZE = 7;

// --- Mock API ---

export async function fetchMessages(cursor?: string): Promise<MessagesPage> {
  // Resolve bundled test assets on first call
  await ensureLocalAssets();

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  let startIndex = 0;
  if (cursor) {
    const idx = ALL_MESSAGES.findIndex(m => m.id === cursor);
    if (idx !== -1) startIndex = idx + 1;
  }

  const pageMessages = ALL_MESSAGES.slice(startIndex, startIndex + PAGE_SIZE);
  const hasMore = startIndex + PAGE_SIZE < ALL_MESSAGES.length;

  return {
    messages: pageMessages,
    nextCursor: hasMore ? pageMessages[pageMessages.length - 1].id : undefined,
  };
}

export async function sendMessage(content: string): Promise<Message> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    id: `msg-${Date.now()}`,
    role: MessageRole.User,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'sent',
    senderName: 'George',
    senderAvatar: AVATAR_GEORGE,
  };
}
