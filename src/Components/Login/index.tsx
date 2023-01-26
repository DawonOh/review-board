import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import Modal from 'react-modal';

import { Button, AlertModal } from 'Components';
import closeButtonImg from '../../assets/images/close.png';
import { flexCenterAlign } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';

const LoginModalContainer = Styled.div`
  width: 100%;
  height: 100%;
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
  font-size: 2rem;
  font-weight: 700;
  color: #676FA3;
`;

const Input = Styled.input`
width: 20em;
padding: 0.6em;
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
  font-size: 0.9rem;
`;
interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

interface MessageType {
  id: number;
  text: string;
}
export const Login = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isDisabled, setIsDisabeld] = useState(true);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  Modal.setAppElement('#root');

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
        } else {
          setIsAlertModalOpen(true);
          setMessages([
            { id: 1, text: '이메일/비밀번호가 일치하지 않습니다.' },
          ]);
          setEmail('');
          setPassword('');
        }
      });
  };

  return (
    <Fragment>
      <AlertModal
        isAlertModalOpen={isAlertModalOpen}
        setIsAlertModalOpen={setIsAlertModalOpen}
        contents={messages}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0, 0.4)',
          },
          content: {
            position: 'absolute',
            width: '38rem',
            height: '25rem',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '6px',
            outline: 'none',
            padding: '20px',
          },
        }}
      >
        <LoginModalContainer>
          <CloseButton onClick={() => setIsModalOpen(false)} />
          <Title>Title</Title>
          <Input
            type="text"
            placeholder="이메일을 입력해주세요."
            onChange={getEmail}
            value={email}
          />
          <Input
            type="text"
            placeholder="비밀번호를 입력해주세요."
            onChange={getPw}
            value={password}
          />
          <Buttons>
            <Button
              content="로그인"
              backgroundColor={email && password ? '#FF5959' : '#E0E0E0'}
              size="0.4rem 7rem"
              color="#fff"
              onClick={login}
              disabled={isDisabled}
            />
          </Buttons>
          <Link to="/join">
            <GoToJoin>회원가입</GoToJoin>
          </Link>
        </LoginModalContainer>
      </Modal>
    </Fragment>
  );
};
