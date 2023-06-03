import { AlertModal } from 'Components';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Styled from 'styled-components';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';

const MainContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const CenterContainer = Styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 1em;
`;

const TitleDiv = Styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  @media (max-width: 767px) {
    margin-top: 2em;
  }
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
  @media (max-width: 767px) {
    font-size: 1.4em;
  }
`;

const Input = Styled.input`
  width: 20em;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
  @media (max-width: 767px) {
    width: 10em;
  }
`;

const SmallMessage = Styled.p`
  font-size: 0.8em;
`;

const WarningMessage = Styled.p`
  color: #FF5959;
  font-size: 0.8em;
`;

const Button = Styled.button<{ color: string }>`
  ${ButtonLayout}
  padding: 0.3em;
  background-color: ${props =>
    props.color === 'blue' ? '#676FA3' : '#bdbdbd'};
  color: #fff;
  cursor: pointer;
`;

const Flex = Styled.div`
  display: flex;
  gap: 1em;
`;

const Loader = Styled.div`
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

const FlexCenter = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
  gap: 1em;
`;

interface MessageType {
  id: number;
  text: string;
}
export const FindPw = () => {
  // 알림창을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

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
  return (
    <MainContainer>
      <CenterContainer>
        <TitleDiv>
          <Title>비밀번호 찾기</Title>
        </TitleDiv>
        <p>가입한 이메일을 입력해주세요.</p>
        <SmallMessage>
          • 비밀번호를 변경할 수 있는 메일을 보내드립니다.
        </SmallMessage>
        <Input placeholder="example@email.com" />
        <WarningMessage>존재하지 않는 사용자입니다.</WarningMessage>
        <Flex>
          <Link to="/">
            <Button color="gray">메인으로 돌아가기</Button>
          </Link>
          <Button color="blue">비밀번호 찾기</Button>
        </Flex>
        {/* <FlexCenter>
          <Loader />
          메일을 전송하고 있습니다.
        </FlexCenter> */}
      </CenterContainer>
      {openAlertModal()}
    </MainContainer>
  );
};
