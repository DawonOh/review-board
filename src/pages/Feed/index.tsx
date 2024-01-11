import { Fragment } from 'react';
import {
  MobileMenu,
  FeedDetail,
  CommentContainer,
  File,
  AlertModal,
} from 'Components';
import {
  feedComments,
  feedDetailData,
  getFeedLike,
  queryClient,
} from 'util/feed-http';
import { useQueries } from '@tanstack/react-query';
import { LoaderFunctionArgs, json, useParams } from 'react-router-dom';

const feedDetailQuery = (feedId: string | undefined) => ({
  queryKey: ['feed', { feedId }],
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    feedDetailData({ feedId, signal }),
  staleTime: 1000 * 60 * 2,
});

const feedCommentsQuery = (feedId: string | undefined) => ({
  queryKey: ['comments', { commentsFeedId: feedId }],
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    feedComments({ feedId, signal }),
  staleTime: 1000 * 60 * 2,
});

const feedLikeQuery = (feedId: string | undefined) => ({
  queryKey: ['like', { likeFeedId: feedId }],
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    getFeedLike({ feedId, signal }),
  staleTime: 1000 * 60 * 2,
});

export const Feed = () => {
  const params = useParams();
  const feedId = params.id;

  const feedData = useQueries({
    queries: [
      feedDetailQuery(feedId),
      feedCommentsQuery(feedId),
      feedLikeQuery(feedId),
    ],
  });

  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-full relate my-0 mx-auto pt-8 bg-bg-gray">
        <FeedDetail
          feedDetailData={feedData[0].data}
          feedLikeData={feedData[2].data}
        />
        <File fileData={feedData[0].data?.uploadFiles} />
        <CommentContainer mainCommentList={feedData[1].data} />
      </div>
      <AlertModal />
    </Fragment>
  );
};

export const feedLoader = async ({ params }: LoaderFunctionArgs) => {
  let feedId = params.id;
  const [feedDetailData, feedCommentsData, feedLikeData] = await Promise.all([
    queryClient.fetchQuery(feedDetailQuery(feedId)),
    queryClient.fetchQuery(feedCommentsQuery(feedId)),
    queryClient.fetchQuery(feedLikeQuery(feedId)),
  ]);
  queryClient.setQueryData(['feed', { feedId }], feedDetailData);
  queryClient.setQueryData(
    ['comments', { commentsFeedId: feedId }],
    feedCommentsData
  );
  queryClient.setQueryData(['like'], { likeFeedId: feedId });
  return json({ feedDetailData, feedCommentsData, feedLikeData });
};
