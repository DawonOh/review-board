import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Header } from 'Components';
import axios from 'axios';
import Styled from 'styled-components';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import { useParams } from 'react-router-dom';
import { MyFeeds } from 'Components';
import { Pagination } from '@mui/material';
import MyComments from 'Components/MyComments';

const MainContainer = Styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  position: relative;
  margin: 0 auto;
  padding: 2em;
  padding-top: 0;
  @media (max-width: 767px) {
    display: block;
  }
`;

const WriterInfoContainer = Styled.div`
  min-width: 25%;
  height: 70vh;
  padding: 1em;
`;

const WriterFeedListContainer = Styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1em;
  min-height: 70vh;
  padding: 1em;
  border-left: 1px solid #DBDBDB;
  @media (max-width: 767px) {
    border-left: none;
    border-top: 1px solid #DBDBDB;
  }
`;

const TabMenuContainer = Styled.div`
  width: 100%;
  display: flex;
`;

const SelectedMenu = Styled.h1`
  padding: 0.3em;
  font-size: 1.3em;
  font-weight: 700;
  color: #676FA3;
  border: 1px solid #676FA3;
  border-bottom: none;
  cursor: pointer;
`;

const NoneSelectedMenu = Styled.h1`
  padding: 0.3em;
  font-size: 1.3em;
  font-weight: 700;
  background-color: #F0F0F0;
  cursor: pointer;
`;

const ItemTitle = Styled.div`
  margin-bottom: 0.3em;
  font-size: 1.1em;
  font-weight: 700;
`;

const ModifyButton = Styled.button`
  ${ButtonLayout}
  cursor: pointer;
`;

const PaginationContainer = Styled.div`
  display: flex;
  justify-content: center;
`;

const NoResult = Styled.div`
  width: 100%;
  height: 100%;
  ${flexCenterAlign}
`;

const Loader = Styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2em;
  height: 2em;
  border: 5px solid #cddeff;
  border-radius: 50%;
  border-top: 5px solid #fff;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface UserInfoType {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  nickname: string;
  updated_at: string;
}

interface UserFeedType {
  category: string;
  categoryId: number;
  commentCnt: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  filesCnt: string;
  id: number;
  imgCnt: string;
  imgUrl: string;
  likeCnt: string;
  postedAt: string;
  statusId: number;
  title: string;
  updatedAt: string;
  userId: number;
  userNickname: string;
  viewCnt: number;
}

interface UserCommentInfoType {
  children: string[];
  comment: string;
  created_at: string;
  deleted_at: string | null;
  feed: number;
  id: number;
  is_private: boolean;
  parent: number | null;
  updated_at: string;
  user: number;
}

