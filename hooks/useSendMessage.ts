import { Alert } from 'react-native';
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { sendMessage } from '@/services/mockMessages';
import { Message, MessageRole, MessagesPage } from '@/types/message';
import { setCachedMessages } from '@/services/storage';
import { getSaveMessagesEnabled } from '@/services/debugSettings';
import { CHANNEL_ID } from '@/constants/channels';

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(content),

    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages', CHANNEL_ID] });

      // Snapshot previous value
      const previous = queryClient.getQueryData<InfiniteData<MessagesPage>>(
        ['messages', CHANNEL_ID]
      );

      // Optimistically add the message to the last page
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        role: MessageRole.User,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'sending',
        senderName: 'George',
        senderAvatar: 'https://i.pravatar.cc/56?u=george',
      };

      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ['messages', CHANNEL_ID],
        (old) => {
          if (!old) return old;
          const pages = [...old.pages];
          const lastPage = pages[pages.length - 1];
          pages[pages.length - 1] = {
            ...lastPage,
            messages: [...lastPage.messages, optimisticMessage],
          };
          return { ...old, pages };
        }
      );

      return { previous, optimisticId: optimisticMessage.id };
    },

    onError: (_err, _content, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          ['messages', CHANNEL_ID],
          context.previous
        );
      }
      Alert.alert('Message failed', 'Your message could not be sent. Please try again.');
    },

    onSuccess: (serverMessage, _content, context) => {
      // Replace optimistic message with server-confirmed message
      let allMessages: Message[] = [];

      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ['messages', CHANNEL_ID],
        (old) => {
          if (!old) return old;
          const updated = {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              messages: page.messages.map(msg =>
                msg.id === context?.optimisticId
                  ? { ...serverMessage, status: 'sent' as const }
                  : msg
              ),
            })),
          };
          allMessages = updated.pages.flatMap(p => p.messages);
          return updated;
        }
      );

      // Side effect OUTSIDE the updater — only cache if debug flag allows
      if (getSaveMessagesEnabled()) {
        setCachedMessages(allMessages);
      }
    },
  });
}
