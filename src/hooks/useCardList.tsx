import { useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getMainFeedList } from 'util/feed-http';

export const useCardList = (categoryId: number) => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let query = params.get('query');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: query ? ['searchList', { query }] : ['mainList', { categoryId }],
    queryFn: ({ pageParam = 1, signal }) =>
      query
        ? getMainFeedList({ query, pageParam, categoryId, signal })
        : getMainFeedList({ pageParam, categoryId, signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allpages) => {
      const nextPage = allpages.length * 10;
      return lastPage.length === 0 ? undefined : nextPage;
    },
    staleTime: 1000 * 60 * 2,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};
