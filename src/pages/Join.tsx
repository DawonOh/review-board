import React from 'react';
import styled from 'styled-components';
import { flexCenterAlign } from 'Styles/CommonStyle';

const Bg = styled.div`
  ${flexCenterAlign}
  width: 100vw;
  height: 100vh;
`;

const JoinContainer = styled.div`
  ${flexCenterAlign}
  width: 45vw;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1em;
`;

const Button = styled.button<{ red?: boolean }>`
  padding: 0.4em;
  background-color: ${props => (props.red ? '#FF5959' : '#E0E0E0')};
  border: none;
  border-radius: 0.3em;
`;

const SmallSizeMessage = styled.p`
  margin-top: 3em;
  font-size: 0.8em;
`;

const InputName = styled.span`
  &::before {
    content: '*';
    color: #ff5959;
  }
`;
const Input = styled.input`
  width: 20em;
  padding: 0.5em;
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
              <Input type="text" placeholder="예시)example@email.com" />
            </div>
            <div />
            <InputName>비밀번호 확인</InputName>
            <div>
              <Input type="text" placeholder="예시)example@email.com" />
            </div>
            <div />
            <InputName>닉네임</InputName>
            <div>
              <Input type="text" placeholder="예시)example@email.com" />
            </div>
            <div>
              <Button>중복확인</Button>
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
