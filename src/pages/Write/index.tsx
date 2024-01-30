import { Fragment, useState } from 'react';
import { json, useSearchParams, useSubmit } from 'react-router-dom';
import { AlertModal, MobileMenu } from 'Components';
import {
  CategoryType,
  EstimationType,
  ModifyDataType,
  getEstimation,
  getModifyFeedData,
} from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';
import { getCategoryQuery } from 'pages/Main';
import { useQueries } from '@tanstack/react-query';
import FeedForm from 'Components/FeedCRUD/FeedForm';

const getEstimationQuery = () => ({
  queryKey: ['estimation'],
  queryFn: ({ signal }: { signal: AbortSignal }) => getEstimation({ signal }),
  staleTime: Infinity,
});

const getModifyFeedDataQuery = (feedId: string | null) => ({
  queryKey: ['modifyFeedData', { modifyFeedId: feedId }],
  queryFn: () => getModifyFeedData({ feedId }),
});

export const WriteFeed = () => {
  // 임시저장 저장 여부 메세지 출력을 위한 state
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  let searchParamsId = searchParams.get('id');
  let mode = searchParams.get('mode');
  let id = searchParams.get('id');

  let queriesArray = searchParamsId
    ? [
        getEstimationQuery(),
        getCategoryQuery(),
        getModifyFeedDataQuery(searchParamsId),
      ]
    : [getEstimationQuery(), getCategoryQuery()];
  const writeFeedData = useQueries({
    queries: queriesArray,
  });

  let estimationList = writeFeedData[0].data as EstimationType[];
  let categoryList = writeFeedData[1].data as CategoryType[];
  let modifyFeedData =
    searchParamsId && (writeFeedData[2].data as ModifyDataType);

  const submit: any = useSubmit();

  const onSubmit = (data: any) => {
    submit(data, { method: 'PATCH' });
  };

  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-noScroll relate my-0 mx-auto bg-bg-gray">
        <div className="flex justify-between items-center w-4/5 my-0 mx-auto px-8 pt-8">
          <h1 className="text-xl font-bold">
            {mode === 'write' ? '게시글 작성' : '게시글 수정'}
          </h1>
        </div>
        <FeedForm
          estimationList={estimationList}
          categoryList={categoryList}
          modifyFeedData={modifyFeedData && modifyFeedData}
          mode={mode}
          id={id}
          setIsSaved={setIsSaved}
          onSubmit={onSubmit}
        />
      </div>
      <AlertModal />
    </Fragment>
  );
};

export const feedWriteLoader = async ({ request }: { request: Request }) => {
  const feedId = new URL(request.url).searchParams.get('id');
  const [estimation, category, modifyFeedData] = await Promise.all([
    queryClient.fetchQuery(getEstimationQuery()),
    queryClient.fetchQuery(getCategoryQuery()),
    feedId && queryClient.fetchQuery(getModifyFeedDataQuery(feedId)),
  ]);
  queryClient.setQueryData(['estimation'], estimation);
  queryClient.setQueryData(['category'], category);
  feedId &&
    queryClient.setQueryData(
      ['modifyFeedData', { modifyFeedId: feedId }],
      modifyFeedData
    );
  return json({ estimation, category, modifyFeedData });
};
