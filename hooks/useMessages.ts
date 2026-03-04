import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/mockMessages';
import { Message } from '@/types/message';

const CHANNEL_ID = 'mock-channel';

export function useMessages() {
  const query = useInfiniteQuery({
    queryKey: ['messages', CHANNEL_ID],
    queryFn: ({ pageParam }) => fetchMessages(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Flatten pages into a single sorted array
  const messages: Message[] = query.data?.pages.flatMap(page => page.messages) ?? [];

  return {
    messages,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
