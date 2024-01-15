import { Fragment } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { AlertModal, MobileMenu, WriteContainer } from 'Components';
import {
  CategoryType,
  EstimationType,
  getCategory,
  getEstimation,
} from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';

interface LoaderType {
  categoryList: CategoryType[];
  estimationList: EstimationType[];
}

const getCategoryQuery = () => ({
  queryKey: ['category'],
  queryFn: ({ signal }: { signal: AbortSignal }) => getCategory({ signal }),
  staleTime: Infinity,
});

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
        <WriteContainer
          categoryList={writeFeedLoaderData.categoryList}
          estimationList={writeFeedLoaderData.estimationList}
        />
      </div>
      <AlertModal />
    </Fragment>
  );
};

export const feedWriteLoader = async () => {
  const [categoryList, estimationList] = await Promise.all([
    queryClient.fetchQuery(getCategoryQuery()),
    queryClient.fetchQuery(getEstimationQuery()),
  ]);
  queryClient.setQueryData(['category'], categoryList);
  queryClient.setQueryData(['estimation'], estimationList);
  return json({
    categoryList,
    estimationList,
  });
};
