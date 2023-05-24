import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { Header, MobileMenu } from 'Components';
import axios from 'axios';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';

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
  display: grid;
  grid-template-columns: repeat(3, minmax(6em, auto));
  grid-template-rows: repeat(3, minmax(3em, auto));
  align-items: center;
  justify-items: center;
  row-gap: 1em;
`;

const Input = Styled.input`
  width: 20em;
  height: 2em;
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

const Item = Styled.div`
  &:nth-child(5) {
    grid-column: 2 / 4;
    justify-self: start;
  }
  &:nth-child(7) {
    grid-column: 2 / 4;
    justify-self: start;
  }
`;

const Button = Styled.button<{ color: string }>`
  ${ButtonLayout}
  background-color: ${props => props.color === 'blue' && '#676FA3'};
  background-color: ${props => props.color === 'red' && '#FF5959'};
  background-color: ${props => props.color === 'gray' && '#bdbdbd'};
  color: #fff;
  font-size: 0.8em;
  cursor: pointer;
`;

const BottomDiv = Styled.div`
  display: flex;
  width: 40em;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-top: 3em;
  padding: 1em;
  @media (max-width: 767px) {
    width: 50%;
    flex-direction: column;
    gap: 1em;
    margin-top: 2em;
  }
`;

const Flex = Styled.div`
  ${flexCenterAlign}
  gap: 1em;
`;

const QuitButton = Styled.div`
  font-size: 0.8em;
`;

interface UserInfoType {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  nickname: string;
  updated_at: string;
}

export const ModifyInfoPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState<UserInfoType>();
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');
  useEffect(() => {
    axios
      .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      })
      .then(response => {
        setLoginUserInfo(response.data);
      });
  }, []);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu
        isMenuOn={isMenuOn}
        setIsMenuOn={setIsMenuOn}
        loginUserId={loginUserInfo?.id}
      />
      {loginUserInfo ? (
        <Fragment>
          <TitleDiv>
            <Title>개인 정보 수정</Title>
          </TitleDiv>
          <MainContainer>
            <CenterDiv>
              <Item>닉네임</Item>
              <Item>
                <Input />
              </Item>
              <Item>
                <Button color="gray">변경하기</Button>
              </Item>
              <Item>이메일</Item>
              <Item>example@email.com</Item>
              <Item>비밀번호</Item>
              <Item>
                <Button color="gray">비밀번호 수정</Button>
              </Item>
            </CenterDiv>
            <BottomDiv>
              <Link to="/">
                <QuitButton>탈퇴하기</QuitButton>
              </Link>
              <Flex>
                <Button color="red">취소</Button>
                <Button color="blue">변경하기</Button>
              </Flex>
            </BottomDiv>
          </MainContainer>
        </Fragment>
      ) : (
        <MainContainer>404</MainContainer>
      )}
    </Fragment>
  );
};
