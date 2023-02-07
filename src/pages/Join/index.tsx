import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Styled from 'styled-components';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';

const Bg = Styled.div`
  ${flexCenterAlign}
  width: 100vw;
  height: 100vh;
  @media all and (max-width: 1023px) {
    background-color: #eef2ff;
  }
`;

const JoinContainer = Styled.div`
  ${flexCenterAlign}
  width: 55vw;
  height: 100vh;
  background-color: #eef2ff;
`;

const JoinContents = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
`;

const Title = Styled.h1`
  margin: 0.3em;
  color: #676fa3;
  font-size: 2.5em;
  font-weight: 700;
`;

const WelcomeMessage = Styled.p`
  margin-bottom: 3em;
`;

const GridContainer = Styled.div`
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

const SmallSizeMessage = Styled.p`
  margin-top: 3em;
  margin-bottom: 1em;
  font-size: 0.8em;
`;

const InputName = Styled.span`
  justify-self: end;
  &::before {
    content: '*';
    color: #ff5959;
  }
  @media all and (max-width: 1023px) {
    justify-self: start;
  }
`;
const Input = Styled.input`
  width: 25em;
  padding: 0.6em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
`;
const Buttons = Styled.div`
  display: flex;
  gap: 1em;
`;

const WarnMessage = Styled.p<{
  isEmailPass?: boolean;
  isPassWordPass?: boolean;
  isPwChkPass?: boolean;
}>`
  display: ${props =>
    props.isEmailPass || props.isPassWordPass || props.isPwChkPass
      ? 'none'
      : 'block'};
  margin-top: 0.3em;
  color: #ff5959;
  font-size: 0.8em;
`;

const JoinButton = Styled.button`
  ${ButtonLayout}
  padding: 0.6em;
  background-color: #FF5959;
  color: #fff;
  cursor: pointer;
`;

const Button = Styled.button`
  ${ButtonLayout}
  padding: 0.6em;
  background-color: #E0E0E0;
  color: #000;
  cursor: pointer;
`;

export const Join = () => {
  const [email, setEmail] = useState('');
  const [isEmailPass, setIsEmailPass] = useState(true);

  const [passWord, setPassWord] = useState('');
  const [isPassWordPass, setIsPassWordPass] = useState(true);

  const [passCheck, setPassCheck] = useState('');
  const [isPwChkPass, setIsPwChkPass] = useState(true);

  const [nickName, setNickNameValue] = useState('');
  const [isNickPass, setIsNickPass] = useState(true);
  const [isTryNickCheck, setIsTryNickCheck] = useState('notYet');

  //이메일 유효성 검사
  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+/;
    if (emailRegex.test(e.target.value) || e.target.value === '') {
      setIsEmailPass(true);
    } else {
      setIsEmailPass(false);
    }
    setEmail(e.target.value);
  };

  //비밀번호 유효성 검사
  const checkPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passWordRegex =
      /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    if (passWordRegex.test(e.target.value) || e.target.value === '') {
      setIsPassWordPass(true);
    } else {
      setIsPassWordPass(false);
    }
    setPassWord(e.target.value);
  };

  //비밀번호 확인 일치 검사
  const checkchkPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === passWord || e.target.value === '') {
      setIsPwChkPass(true);
    } else {
      setIsPwChkPass(false);
    }
    setPassCheck(e.target.value);
  };

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  //닉네임 중복확인
  const getNickNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickNameValue(e.target.value);
  };
  const checkNickName = () =>
    fetch(`http://localhost:8000/users/signup?nickname=${nickName}`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        let result = String(json.message);
        if (result.includes('available')) {
          alert('사용 가능한 닉네임입니다.');
          setIsTryNickCheck('pass');
          setIsNickPass(true);
        } else if (nickName === '') {
          setIsTryNickCheck('notYet');
          setIsNickPass(false);
          return;
        } else {
          alert('사용중인 닉네임입니다.');
          setIsTryNickCheck('nonPass');
          setIsNickPass(false);
        }
      });

  //회원가입
  const join = () => {
    if (
      email &&
      passWord &&
      passCheck &&
      nickName &&
      isEmailPass &&
      isPassWordPass &&
      isPwChkPass &&
      isNickPass &&
      isTryNickCheck === 'notYet'
    ) {
      alert('닉네임 중복확인을 해주세요.');
    } else if (
      email === '' ||
      passWord === '' ||
      passCheck === '' ||
      nickName === '' ||
      isEmailPass === false ||
      isPassWordPass === false ||
      isPwChkPass === false ||
      isNickPass === false
    ) {
      alert('입력한 정보를 다시 확인해주세요.');
    } else {
      fetch('http://localhost:8000/users/signup', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          nickname: nickName,
          password: passWord,
          email: email,
        }),
      })
        .then(res => res.json())
        .then(json => {
          let result = String(json.message);
          if (result.includes('success')) {
            alert('회원가입되었습니다.');
            window.location.href = '/';
          } else {
            alert('잠시후 다시 시도해주세요.');
          }
        });
    }
  };
  return (
    <Bg>
      <JoinContainer>
        <JoinContents>
          <Title>title</Title>
          <WelcomeMessage>title에 오신 여러분을 환영합니다!</WelcomeMessage>
          <GridContainer>
            <InputName>이메일</InputName>
            <div>
              <Input
                type="text"
                placeholder="예시)example@email.com"
                onChange={checkEmail}
              />
              <WarnMessage isEmailPass={isEmailPass}>
                이메일 형식에 맞지 않습니다.
              </WarnMessage>
            </div>
            <div />
            <InputName>비밀번호</InputName>
            <div>
              <Input
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
                onChange={checkPw}
              />
              <WarnMessage isPassWordPass={isPassWordPass}>
                영문, 숫자, 특수문자 포함 8자리 이상으로 설정해주세요.
              </WarnMessage>
            </div>
            <div />
            <InputName>비밀번호 확인</InputName>
            <div>
              <Input
                type="password"
                placeholder="비밀번호를 한 번 더 입력해주세요."
                onChange={checkchkPw}
              />
              <WarnMessage isPwChkPass={isPwChkPass}>
                비밀번호와 일치하지 않습니다.
              </WarnMessage>
            </div>
            <div />
            <InputName>닉네임</InputName>
            <div>
              <Input
                type="text"
                placeholder="닉네임을 입력해주세요."
                onChange={getNickNameValue}
              />
            </div>
            <div>
              <Button onClick={checkNickName}>중복확인</Button>
            </div>
          </GridContainer>
          <SmallSizeMessage>
            <InputName />은 필수항목입니다.
          </SmallSizeMessage>
          <Buttons>
            <Link to="/">
              <Button>취소</Button>
            </Link>
            <JoinButton onClick={join}>가입하기</JoinButton>
          </Buttons>
        </JoinContents>
      </JoinContainer>
    </Bg>
  );
};

// export default Join;
