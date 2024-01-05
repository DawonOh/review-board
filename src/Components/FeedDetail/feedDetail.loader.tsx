import { LoaderFunctionArgs } from 'react-router-dom';
import { feedDetailData, queryClient } from 'util/http';

const getDetailQuery = (feedId: string | undefined) => ({
  queryKey: ['feed', { feedId }],
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    feedDetailData({ feedId, signal }),
});

export const loader = ({ params }: LoaderFunctionArgs) => {
  let feedId = params.id;
  const query = getDetailQuery(feedId);
  return (
    queryClient.getQueryData(query.queryKey) ??
    queryClient.fetchQuery({
      queryKey: ['feed', { feedId }],
      queryFn: ({ signal }) => feedDetailData({ feedId, signal }),
      staleTime: 1000 * 60 * 2,
    })
  );
};
