import { Message } from '@/types/message';

export interface MessageWithGrouping extends Message {
  isLastInGroup: boolean;
}

export function computeMessageGrouping(messages: Message[]): MessageWithGrouping[] {
  return messages.map((msg, index) => {
    const nextMsg = messages[index + 1];
    const isLastInGroup = !nextMsg || nextMsg.role !== msg.role;
    return { ...msg, isLastInGroup };
  });
}
