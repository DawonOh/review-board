import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import React, { Fragment } from 'react';
import Styled from 'styled-components';

const MainContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 60vh;
`;

const TitleDiv = Styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 1em;
  @media (max-width: 767px) {
    margin-top: 2em;
  }
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 2em;
  @media (max-width: 767px) {
    font-size: 1.4em;
  }
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
`;

export const CheckPassword = () => {
  return (
    <Fragment>
      <TitleDiv>
        <Title>탈퇴하기</Title>
      </TitleDiv>
      <MainContainer>
        <CenterDiv>
          <Input placeholder="현재 비밀번호를 입력해주세요." />
          <CheckButton>확인</CheckButton>
        </CenterDiv>
      </MainContainer>
    </Fragment>
  );
};
