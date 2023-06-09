import { AlertModal, CheckPassword, Header, MobileMenu } from 'Components';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Styled from 'styled-components';

const MainContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 60vh;
`;

const CenterDiv = Styled.div`
  display: grid;
  width: 20em;
  gap:1em;
  margin: 0 auto;
  @media (max-width: 767px) {
    width: 13em;
  }
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

const Input = Styled.input`
  width: 100%;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
`;

const Button = Styled.button<{
  pw: string;
  checkPw: string;
  isSamePass: boolean;
  isRegexPass: boolean;
}>`
  ${ButtonLayout}
  background-color: ${props =>
    props.pw &&
    props.checkPw &&
    props.isSamePass &&
    props.isRegexPass &&
    '#676FA3'};
  color: ${props =>
    props.pw &&
    props.checkPw &&
    props.isSamePass &&
    props.isRegexPass &&
    '#fff'};
  cursor: ${props =>
    props.pw &&
    props.checkPw &&
    props.isSamePass &&
    props.isRegexPass &&
    'pointer'};
  
`;

const InfoMessage = Styled.p`
  margin-top: 1em;
  padding: 1em;
  font-size: 0.8em;
`;

const WarningMessage = Styled.p`
  font-size: 0.8em;
  color: tomato;
`;
interface UserInfoType {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  nickname: string;
  updated_at: string;
}

interface MessageType {
  id: number;
  text: string;
}

export const ModifyPw = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState<UserInfoType>();
  const [isPass, setIsPass] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [checkNewPw, setCheckNewPw] = useState('');
  const [isRegexPass, setIsRegexPass] = useState(true);
  const [isSamePass, setIsSamePass] = useState(true);
  // 알림창을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [alertPath, setAlertPath] = useState('');
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');

  const location = useLocation();
  let params = new URLSearchParams(location.search);
  let query = params.get('token');

  let headers = {};
  if (token) {
    headers = { Accept: 'application/json', Authorization: token };
  }
  if (query) {
    headers = { Accept: 'application/json', Authorization: query };
  }

  useEffect(() => {
    if (query) {
      axios
        .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: query },
        })
        .then(response => {
          setLoginUserInfo(response.data);
        })
        .catch(error => {
          setMessages([{ id: 1, text: '링크가 만료되었습니다.' }]);
          setIsQuestion(false);
          setIsAlertModalOpen(true);
          setAlertPath('/findpw');
        });
    }
  }, []);
  useEffect(() => {
    if (token) {
      axios
        .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        })
        .then(response => {
          setLoginUserInfo(response.data);
        });
    }
    if (query) setIsPass(true);
  }, [token, query]);

  const openAlertModal = () => {
    if (isAlertModalOpen) {
      return (
        <AlertModal
          isAlertModalOpen={isAlertModalOpen}
          setIsAlertModalOpen={setIsAlertModalOpen}
          contents={messages}
          isQuestion={isQuestion}
          setResult={setResult}
          alertPath={alertPath}
        />
      );
    }
  };

  const getNewPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passWordRegex =
      /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    if (passWordRegex.test(e.target.value) || e.target.value === '') {
      setIsRegexPass(true);
    } else {
      setIsRegexPass(false);
    }
    setNewPw(e.target.value);
  };

  const getCheckNewPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckNewPw(e.target.value);
  };

  useEffect(() => {
    if (newPw === checkNewPw) {
      setIsSamePass(true);
    } else {
      setIsSamePass(false);
    }
  }, [newPw, checkNewPw]);

  const changePw = () => {
    setMessages([{ id: 1, text: '변경하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
    setResult(false);
  };

  useEffect(() => {
    if (result) {
      axios
        .patch(
          `${BACK_URL}:${BACK_PORT}/users/signup`,
          { password: newPw },
          {
            timeout: 5000,
            headers: headers,
          }
        )
        .then(response => {
          setMessages([
            { id: 1, text: '변경되었습니다.' },
            { id: 2, text: '새 비밀번호로 로그인해주세요.' },
          ]);
          setIsQuestion(false);
          setIsAlertModalOpen(true);
          localStorage.clear();
          setAlertPath('/');
        })
        .catch(error => {
          setMessages([{ id: 1, text: '잠시 후 다시 시도해주세요.' }]);
          setIsQuestion(false);
          setIsAlertModalOpen(true);
          setAlertPath('/findpw');
          return;
        });
    }
  }, [result]);

  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu
        loginUserId={loginUserInfo?.id}
        isMenuOn={isMenuOn}
        setIsMenuOn={setIsMenuOn}
      />
      <TitleDiv>
        <Title>비밀번호 변경</Title>
      </TitleDiv>
      {isPass ? (
        <MainContainer>
          <CenterDiv>
            <div>새 비밀번호</div>
            <Input type="password" placeholder="비밀번호" onChange={getNewPw} />
            {isRegexPass === false && (
              <WarningMessage>비밀번호 조건을 확인해주세요.</WarningMessage>
            )}
            <div>새 비밀번호 확인</div>
            <Input
              type="password"
              placeholder="비밀번호 확인"
              onChange={getCheckNewPw}
            />
            {isSamePass === false && (
              <WarningMessage>비밀번호가 일치하지 않습니다.</WarningMessage>
            )}
            <Button
              pw={newPw.trim()}
              checkPw={checkNewPw.trim()}
              isSamePass={isSamePass}
              isRegexPass={isRegexPass}
              disabled={
                newPw.trim() !== '' &&
                checkNewPw.trim() !== '' &&
                isSamePass &&
                isRegexPass
                  ? false
                  : true
              }
              onClick={changePw}
            >
              변경하기
            </Button>
          </CenterDiv>
          <InfoMessage>
            • 영어 대문자, 소문자, 숫자, 특수문자 포함 8자 ~ 20자로
            설정해주세요.
          </InfoMessage>
        </MainContainer>
      ) : (
        <CheckPassword setIsPass={setIsPass} parentResult={isPass} />
      )}
      {openAlertModal()}
    </Fragment>
  );
};
