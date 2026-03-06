import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMessages } from '@/services/mockMessages';
import { Message } from '@/types/message';
import { getCachedMessages, setCachedMessages } from '@/services/storage';
import { getSaveMessagesEnabled } from '@/services/debugSettings';
import { CHANNEL_ID } from '@/constants/channels';

export function useMessages() {
  // Read cached messages synchronously on first render (< 1ms via MMKV)
  const cachedRef = useRef<Message[] | null>(null);
  if (cachedRef.current === null) {
    cachedRef.current = getSaveMessagesEnabled() ? (getCachedMessages() ?? []) : [];
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
  const freshMessages = useMemo<Message[]>(
    () => query.data?.pages.flatMap(page => page.messages) ?? [],
    [query.data],
  );

  // Only "fully loaded" once initial + all subsequent pages are done
  const isFullyLoaded =
    !query.isLoading && !query.isFetchingNextPage && query.hasNextPage === false;

  const hasCachedData = (cachedRef.current?.length ?? 0) > 0;

  // Merge fresh data with any user-sent messages from cache.
  // While loading, prefer cache to avoid visual flicker (messages disappearing
  // then reappearing) and scroll jumps from list size changes.
  const messages = useMemo(() => {
    if (!isFullyLoaded) {
      return hasCachedData ? cachedRef.current! : freshMessages;
    }

    // Fully loaded — merge any extra cached messages (user-sent) into fresh data
    if (getSaveMessagesEnabled() && hasCachedData) {
      const freshIds = new Set(freshMessages.map(m => m.id));
      const extras = cachedRef.current!.filter(m => !freshIds.has(m.id));
      if (extras.length > 0) {
        return [...freshMessages, ...extras];
      }
    }

    return freshMessages;
  }, [freshMessages, isFullyLoaded, hasCachedData]);

  // Persist merged list to MMKV once all fresh data is loaded (gated by debug flag)
  useEffect(() => {
    if (isFullyLoaded && messages.length > 0 && getSaveMessagesEnabled()) {
      setCachedMessages(messages);
    }
  }, [isFullyLoaded, messages]);

  return {
    messages,
    isLoading: !isFullyLoaded && !hasCachedData, // skip skeleton when cache exists
  };
}
