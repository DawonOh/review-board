import { Fragment } from 'react';
import { json } from 'react-router-dom';
import { AlertModal, MobileMenu, WriteContainer } from 'Components';
import { getEstimation } from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';
import { getCategoryQuery } from 'pages/Main';
import { useQueries } from '@tanstack/react-query';

const getEstimationQuery = () => ({
  queryKey: ['estimation'],
  queryFn: ({ signal }: { signal: AbortSignal }) => getEstimation({ signal }),
  staleTime: Infinity,
});

export const WriteFeed = () => {
  const writeFeedData = useQueries({
    queries: [getEstimationQuery(), getCategoryQuery()],
  });

  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-noScroll relate my-0 mx-auto bg-bg-gray">
        <WriteContainer
          estimationList={writeFeedData[0].data}
          categoryList={writeFeedData[1].data}
        />
      </div>
      <AlertModal />
    </Fragment>
  );
};

export const feedWriteLoader = async () => {
  const [estimation, category] = await Promise.all([
    queryClient.fetchQuery(getEstimationQuery()),
    queryClient.fetchQuery(getCategoryQuery()),
  ]);
  queryClient.setQueryData(['estimation'], estimation);
  queryClient.setQueryData(['category'], category);
  return json({ estimation, category });
};
