import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/mockMessages';
import { Message } from '@/types/message';
import { getCachedMessages, setCachedMessages } from '@/services/storage';

const CHANNEL_ID = 'mock-channel';

export function useMessages() {
  // Read cached messages synchronously on first render (< 1ms via MMKV)
  const cachedRef = useRef<Message[] | null>(null);
  if (cachedRef.current === null) {
    cachedRef.current = getCachedMessages() ?? [];
  }

  const query = useInfiniteQuery({
    queryKey: ['messages', CHANNEL_ID],
    queryFn: ({ pageParam }) => fetchMessages(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Auto-fetch all remaining pages so every message is ready
  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  // Flatten pages into a single sorted array
  const freshMessages: Message[] = query.data?.pages.flatMap(page => page.messages) ?? [];

  // Only "fully loaded" once initial + all subsequent pages are done
  const isFullyLoaded =
    !query.isLoading && !query.isFetchingNextPage && query.hasNextPage === false;

  // Persist to MMKV once all fresh data is loaded
  useEffect(() => {
    if (isFullyLoaded && freshMessages.length > 0) {
      setCachedMessages(freshMessages);
    }
  }, [isFullyLoaded, freshMessages.length]);

  // Use fresh data when available, otherwise cached
  const messages = freshMessages.length > 0 ? freshMessages : (cachedRef.current ?? []);
  const hasCachedData = (cachedRef.current?.length ?? 0) > 0;

  return {
    messages,
    isLoading: !isFullyLoaded && !hasCachedData, // skip skeleton when cache exists
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