export const MyPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState<UserInfoType>();
  const [myPageUserInfo, setMyPageUserInfo] = useState<UserInfoType>();
  const [userFeedInfo, setUserFeedInfo] = useState<UserFeedType[]>([]);
  const [selectMenu, setSelectMenu] = useState(true);
  const [isDeleted, setIsDeleted] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [commentList, setCommentList] = useState<UserCommentInfoType[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');

  const params = useParams();
  let userId = params.id;

  useEffect(() => {
    axios
      .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      })
      .then(response => {
        setMyPageUserInfo(response.data);
      });

    axios
      .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo/${userId}`, {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      })
      .then(response => {
        setLoginUserInfo(response.data);
      });

    axios
      .get<UserFeedType[]>(
        `${BACK_URL}:${BACK_PORT}/users/userinfo/${userId}/feeds`,
        {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        }
      )
      .then(response => setTotalCount(response.data.length));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const controller = new AbortController();
    axios
      .get<UserCommentInfoType[]>(
        `${BACK_URL}:${BACK_PORT}/users/userinfo/${userId}/comments?index=${pageNum}&limit=10`,
        {
          timeout: 5000,
          signal: controller.signal,
          headers: { token: token },
        }
      )
      .then(res => {
        setCommentList(prevCommentList => {
          return [
            ...new Set([
              ...prevCommentList,
              ...res.data.filter(comment => !comment.deleted_at),
            ]),
          ];
        });
        setHasMore(res.data.length > 0);
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

  useEffect(() => {
    if (isDeleted) {
      axios
        .get<UserCommentInfoType[]>(
          `${BACK_URL}:${BACK_PORT}/users/userinfo/${userId}/comments`,
          {
            timeout: 5000,
            headers: { Accept: 'application/json', Authorization: token },
          }
        )
        .then(response => {
          setCommentCount(
            response.data.filter(comment => !comment.deleted_at).length
          );
        });
    }
  }, [isDeleted]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNumber: number) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  console.log(pageNum);

  useEffect(() => {
    if (error) {
      alert('잠시 후 다시 시도해주세요.');
    }
  }, [error]);

  useEffect(() => {
    axios
      .get<UserFeedType[]>(
        `${BACK_URL}:${BACK_PORT}/users/userinfo/${userId}/feeds?page=${currPage}&limit=4`,
        {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        }
      )
      .then(response => setUserFeedInfo(response.data));
  }, [currPage]);

  const handleClickMenu = () => {
    setSelectMenu(!selectMenu);
  };

  const handlePagination = (e: React.ChangeEvent<any>) => {
    setCurrPage(e.target.textContent);
  };

  const myReview = () => {
    if (totalCount) {
      return (
        <Fragment>
          <div>리뷰 수 : {totalCount}개</div>
          {userFeedInfo?.map((feed, index) => {
            return (
              <Fragment key={feed.id}>
                <MyFeeds
                  userFeeds={feed}
                  index={currPage === 1 ? index : index + (currPage - 1) * 4}
                />
              </Fragment>
            );
          })}
          <PaginationContainer>
            <Pagination
              count={Math.ceil(totalCount / 4)}
              page={Number(currPage)}
              defaultPage={Number(currPage)}
              onChange={handlePagination}
            />
          </PaginationContainer>
        </Fragment>
      );
    } else {
      return <NoResult>작성한 리뷰가 없습니다😢</NoResult>;
    }
  };

  const myComments = () => {
    if (commentList?.length) {
      return (
        <Fragment>
          <div>댓글 수 :{commentCount}개</div>
          {commentList
            .filter(comment => !comment.deleted_at)
            ?.map((comment, index) => {
              if (commentList.length === index + 1) {
                return (
                  <MyComments
                    key={comment.id}
                    ref={lastCommentElementRef}
                    userComments={comment}
                    index={index}
                    setIsDeleted={setIsDeleted}
                  />
                );
              } else {
                return (
                  <MyComments
                    key={comment.id}
                    userComments={comment}
                    index={index}
                    setIsDeleted={setIsDeleted}
                  />
                );
              }
            })}
          {loading && <Loader />}
        </Fragment>
      );
    } else {
      return <NoResult>작성한 댓글이 없습니다😢</NoResult>;
    }
  };
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MainContainer>
        <WriterInfoContainer>
          <ItemTitle>{myPageUserInfo?.nickname}</ItemTitle>
          {Number(loginUserInfo?.id) === Number(userId) && (
            <div>{myPageUserInfo?.email}</div>
          )}
          <div>가입일 : {myPageUserInfo?.created_at.slice(0, -16)}</div>
          <ModifyButton>수정하기</ModifyButton>
        </WriterInfoContainer>
        <WriterFeedListContainer>
          <TabMenuContainer>
            {selectMenu ? (
              <SelectedMenu onClick={handleClickMenu}>작성한 리뷰</SelectedMenu>
            ) : (
              <NoneSelectedMenu onClick={handleClickMenu}>
                작성한 리뷰
              </NoneSelectedMenu>
            )}
            {selectMenu ? (
              <NoneSelectedMenu onClick={handleClickMenu}>
                작성한 댓글
              </NoneSelectedMenu>
            ) : (
              <SelectedMenu onClick={handleClickMenu}>작성한 댓글</SelectedMenu>
            )}
          </TabMenuContainer>
          {selectMenu ? myReview() : myComments()}
        </WriterFeedListContainer>
      </MainContainer>
    </Fragment>
  );
};
