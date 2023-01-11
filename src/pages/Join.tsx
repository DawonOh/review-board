import React from 'react';
import styled from 'styled-components';
import { flexCenterAlign } from 'Styles/CommonStyle';

const Bg = styled.div`
  ${flexCenterAlign}
  width: 100vw;
  height: 100vh;
  @media all and (min-width: 768px) and (max-width: 1023px) {
    background-color: #eef2ff;
  }
  @media all and (max-width: 767px) {
    background-color: #eef2ff;
  }
`;

const JoinContainer = styled.div`
  ${flexCenterAlign}
  width: 55vw;
  height: 100vh;
  background-color: #eef2ff;
`;

const JoinContents = styled.div`
  ${flexCenterAlign}
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0.3em;
  font-size: 2.5em;
  font-weight: 700;
  color: #676fa3;
`;

const WelcomeMessage = styled.p`
  margin-bottom: 3em;
`;

const GridContainer = styled.div`
  display: grid;
  align-items: center;
  @media all and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media all and (max-width: 1023px) {
    grid-template-columns: repeat(1, 1fr);
  }
  gap: 1em;
`;

const Button = styled.button<{ red?: boolean; small?: boolean }>`
  padding: ${props => (props.small ? '0.3em' : '0.6em')};
  background-color: ${props => (props.red ? '#FF5959' : '#E0E0E0')};
  border: none;
  border-radius: 0.3em;
  cursor: pointer;
`;

const SmallSizeMessage = styled.p`
  margin-top: 3em;
  margin-bottom: 1em;
  font-size: 0.8em;
`;

const InputName = styled.span`
  justify-self: end;
  &::before {
    content: '*';
    color: #ff5959;
  }
  @media all and (max-width: 1023px) {
    justify-self: start;
  }
`;
const Input = styled.input`
  width: 25em;
  padding: 0.6em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
`;
const Buttons = styled.div`
  display: flex;
  gap: 1em;
`;
const Join = () => {
  return (
    <Bg>
      <JoinContainer>
        <JoinContents>
          <Title>title</Title>
          <WelcomeMessage>title에 오신 여러분을 환영합니다!</WelcomeMessage>
          <GridContainer>
            <InputName>이름</InputName>
            <div>
              <Input type="text" placeholder="예시)홍길동" />
            </div>
            <div />
            <InputName>이메일</InputName>
            <div>
              <Input type="text" placeholder="예시)example@email.com" />
            </div>
            <div />
            <InputName>비밀번호</InputName>
            <div>
              <Input
                type="text"
                placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
              />
            </div>
            <div />
            <InputName>비밀번호 확인</InputName>
            <div>
              <Input
                type="text"
                placeholder="비밀번호를 한 번 더 입력해주세요."
              />
            </div>
            <div />
            <InputName>닉네임</InputName>
            <div>
              <Input type="text" placeholder="닉네임을 입력해주세요." />
            </div>
            <div>
              <Button small>중복확인</Button>
            </div>
          </GridContainer>
          <SmallSizeMessage>
            <InputName />은 필수항목입니다.
          </SmallSizeMessage>
          <Buttons>
            <Button>취소</Button>
            <Button red>가입하기</Button>
          </Buttons>
        </JoinContents>
      </JoinContainer>
    </Bg>
  );
};

export default Join;
