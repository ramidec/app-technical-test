import { useEffect } from 'react';
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

  // Auto-fetch all remaining pages so every message is ready before skeleton hides
  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Flatten pages into a single sorted array
  const messages: Message[] = query.data?.pages.flatMap(page => page.messages) ?? [];

  // Only "fully loaded" once initial + all subsequent pages are done
  const isFullyLoaded =
    !query.isLoading && !query.isFetchingNextPage && query.hasNextPage === false;

  return {
    messages,
    isLoading: !isFullyLoaded,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
