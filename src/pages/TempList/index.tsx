import { Fragment } from 'react';
import { AlertModal, LoadingIcon, MobileMenu, TempFeedItem } from 'Components';
import { getTempList } from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';
import { useQuery } from '@tanstack/react-query';

export interface TempType {
  category: string;
  categoryId: number;
  commentCnt: string;
  content: string;
  createdAt: string;
  deletedAt: null;
  filesCnt: string;
  id: number;
  imgCnt: string;
  imgUrl: null;
  likeCnt: string;
  postedAt: null;
  statusId: number;
  title: string;
  updatedAt: string;
  userId: number;
  userNickname: string;
  viewCnt: number;
}

export const getTempListQuery = () => ({
  queryKey: ['tempList'],
  queryFn: ({ signal }: { signal: AbortSignal }) => getTempList({ signal }),
});

export const TempList = () => {
  const { data, isLoading } = useQuery<TempType[] | undefined>(
    getTempListQuery()
  );
  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-full p-8">
        <div className="w-4/5 mx-auto my-0">
          <h1 className="text-2xl font-bold">임시 저장 목록</h1>
          <div className="flex flex-col gap-4 mt-12">
            {data?.length !== 0 ? (
              data?.map(feed => {
                return <TempFeedItem key={feed.id} feed={feed} />;
              })
            ) : (
              <div className="w-full h-tempListHeight">
                임시 저장된 리뷰가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      <AlertModal />
      {isLoading && <LoadingIcon />}
    </Fragment>
  );
};

export const tempListLoader = async () => {
  return queryClient.ensureQueryData<TempType[]>(getTempListQuery());
};
