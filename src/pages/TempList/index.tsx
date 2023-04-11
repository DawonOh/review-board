import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { AlertModal, Header } from 'Components';
import axios from 'axios';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';

const ListContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  width: 100%;
  padding: 2em;
`;

const Container = Styled.div`
  width: 80%;
`;

const Title = Styled.h1`
  font-size: 1.6em;
  font-weight: 700;
`;

const ListItemContainer = Styled.div`
  width: 100%;
  margin-top: 3em;
`;

const ListItem = Styled.div`
  width: 100%;
  padding: 2em;
  border-bottom: 1px solid #DBDBDB;
  cursor: pointer;
`;

const FeedTitleDiv = Styled.div`
  font-size: 1.2em;
  font-weight: 700;
`;

const FeedContentDiv = Styled.div`
  margin-top: 1em;
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
`;

const ButtonDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
`;

const CreatedAtDiv = Styled.div`
  font-size: 0.9em;
  color: #BDBDBD;
`;

const DeleteButton = Styled.button`
  ${ButtonLayout}
  background-color: #FF5959;
  color: #fff;
  cursor: pointer;
`;

const NoDataMessage = Styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`;

interface TempListType {
  message: string;
  result: [
    {
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
  ];
}

interface TempType {
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

interface MessageType {
  id: number;
  text: string;
}

export const TempList = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [tempFeedId, setTempFeedId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const [tempData, setTempData] = useState<TempType[]>([]);
  const openAlertModal = () => {
    if (isAlertModalOpen) {
      return (
        <AlertModal
          isAlertModalOpen={isAlertModalOpen}
          setIsAlertModalOpen={setIsAlertModalOpen}
          contents={messages}
          isQuestion={isQuestion}
          setResult={setResult}
        />
      );
    }
  };

  let token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get<TempListType>(`${BACK_URL}:${BACK_PORT}/feeds/temp`, {
        timeout: 5000,
        headers: { Accept: `application/json`, Authorization: token },
      })
      .then(response => {
        setTempData(response.data.result);
      })
      .catch(() => {
        alert('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      });
  }, [isDeleted]);

  const deleteTempFeed = () => {
    setMessages([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };

  useEffect(() => {
    if (result) {
      axios
        .delete(`${BACK_URL}:${BACK_PORT}/feeds/${tempFeedId}`, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(() => {
          setIsDeleted(true);
        })
        .catch(() => {
          alert('잠시 후 다시 시도해주세요.');
          setIsDeleted(false);
        });
    }
  }, [result]);

  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <ListContainer>
        <Container>
          <Title>임시 저장 목록</Title>
          <ListItemContainer>
            {tempData.length !== 0 ? (
              tempData.map(feed => {
                return (
                  <ListItem
                    onClick={() => setTempFeedId(feed.id)}
                    key={feed.id}
                  >
                    <Link
                      to="/writeFeed"
                      state={{
                        feedId: feed.id,
                        isModify: false,
                        isTemp: true,
                      }}
                    >
                      <FeedTitleDiv>{feed.title}</FeedTitleDiv>
                      <FeedContentDiv>{feed.content}</FeedContentDiv>
                    </Link>
                    <ButtonDiv>
                      <CreatedAtDiv>{feed.createdAt.slice(0, -3)}</CreatedAtDiv>
                      <DeleteButton onClick={deleteTempFeed}>삭제</DeleteButton>
                    </ButtonDiv>
                  </ListItem>
                );
              })
            ) : (
              <NoDataMessage>임시저장된 게시물이 없습니다.</NoDataMessage>
            )}
          </ListItemContainer>
        </Container>
        {openAlertModal()}
      </ListContainer>
    </Fragment>
  );
};
