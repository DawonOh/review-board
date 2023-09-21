import { AlertModal } from '../AlertModal';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';

const MainContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 60vh;
`;

const CenterDiv = Styled.div`
  margin: 0 auto;
`;

const Input = Styled.input`
  width: 20em;
  margin-right: 1em;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
  z-index: 999;
  @media (max-width: 767px) {
    width: 10em;
  }
`;

const CheckButton = Styled.button`
  ${ButtonLayout}
  width: 4em;
  padding: 0.6em;
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

interface MessageType {
  id: number;
  text: string;
}

interface PropsType {
  setIsPass: Function;
  parentResult?: boolean;
}

export const CheckPassword = ({ setIsPass, parentResult }: PropsType) => {
  // 현재 비밀번호 확인을 위해 백으로 보낼 이메일 값
  const [email, setEmail] = useState('');
  // 화면에서 입력받는 현재 비밀번호 값
  const [pw, setPw] = useState('');
  // 알림창 모달을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  // .env에서 가져오는 변수들(url, port)
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const token = localStorage.getItem('token');

  // 페이지 렌더링 시 불러오는 사용자 정보 - 이메일 값 저장
  useEffect(() => {
    axios
      .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      })
      .then(response => {
        setEmail(response.data.email);
      });
  }, []);

  // 알림창 모달 여는 함수
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

  // 입력받은 비밀번호 가져오는 함수
  const getPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  // 비밀번호 확인 및 백으로 전송
  const checkPw = () => {
    // 확인 버튼 클릭 시 비밀번호 칸 초기화
    setPw('');
    setIsPass(false);

    // 백으로 전송(로그인 로직 활용)
    axios
      .post(
        `${BACK_URL}:${BACK_PORT}/users/signin`,
        {
          email: email,
          password: pw,
        },
        {
          timeout: 5000,
          headers: { Accept: 'application/json' },
        }
      )
      .then(response => {
        if (response.status === 200) {
          setIsPass(true);
        }
      })
      .catch(error => {
        setMessages([{ id: 1, text: '비밀번호가 일치하지 않습니다.' }]);
        setIsQuestion(false);
        setIsAlertModalOpen(true);
        setIsPass(false);
      });
  };

  useEffect(() => {
    if (result) {
    }
  }, [result]);
  return (
    <Fragment>
      <MainContainer>
        <CenterDiv>
          <Input
            type="password"
            placeholder="현재 비밀번호를 입력해주세요."
            value={pw}
            onChange={getPw}
          />
          <CheckButton onClick={checkPw}>확인</CheckButton>
        </CenterDiv>
      </MainContainer>
      {openAlertModal()}
    </Fragment>
  );
};
