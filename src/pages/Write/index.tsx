import { Fragment } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AlertModal, MobileMenu, WriteContainer } from 'Components';
import { EstimationType, getEstimation } from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';

interface LoaderType {
  estimationList: EstimationType[];
}
const getEstimationQuery = () => ({
  queryKey: ['estimation'],
  queryFn: ({ signal }: { signal: AbortSignal }) => getEstimation({ signal }),
  staleTime: Infinity,
});

export const WriteFeed = () => {
  const writeFeedLoaderData = useLoaderData() as LoaderType;
  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-noScroll relate my-0 mx-auto bg-bg-gray">
        <WriteContainer estimationList={writeFeedLoaderData.estimationList} />
      </div>
      <AlertModal />
    </Fragment>
  );
};

export const feedWriteLoader = async () => {
  return queryClient.fetchQuery(getEstimationQuery());
};
