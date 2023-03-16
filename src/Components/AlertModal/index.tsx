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

const Buttons = Styled.div`
  display: flex;
  gap: 1em;
`;

const CloseButton = Styled.button<{ isCancle?: boolean }>`
  ${ButtonLayout}
  padding: 0.4em 0.6em;
  background-color: ${props => (props.isCancle ? '#C1C1C1' : '#676FA3')};
  color: #fff;
  cursor: pointer;
`;

interface Props {
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: (isAlertModalOpen: boolean) => void;
  contents: { id: number; text: string }[];
  isQuestion?: boolean;
  setResult?: (result: boolean) => void;
}

export const AlertModal = ({
  isAlertModalOpen,
  setIsAlertModalOpen,
  contents,
  isQuestion,
  setResult,
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
          <Buttons>
            {isQuestion && (
              <CloseButton
                onClick={() => {
                  setIsAlertModalOpen(false);
                  setResult && isQuestion && setResult(false);
                }}
                isCancle={true}
              >
                취소
              </CloseButton>
            )}
            <CloseButton
              onClick={() => {
                setIsAlertModalOpen(false);
                setResult && setResult(true);
              }}
            >
              확인
            </CloseButton>
          </Buttons>
        </AlertModalContainer>
      </StyledModal>
    </ModalProvider>
  );
};
