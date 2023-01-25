import React from 'react';
import Styled from 'styled-components';
import Modal from 'react-modal';

import { Button } from 'Components';
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
export const Login = ({ isModalOpen, setIsModalOpen }: Props) => {
  Modal.setAppElement('#root');
  return (
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
          width: '40rem',
          height: '23rem',
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
        <Input type="text" placeholder="이메일을 입력해주세요." />
        <Input type="text" placeholder="비밀번호를 입력해주세요." />
        <Buttons>
          <Button
            content="로그인"
            backgroundColor="#FF5959"
            size="0.4rem 7rem"
            color="#fff"
          />
        </Buttons>
        <Link to="/join">
          <GoToJoin>회원가입</GoToJoin>
        </Link>
      </LoginModalContainer>
    </Modal>
  );
};
