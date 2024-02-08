import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MobileMenu } from 'Components';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import MyComments from 'Components/Channel/MyComments';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { getChannelUserInfo } from 'util/user-http';
import { FeedList } from 'Components/Channel/Feeds/FeedList';

interface UserCommentInfoType {
  comment: string;
  created_at: string;
  deleted_at: null | string;
  feed: {
    id: number;
    user: {
      id: number;
    };
  };
  id: number;
  is_private: boolean;
  parent: { id: 65; user: { id: number } };
  updated_at: string;
  user: { id: number };
}

interface UserCommentType {
  commentCntByUserId: number;
  commentListByUserId: UserCommentInfoType[];
  totalScrollCnt: number;
}

export const MyPage = () => {
  const [totalFeedCount, setTotalFeedCount] = useState<number | undefined>(0);
  const [pageNum, setPageNum] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [commentList, setCommentList] = useState<UserCommentInfoType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  let token = sessionStorage.getItem('token');

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

  useEffect(() => {
    setLoading(true);
    setError(false);
    let headers;
    if (token) {
      headers = { Accept: 'application/json', token: token };
    } else {
      headers = { Accept: 'application/json' };
    }
    const controller = new AbortController();
    axios
      .get<UserCommentType>(
        `${BACK_URL}/users/userinfo/${userId}/comments?index=${pageNum}&limit=10`,
        {
          timeout: 5000,
          signal: controller.signal,
          headers: headers,
        }
      )
      .then(res => {
        setCommentList(prevCommentList => {
          return [
            ...new Set([...prevCommentList, ...res.data.commentListByUserId]),
          ];
        });
        setCommentCount(res.data.commentCntByUserId);
        setHasMore(res.data.commentListByUserId.length > 0);
        setLoading(false);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          return;
        }
        setError(true);
      });

    return () => controller.abort();
  }, [pageNum]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNumber: number) => prevPageNumber + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (error) {
      alert('잠시 후 다시 시도해주세요.');
    }
  }, [error]);

  const myComments = () => {
    if (commentList?.length) {
      return (
        <Fragment>
          <div>댓글 수 : {commentCount}개</div>
          {commentList?.map((comment, index) => {
            if (commentList.length === index + 1) {
              return (
                <MyComments
                  key={comment.id}
                  ref={lastCommentElementRef}
                  userComments={comment}
                  index={index}
                  loginUserId={loginUserInfo?.id}
                />
              );
            } else {
              return (
                <MyComments
                  key={comment.id}
                  userComments={comment}
                  index={index}
                  loginUserId={loginUserInfo?.id}
                />
              );
            }
          })}
          {loading && (
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 border-4 border-mainsky rounded-full border-t-4 border-t-white animate-spin" />
          )}
        </Fragment>
      );
    } else {
      return (
        <div className="w-full h-full flexCenterAlign">
          작성한 댓글이 없습니다😢
        </div>
      );
    }
  };

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
              가입일 : {myPageUserInfo?.created_at.slice(0, -16)}
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
            myComments()
          )}
        </div>
      </div>
    </Fragment>
  );
};
