import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import Modal, { ModalProvider } from 'styled-react-modal';

import { Button } from 'Components';
import closeButtonImg from '../../assets/images/close.png';
import { flexCenterAlign } from 'Styles/CommonStyle';
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

const GoToJoin = Styled.span`
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

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const Login = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabeld] = useState(true);
  const [isLoginPass, setIsLoginPass] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const getPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  useEffect(() => {
    if (email && password) {
      setIsDisabeld(false);
    } else {
      setIsDisabeld(true);
    }
  }, [email, password]);

  const emailInput = useRef<HTMLInputElement>(null);

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
        let message = String(json.message);
        if (message.includes('success')) {
          localStorage.setItem('token', json.result.token);
          setIsModalOpen(false);
          setIsLoginPass(false);
        } else {
          setIsLoginPass(false);
          setEmail('');
          setPassword('');
          emailInput.current?.focus();
        }
      });
  };

  return (
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
          <Title>Title</Title>
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
            <Button
              content="로그인"
              backgroundColor={email && password ? '#FF5959' : '#E0E0E0'}
              size="0.6em 1em"
              color="#fff"
              onClick={login}
              disabled={isDisabled}
            />
          </Buttons>
          <Link to="/join">
            <GoToJoin>회원가입</GoToJoin>
          </Link>
        </LoginModalContainer>
      </StyledModal>
    </ModalProvider>
  );
};
