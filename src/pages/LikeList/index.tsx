import { Fragment, useEffect, useState } from 'react';
import { LikeListItem, MobileMenu } from 'Components';
import { useAppSelector } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { getLikeList } from 'util/feed-http';

export const LikeList = () => {
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageGroup, setPageGroup] = useState(1);

  let token = sessionStorage.getItem('token');
  let loginUserId = useAppSelector(state => state.user.id);
  let isLogin = useAppSelector(state => state.login.isLogin);

  const { data } = useQuery({
    queryKey: ['userLikeList', { page: currPage }],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      getLikeList({ signal, loginUserId, currPage }),
    enabled: isLogin ? true : false,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (data) {
      setTotalPage(data.totalPage);
    }
    setPageGroup(Math.ceil(currPage / 10));
  }, [data, currPage]);

  let endPage = pageGroup * 10;
  if (endPage >= totalPage) {
    endPage = totalPage;
  }
  let startPage = endPage - 9;
  if (startPage < 1) {
    startPage = 1;
  }

  const loginLayout = () => {
    if (data?.symbolListByUserId.length !== 0 && token) {
      return data?.symbolListByUserId.map((feed, idx) => {
        return <LikeListItem key={idx} feedData={feed} />;
      });
    }
    if (data?.symbolListByUserId.length === 0 && isLogin) {
      return <div>좋아요를 누른 리뷰가 없습니다.</div>;
    }

    if (!isLogin) {
      return <div>로그인 후 이용해주세요.</div>;
    }
  };

  const pageNumbers = () => {
    let arr = [];
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
    return arr;
  };

  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full w-full p-8">
        <div className="w-4/5 mx-auto my-0">
          <h1 className="text-2xl font-bold">좋아요 목록</h1>
          <div className="flex flex-col gap-4">
            {data?.symbolListByUserId.length !== 0 && isLogin && (
              <div className="flex justify-end gap-4">
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
            )}
            {loginLayout()}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
