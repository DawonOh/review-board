import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
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

// isAlertModalOpen : 모달 열렸는지 여부
// setIsAlertModalOpen : isAlertModalOpen을 부모 컴포넌트로 전달하기 위한 함수
// contents : 모달 내용
// isQuestion : 모달 버튼 종류 - 확인(false) / 취소,확인(true)
// setReuslt : 취소,확인 버튼에서 확인을 눌렀는지 여부
// alertPath : 확인 버튼 클릭 시 이동할 페이지 링크
interface Props {
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: (isAlertModalOpen: boolean) => void;
  contents: { id: number; text: string }[];
  isQuestion?: boolean;
  setResult?: Function;
  alertPath?: string;
}

// styled-react-modal 라이브러리 사용
export const AlertModal = ({
  isAlertModalOpen,
  setIsAlertModalOpen,
  contents,
  isQuestion,
  setResult,
  alertPath,
}: Props) => {
  // 모달창 하단의 확인 버튼
  const linkButton = () => {
    // alertPath가 있는 경우에는 Link를 이용해 alertPath로 이동
    if (alertPath) {
      return (
        <Link to={alertPath}>
          <CloseButton
            onClick={() => {
              setIsAlertModalOpen(false);
              // setResult && setResult(true);
            }}
          >
            확인
          </CloseButton>
        </Link>
      );
    } else {
      // alertPath가 없으면 Link 제외
      return (
        <CloseButton
          onClick={() => {
            setIsAlertModalOpen(false);
            // setResult && setResult(true);
          }}
        >
          확인
        </CloseButton>
      );
    }
  };

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
            {isQuestion ? (
              <Fragment>
                <CloseButton
                  onClick={() => {
                    setIsAlertModalOpen(false);
                    setResult && isQuestion && setResult(false);
                  }}
                  isCancle={true}
                >
                  취소
                </CloseButton>
                <CloseButton
                  onClick={() => {
                    setIsAlertModalOpen(false);
                    setResult && setResult(true);
                  }}
                >
                  확인
                </CloseButton>
              </Fragment>
            ) : (
              linkButton()
            )}
          </Buttons>
        </AlertModalContainer>
      </StyledModal>
    </ModalProvider>
  );
};
