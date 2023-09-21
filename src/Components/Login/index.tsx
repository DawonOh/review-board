import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import Modal, { ModalProvider } from 'styled-react-modal';

import closeButtonImg from '../../assets/images/close.png';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';

const LoginModalContainer = Styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  ${flexCenterAlign}
  flex-direction: column;
  gap: 1.2rem;
`;

const CloseButton = Styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 1rem;
  height: 1rem;
  background: url(${closeButtonImg});
	background-repeat: no-repeat;
	background-size: cover;
  cursor: pointer;
`;

const Title = Styled.h1`
  font-family: 'Kanit', serif;
  font-size: 2em;
  font-weight: 700;
  color: #676FA3;
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
`;

const Buttons = Styled.div`
  ${flexCenterAlign}
  gap: 0.3rem;
`;

const GoToLink = Styled.span`
  font-size: 0.9em;
`;

const StyledModal = Modal.styled`
  width: 32em;
  height: 20em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
`;

const ErrorMessage = Styled.p`
  color: #FF5959;
  font-size: 0.9em;
`;

// disabled : 입력값에 따른 버튼 비활성화
const LoginButton = Styled.button<{
  disabled?: boolean;
}>`
  ${ButtonLayout}
  padding: 0.6em;
  background-color: ${props => (props.disabled ? '#E0E0E0' : '#FF5959')};
  color: #fff;
  cursor: ${props => (props.disabled ? 'dafault' : 'pointer')};
`;

const Flex = Styled.div`
  display: flex;
  gap: 0.5em;
`;

// isModalOpen : 로그인 모달 오픈 여부
// setIsModalOpen : isModalOpen setter함수
interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const Login = ({ isModalOpen, setIsModalOpen }: Props) => {
  // 화면에서 입력받는 이메일
  const [email, setEmail] = useState('');

  // 화면에서 입력받는 비밀번호
  const [password, setPassword] = useState('');

  // 버튼 비활성화 여부
  const [isDisabled, setIsDisabeld] = useState(true);

  // 로그인 통과 여부
  const [isLoginPass, setIsLoginPass] = useState(false);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  // 화면에서 사용자가 입력한 이메일 값 받아오는 함수
  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 화면에서 사용자가 입력한 비밀번호 값 받아오는 함수
  const getPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // api 요청시 보낼 headers 객체
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  // 이메일과 비밀번호를 둘 다 입력했을 경우에 로그인 버튼 활성화
  useEffect(() => {
    if (email && password) {
      setIsDisabeld(false);
    } else {
      setIsDisabeld(true);
    }

    // 로그인 창이 닫히면 input 초기화
    if (isModalOpen === false) {
      setEmail('');
      setPassword('');
    }
  }, [email, password, isModalOpen]);

  // 이메일 input ref
  const emailInput = useRef<HTMLInputElement>(null);

  // 로그인 함수
  const login = () => {
    fetch(`${BACK_URL}:${BACK_PORT}/users/signin`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(json => {
        // 응답으로 받은 메세지 내용
        let message = String(json.message);

        // 로그인 성공 시
        if (message.includes('SIGNIN_SUCCESS')) {
          // localStorage에 토큰 추가 및 로그인 모달 닫기, 메인화면으로 이동
          localStorage.setItem('token', json.result.token);
          setIsModalOpen(false);
          setIsLoginPass(false);
          window.location.href = '/';
        } else {
          // 로그인 실패 시 이메일과 비밀번호 초기화, 이메일 칸 focus
          setIsLoginPass(true);
          setEmail('');
          setPassword('');
          emailInput.current?.focus();
        }
      });
  };

  return (
    // styled-react-modal 라이브러리 사용
    <ModalProvider>
      <StyledModal
        data-testid="Login Test"
        isOpen={isModalOpen}
        onBackgroundClick={() => setIsModalOpen(false)}
        onEscapeKeydown={() => setIsModalOpen(false)}
      >
        <LoginModalContainer>
          <CloseButton
            onClick={() => setIsModalOpen(false)}
            data-testid="close button"
          />
          <Title>ALLREVIEW</Title>
          <Input
            type="text"
            placeholder="이메일을 입력해주세요."
            onChange={getEmail}
            value={email}
            ref={emailInput}
          />
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            onChange={getPw}
            value={password}
          />
          {isLoginPass && (
            <ErrorMessage>이메일/비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}

          <Buttons>
            <LoginButton onClick={login} disabled={isDisabled}>
              로그인
            </LoginButton>
          </Buttons>
          <Flex>
            <Link to="/join">
              <GoToLink>회원가입</GoToLink>
            </Link>
            |
            <Link to="/findpw">
              <GoToLink>비밀번호 찾기</GoToLink>
            </Link>
          </Flex>
        </LoginModalContainer>
      </StyledModal>
    </ModalProvider>
  );
};
