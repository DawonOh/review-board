import { useQuery } from '@tanstack/react-query';
import { Fragment, useEffect, useState } from 'react';
import { getChannelFeedInfo } from 'util/user-http';
import { FeedItem } from '../FeedItem';

interface FeedListPropsType {
  userId: string | undefined;
  setTotalFeedCount: (arg: number | undefined) => void;
}

export const FeedList = ({ userId, setTotalFeedCount }: FeedListPropsType) => {
  const [currPage, setCurrPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);

  const { data: userFeedInfo } = useQuery({
    queryKey: ['channelUserFeedList', { userId, feedListPage: currPage }],
    queryFn: () => getChannelFeedInfo({ userId, currPage }),
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    setPageGroup(Math.ceil(currPage / 10));
    setTotalFeedCount(userFeedInfo?.feedCntByUserId);
  }, [currPage, userFeedInfo?.feedCntByUserId]);

  let endPage: number | undefined = pageGroup * 10;
  let totalPage = userFeedInfo?.totalPage;
  if (totalPage && endPage >= totalPage) {
    endPage = userFeedInfo?.totalPage;
  }
  let startPage = endPage && endPage - 9;
  if (startPage && startPage < 1) {
    startPage = 1;
  }

  const pageNumbers = () => {
    let arr = [];
    if (startPage && endPage) {
      for (let i = startPage; i <= endPage; i++) {
        arr.push(
          <span
            className={`flex justify-center items-center cursor-pointer hover:text-mainblue w-4 h-4 p-4 ${
              currPage === i && 'bg-mainsky text-mainblue rounded-full'
            }`}
            key={i}
            onClick={() => {
              setCurrPage(i);
            }}
          >
            {i}
          </span>
        );
      }
    }
    return arr;
  };

  const myReview = () => {
    if (userFeedInfo?.feedListByUserId.length) {
      return (
        <Fragment>
          {userFeedInfo.feedListByUserId?.map((feed, index) => {
            return (
              <Fragment key={feed.id}>
                <FeedItem
                  userFeeds={feed}
                  index={currPage === 1 ? index : index + (currPage - 1) * 4}
                />
              </Fragment>
            );
          })}
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="cursor-pointer hover:text-mainblue"
              onClick={() => setCurrPage(page => page - 1)}
              disabled={currPage === 1}
            >
              이전
            </button>
            {pageNumbers()}
            <button
              className="cursor-pointer hover:text-mainblue"
              onClick={() => setCurrPage(page => page + 1)}
              disabled={currPage === totalPage}
            >
              다음
            </button>
          </div>
        </Fragment>
      );
    } else {
      return (
        <div className="w-full h-full flexCenterAlign">
          작성한 리뷰가 없습니다😢
        </div>
      );
    }
  };

  return <div className="flex flex-col gap-2">{myReview()}</div>;
};
