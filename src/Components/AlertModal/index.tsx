import React, { useState } from 'react';
import Styled from 'styled-components';
import Modal from 'react-modal';

import { Button } from 'Components';
import { flexCenterAlign } from 'Styles/CommonStyle';

const AlertModalContainer = Styled.div`
  width: 100%;
  height: 100%;
  ${flexCenterAlign}
  flex-direction: column;
`;

const AlertMessage = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 0.3rem;
`;

interface Props {
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: (isAlertModalOpen: boolean) => void;
  contents: { id: number; text: string }[];
}

export const AlertModal = ({
  isAlertModalOpen,
  setIsAlertModalOpen,
  contents,
}: Props) => {
  Modal.setAppElement('#root');
  return (
    <Modal
      isOpen={isAlertModalOpen}
      onRequestClose={() => setIsAlertModalOpen(false)}
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
          zIndex: 999,
        },
        content: {
          position: 'absolute',
          width: '22rem',
          height: '12rem',
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
      <AlertModalContainer>
        <AlertMessage>
          {contents.map(content => {
            return <p key={content.id}>{content.text}</p>;
          })}
        </AlertMessage>
        <Button
          content="확인"
          backgroundColor="#676FA3"
          color="#fff"
          size="0.4rem 0.6rem"
          onClick={() => {
            setIsAlertModalOpen(false);
          }}
        />
      </AlertModalContainer>
    </Modal>
  );
};
