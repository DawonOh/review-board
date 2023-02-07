import React from 'react';
import Styled from 'styled-components';
import Modal, { ModalProvider } from 'styled-react-modal';

import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';

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

const StyledModal = Modal.styled`
  width: 20em;
  height: 12em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff;
  border-radius: 4px;
`;

const CloseButton = Styled.button`
  ${ButtonLayout}
  padding: 0.4em 0.6em;
  background-color: #676FA3;
  color: #fff;
  cursor: pointer;
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
  return (
    <ModalProvider>
      <StyledModal
        isOpen={isAlertModalOpen}
        onBackgroundClick={() => setIsAlertModalOpen(false)}
        onEscapeKeydown={() => setIsAlertModalOpen(false)}
      >
        <AlertModalContainer>
          <AlertMessage>
            {contents.map(content => {
              return <p key={content.id}>{content.text}</p>;
            })}
          </AlertMessage>
          <CloseButton
            onClick={() => {
              setIsAlertModalOpen(false);
            }}
          >
            확인
          </CloseButton>
        </AlertModalContainer>
      </StyledModal>
    </ModalProvider>
  );
};
