import React, { Fragment, useEffect, useState } from 'react';
import { Header } from 'Components';
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

const WriterFeedLisTitle = Styled.h1`
  font-size: 1.3em;
  font-weight: 700;
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

interface LoginUserType {
  userInfo: {
    id: number;
    created_at: string;
    nickname: string;
    email: string;
  };
  userFeeds: [
    {
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
  ];
  userComments: [
    {
      id: number;
      content: string;
      created_at: string;
      updated_at: string;
      userId: number;
      user: {
        id: number;
        nickname: string;
        email: string;
      };
    }
  ];
  userFeedSymbols: [
    {
      id: number;
      created_at: string;
      updated_at: string;
      feed: {
        id: number;
        user: {
          id: number;
          nickname: string;
        };
        title: string;
      };
      symbol: {
        id: number;
        symbol: string;
      };
    }
  ];
}
export const MyPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState<LoginUserType>();
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');

  const params = useParams();
  let feedId = params.id;

  useEffect(() => {
    axios
      .get<LoginUserType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      })
      .then(response => setLoginUserInfo(response.data));
  }, []);

  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MainContainer>
        <WriterInfoContainer>
          <ItemTitle>{loginUserInfo?.userInfo.nickname}</ItemTitle>
          {Number(feedId) === loginUserInfo?.userInfo.id && (
            <div>{loginUserInfo?.userInfo.email}</div>
          )}
          <div>가입일 : {loginUserInfo?.userInfo.created_at.slice(0, -16)}</div>
          <ModifyButton>수정하기</ModifyButton>
        </WriterInfoContainer>
        <WriterFeedListContainer>
          <WriterFeedLisTitle>작성한 리뷰</WriterFeedLisTitle>
          <div>리뷰 수 : {loginUserInfo?.userFeeds.length}개</div>
          {loginUserInfo?.userFeeds.map((feed, index) => {
            return (
              <Fragment key={feed.id}>
                <MyFeeds userFeeds={feed} index={index} />
              </Fragment>
            );
          })}
        </WriterFeedListContainer>
      </MainContainer>
    </Fragment>
  );
};
