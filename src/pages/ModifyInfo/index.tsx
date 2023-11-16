import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { AlertModal, Header, MobileMenu } from 'Components';
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
  &:nth-child(3) {
    grid-column: 2 / 4;
    justify-self: start;
  }
  &:nth-child(5) {
    grid-column: 2 / 4;
    justify-self: start;
  }
  &:nth-child(8) {
    grid-column: 2 / 4;
    justify-self: start;
  }
`;

const Button = Styled.button<{
  color: string;
  nickname?: string;
  email?: string;
  isEmailPass?: boolean;
}>`
  ${ButtonLayout}
  background-color: ${props =>
    props.color === 'blue' &&
    props.email !== '' &&
    props.nickname !== '' &&
    props.isEmailPass
      ? '#676FA3'
      : '#bdbdbd'};
  background-color: ${props => props.color === 'red' && '#FF5959'};
  background-color: ${props => props.color === 'gray' && '#bdbdbd'};
  color: #fff;
  font-size: 0.8em;
  cursor: ${props =>
    props.email !== '' && props.nickname !== '' && props.isEmailPass
      ? 'pointer'
      : 'default'};
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

const ErrorMessage = Styled.div`
  margin: 0 auto;
`;

const WarningMessage = Styled.p`
  margin-top: 0.2em;
  color: #FF5959;
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

interface ChangeUserInfoType {
  message: string;
  result: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nickname: string;
    email: string;
  };
}

interface MessageType {
  id: number;
  text: string;
}

export const ModifyInfoPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState<UserInfoType>();
  const [newNickName, setNewNickName] = useState(loginUserInfo?.nickname);
  const [newEmail, setNewEmail] = useState(loginUserInfo?.email);
  const [changedNickName, setChangedNickName] = useState('');
  const [changedEmail, setChangedEmail] = useState('');
  const [isEmailPass, setIsEmailPass] = useState(true);
  const [warningMessage, setWarningMessage] = useState('');

  // 알림창을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');
  // const openAlertModal = () => {
  //   if (isAlertModalOpen) {
  //     return (
  //       <AlertModal
  //         isAlertModalOpen={isAlertModalOpen}
  //         setIsAlertModalOpen={setIsAlertModalOpen}
  //         contents=""
  //         isQuestion={isQuestion}
  //         setResult={setResult}
  //       />
  //     );
  //   }
  // };

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

  const getNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickName(e.target.value);
  };
  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+/;
    if (emailRegex.test(e.target.value)) {
      setWarningMessage('');
      setIsEmailPass(true);
    } else {
      setWarningMessage('이메일 형식을 확인해주세요.');
      setIsEmailPass(false);
    }
    setNewEmail(e.target.value);
  };

  const changeInfo = () => {
    setMessages([{ id: 1, text: '변경하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
    setResult(false);
  };

  useEffect(() => {
    if (result) {
      axios
        .patch<ChangeUserInfoType>(
          `${BACK_URL}:${BACK_PORT}/users/signup`,
          { nickname: newNickName, email: newEmail },
          {
            timeout: 5000,
            headers: { Accept: 'application/json', Authorization: token },
          }
        )
        .then(response => {
          setChangedNickName(response.data.result.nickname);
          setChangedEmail(response.data.result.email);
          setMessages([{ id: 1, text: '변경되었습니다.' }]);
          setIsQuestion(false);
          setIsAlertModalOpen(true);
        })
        .catch(error => {
          if (error.response.status === 409) {
            setMessages([{ id: 1, text: '이미 존재하는 닉네임입니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            return;
          }
          if (error.response.status === 400) {
            setMessages([{ id: 1, text: '새로운 닉네임을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            return;
          }
          setMessages([{ id: 1, text: '잠시 후 다시 시도해주세요.' }]);
          setIsQuestion(false);
          setIsAlertModalOpen(true);
          return;
        });
    }
  }, [result]);
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
                <Input
                  defaultValue={
                    changedNickName ? changedNickName : loginUserInfo.nickname
                  }
                  onChange={getNickName}
                />
              </Item>
              <div />
              <Item>이메일</Item>
              <div>
                <Input
                  defaultValue={
                    changedEmail ? changedEmail : loginUserInfo.email
                  }
                  onChange={getEmail}
                />
                <WarningMessage>{warningMessage}</WarningMessage>
              </div>

              <div />
              <Item>비밀번호</Item>
              <Item>
                <Link to="/changepw">
                  <Button color="gray">비밀번호 수정</Button>
                </Link>
              </Item>
            </CenterDiv>
            <BottomDiv>
              <Link to="/quit">
                <QuitButton>탈퇴하기</QuitButton>
              </Link>
              <Flex>
                <Button
                  color="blue"
                  nickname={newNickName}
                  email={newEmail}
                  isEmailPass={isEmailPass}
                  disabled={
                    newNickName?.trim() !== '' &&
                    newEmail?.trim() !== '' &&
                    isEmailPass
                      ? false
                      : true
                  }
                  onClick={changeInfo}
                >
                  변경하기
                </Button>
                <Link to="/">
                  <Button color="red">취소</Button>
                </Link>
              </Flex>
            </BottomDiv>
          </MainContainer>
        </Fragment>
      ) : (
        <MainContainer>
          <ErrorMessage>로그인 후 이용해주세요.</ErrorMessage>
        </MainContainer>
      )}
      {/* {openAlertModal()} */}
    </Fragment>
  );
};
