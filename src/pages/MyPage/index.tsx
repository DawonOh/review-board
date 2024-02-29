import { Fragment, useState } from 'react';
import { AlertModal, MobileMenu } from 'Components';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { getChannelUserInfo } from 'util/user-http';
import { FeedList } from 'Components/Channel/Feeds/FeedList';
import { UserCommentList } from 'Components/Channel/Comments/UserCommentList';

export const MyPage = () => {
  const [totalFeedCount, setTotalFeedCount] = useState<number | undefined>(0);

  const loginUserInfo = useAppSelector(state => state.user);

  const params = useParams();
  let userId = params.id;

  const [searchParams, setSearchParams] = useSearchParams();
  let searchParamType = searchParams.get('type');

  const { data: myPageUserInfo } = useQuery({
    queryKey: ['channelUserInfo', { userId }],
    queryFn: () => getChannelUserInfo({ userId }),
    staleTime: 1000 * 60 * 2,
  });

  return (
    <Fragment>
      <MobileMenu />
      <div className="w-4/5 h-full mx-auto my-0 p-4">
        <div className="flex md:flex-row flex-col justify-between items-center bg-white p-4 rounded-lg border border-mainblue">
          <div>
            <div className="align-baseline pl-4">
              <span className="mb-2 text-xl font-bold">
                {myPageUserInfo?.nickname}
              </span>
              {Number(loginUserInfo?.id) === Number(userId) && (
                <span className="text-sm text-buttongray md:ml-2 ml-0">
                  {myPageUserInfo?.email}
                </span>
              )}
            </div>
            <span className="pl-4">
              가입일 : {myPageUserInfo?.created_at.slice(0, -8)}
            </span>
            {loginUserInfo?.id === Number(userId) && (
              <Link to="/changeinfo" state={{ loginUserId: loginUserInfo?.id }}>
                <button className="px-2 ml-4 border rounded-lg cursor-pointer">
                  수정하기
                </button>
              </Link>
            )}
          </div>
          <div className="font-bold">
            <span className="text-mainred">{totalFeedCount}</span>
            <span className="ml-2">리뷰</span>
          </div>
        </div>
        <div className="flex w-full mt-8 flex-col gap-4 min-h-4/5">
          <div className="w-full flex">
            {searchParamType === 'review' ? (
              <>
                <Link
                  to={`/channel/${userId}?type=review`}
                  className="p-2 text-xl font-bold text-mainblue bg-white border border-mainblue rounded-t-lg border-b-0 cursor-pointer"
                >
                  작성한 리뷰
                </Link>
                <Link
                  to={`/channel/${userId}?type=comment`}
                  className="p-2 text-xl font-bold bg-buttongray rounded-t-lg cursor-pointer"
                >
                  작성한 댓글
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/channel/${userId}?type=review`}
                  className="p-2 text-xl font-bold bg-buttongray rounded-t-lg cursor-pointer"
                >
                  작성한 리뷰
                </Link>
                <Link
                  to={`/channel/${userId}?type=comment`}
                  className="p-2 text-xl font-bold text-mainblue border border-mainblue border-b-0 rounded-t-lg cursor-pointer"
                >
                  작성한 댓글
                </Link>
              </>
            )}
          </div>
          {searchParamType === 'review' ? (
            <FeedList userId={userId} setTotalFeedCount={setTotalFeedCount} />
          ) : (
            <UserCommentList userId={userId} />
          )}
        </div>
      </div>
      <AlertModal />
    </Fragment>
  );
};
