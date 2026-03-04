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
  uri: 'https://example.com/voice-note.m4a',
  durationMs: 34_000,
  waveform: [0.2, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4, 0.6, 0.8, 0.3, 0.5, 0.7, 0.9, 0.4, 0.2],
};

const SAMPLE_VIDEO: MessageAttachment = {
  type: 'video',
  uri: 'https://example.com/screen-recording.mp4',
  thumbnailUri: 'https://picsum.photos/seed/video1/400/225',
  durationMs: 127_000,
  width: 1920,
  height: 1080,
};

const SAMPLE_FILE: MessageAttachment = {
  type: 'file',
  uri: 'https://example.com/project-brief.pdf',
  fileName: 'Project-Brief-Q2.pdf',
  fileSizeBytes: 2_450_000,
  mimeType: 'application/pdf',
};

const SAMPLE_IMAGE_2: MessageAttachment = {
  type: 'image',
  uri: 'https://picsum.photos/seed/chat2/600/400',
  width: 600,
  height: 400,
};

// --- Seed messages (newest first for cursor pagination) ---

function makeTime(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

const ALL_MESSAGES: Message[] = [
  // Page 1 (most recent)
  {
    id: 'msg-01',
    role: MessageRole.Client,
    content: "Hey! Are you free to catch up this afternoon? I wanted to go over the project timeline before tomorrow's meeting.",
    createdAt: makeTime(42),
    updatedAt: makeTime(42),
  },
  {
    id: 'msg-02',
    role: MessageRole.User,
    content: "Sure, I'm free after 2pm.",
    createdAt: makeTime(40),
    updatedAt: makeTime(40),
  },
  {
    id: 'msg-03',
    role: MessageRole.Client,
    content: "Perfect. Let's say 2:30? I'll share the Figma designs on the call.",
    createdAt: makeTime(38),
    updatedAt: makeTime(38),
  },
  {
    id: 'msg-04',
    role: MessageRole.User,
    content: "Works for me. Here's the mockup I was working on:",
    createdAt: makeTime(35),
    updatedAt: makeTime(35),
    attachments: [SAMPLE_IMAGE],
  },
  {
    id: 'msg-05',
    role: MessageRole.Client,
    content: "Nice! The layout looks solid. I recorded a quick walkthrough of the flow:",
    createdAt: makeTime(32),
    updatedAt: makeTime(32),
    attachments: [SAMPLE_VIDEO],
  },
  {
    id: 'msg-06',
    role: MessageRole.User,
    content: "That's really helpful, thanks. Let me send you a voice note with my thoughts.",
    createdAt: makeTime(28),
    updatedAt: makeTime(28),
    attachments: [SAMPLE_AUDIO],
  },
  {
    id: 'msg-07',
    role: MessageRole.Client,
    content: "Got it! Also here's the brief doc we discussed last week.",
    createdAt: makeTime(25),
    updatedAt: makeTime(25),
    attachments: [SAMPLE_FILE],
  },
  // Page 2 (older)
  {
    id: 'msg-08',
    role: MessageRole.User,
    content: "Thanks, downloading now. The timeline looks tight but doable if we scope Phase 1 properly.",
    createdAt: makeTime(22),
    updatedAt: makeTime(22),
  },
  {
    id: 'msg-09',
    role: MessageRole.Client,
    content: "Agreed. I think we should focus on the input redesign first. Check these reference screenshots:",
    createdAt: makeTime(18),
    updatedAt: makeTime(18),
    attachments: [SAMPLE_IMAGE_2],
  },
  {
    id: 'msg-10',
    role: MessageRole.User,
    content: "Love it. The expandable input and the send button animation are key. I'll prototype those today.",
    createdAt: makeTime(15),
    updatedAt: makeTime(15),
  },
  {
    id: 'msg-11',
    role: MessageRole.Client,
    content: "Sounds good! Let me know if you need the design tokens. I'll push them to the shared Figma file.",
    createdAt: makeTime(12),
    updatedAt: makeTime(12),
  },
  {
    id: 'msg-12',
    role: MessageRole.User,
    content: "Will do. See you at 2:30!",
    createdAt: makeTime(10),
    updatedAt: makeTime(10),
  },
  {
    id: 'msg-13',
    role: MessageRole.Client,
    content: "See you then! 👋",
    createdAt: makeTime(8),
    updatedAt: makeTime(8),
  },
];

const PAGE_SIZE = 7;

// --- Mock API ---

export async function fetchMessages(cursor?: string): Promise<MessagesPage> {
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
  };
}
