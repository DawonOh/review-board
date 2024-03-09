import React, { Fragment, useEffect, useState } from 'react';
import { AlertModal, CheckPassword, Header } from 'Components';
import axios from 'axios';
import Styled from 'styled-components';

const TitleDiv = Styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 1em;
  @media (max-width: 767px) {
    margin-top: 2em;
  }
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 2em;
  @media (max-width: 767px) {
    font-size: 1.4em;
  }
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
interface MessageType {
  id: number;
  text: string;
}

export const Quit = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [isPass, setIsPass] = useState(false);
  const [loading, setLoading] = useState(false);
  // 알림창을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');

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

  useEffect(() => {
    if (isPass) {
      setMessages([
        { id: 1, text: '정말로 탈퇴하시겠습니까?' },
        { id: 2, text: '작성한 모든 리뷰 및 댓글이 사라집니다.' },
      ]);
      setIsQuestion(true);
      setIsAlertModalOpen(true);
    }
  }, [isPass]);

  useEffect(() => {
    if (result) {
      setLoading(true);
      axios
        .delete<string>(`${BACK_URL}/users/signup`, {
          headers: { Accept: 'application/json', Authorization: token },
        })
        .then(response => {
          setLoading(false);
          setMessages([{ id: 1, text: '탈퇴되었습니다.' }]);
          setIsQuestion(false);
          setIsAlertModalOpen(true);
          localStorage.clear();
          setTimeout(function () {
            window.location.href = '/';
          }, 3000);
        })
        .catch(error => {
          setLoading(false);
          if (error.response.status === 404) {
            setMessages([{ id: 1, text: '존재하지 않는 사용자입니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsPass(false);
            setResult(false);
          } else {
            setMessages([{ id: 1, text: '잠시 후 다시 시도해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsPass(false);
            setResult(false);
          }
        });
    }
  }, [result]);

  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <TitleDiv>
        <Title>탈퇴하기</Title>
      </TitleDiv>
      {loading ? (
        <Loader />
      ) : (
        <CheckPassword setIsPass={setIsPass} parentResult={isPass} />
      )}
      {openAlertModal()}
    </Fragment>
  );
};
