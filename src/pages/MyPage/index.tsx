import React, { Fragment, useEffect, useState } from 'react';
import { Header, MyComments } from 'Components';
import axios from 'axios';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import { useParams } from 'react-router-dom';
import { MyFeeds } from 'Components';

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
  const [userCommentInfo, setUserCommentInfo] = useState<UserCommentInfoType[]>(
    []
  );
  const [isDeleted, setIsDeleted] = useState(true);
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
      .then(response => setUserFeedInfo(response.data));
  }, []);

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
          setUserCommentInfo(response.data);
        });
    }
  }, [isDeleted]);

  const handleClickMenu = () => {
    setSelectMenu(!selectMenu);
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
          {selectMenu ? (
            <Fragment>
              <div>리뷰 수 : {userFeedInfo?.length}개</div>
              {userFeedInfo?.map((feed, index) => {
                return (
                  <Fragment key={feed.id}>
                    <MyFeeds userFeeds={feed} index={index} />
                  </Fragment>
                );
              })}
            </Fragment>
          ) : (
            <Fragment>
              <div>댓글 수 : {userCommentInfo?.length}개</div>
              {userCommentInfo?.map((comment, index) => {
                return (
                  <Fragment key={comment.id}>
                    <MyComments
                      userComments={comment}
                      index={index}
                      setIsDeleted={setIsDeleted}
                    />
                  </Fragment>
                );
              })}
            </Fragment>
          )}
        </WriterFeedListContainer>
      </MainContainer>
    </Fragment>
  );
};
