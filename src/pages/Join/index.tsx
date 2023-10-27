import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertModal } from 'Components';
import axios from 'axios';

interface MessageType {
  id: number;
  text: string;
}

export const Join = () => {
  const [email, setEmail] = useState('');
  const [isEmailPass, setIsEmailPass] = useState(true);
  const [isEmailCanUse, setIsEmailCanUse] = useState(true);

  const [passWord, setPassWord] = useState('');
  const [isPassWordPass, setIsPassWordPass] = useState(true);

  const [passCheck, setPassCheck] = useState('');
  const [isPwChkPass, setIsPwChkPass] = useState(true);

  const [nickName, setNickNameValue] = useState('');
  const [isNickEmpty, setIsNickEmpty] = useState(false);
  const [isNickPass, setIsNickPass] = useState(true);
  const [isTryNickCheck, setIsTryNickCheck] = useState('notYet');
  //AlertModal open 여부
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  //AlertModal 버튼 - '취소/확인'으로 넣을 때 조건(default:'확인')
  const [isQuestion, setIsQuestion] = useState(false);

  //AlertModal에서 취소(false)/확인(true)중 어떤걸 눌렀는 지 확인
  const [result, setResult] = useState(false);

  //AlertModal 메세지 내용
  const [messages, setMessages] = useState<MessageType[]>([]);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  // 알림 모달창 함수
  const openAlertModal = () => {
    if (isAlertModalOpen) {
      return (
        <AlertModal
          isAlertModalOpen={isAlertModalOpen}
          setIsAlertModalOpen={setIsAlertModalOpen}
          contents={messages}
          isQuestion={isQuestion}
          setResult={setResult}
        />
      );
    }
  };

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

  //이메일 중복 검사
  const checkAlreadyUsedEmail = async () => {
    try {
      let response = await axios.get(
        `${BACK_URL}:${BACK_PORT}/users/checkemail?email=${email}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        setIsEmailCanUse(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setIsEmailCanUse(false);
        }
      }
    }
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

  //닉네임 중복확인
  const getNickNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickNameValue(e.target.value);
  };
  const checkNickName = async () => {
    if (nickName.trim() !== '') {
      setIsNickEmpty(false);
      try {
        const response = await axios.get(
          `${BACK_URL}:${BACK_PORT}/users/checknickname?nickname=${nickName}`
        );
        const resultCode = response.status;
        if (resultCode === 200) {
          alert('사용 가능한 닉네임입니다.');
          setIsTryNickCheck('pass');
          setIsNickPass(true);
          setIsNickEmpty(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            alert('사용중인 닉네임입니다.');
            setIsTryNickCheck('nonPass');
            setIsNickPass(false);
            setIsNickEmpty(true);
          }
        }
      }
    }
    if (nickName.trim() === '') {
      setIsNickEmpty(true);
    }
  };

  //회원가입

  const checkEmptyValue = (
    email: string,
    passWord: string,
    passCheck: string,
    nickName: string
  ): boolean => {
    return !!(email && passWord && passCheck && nickName);
  };

  const checkValuePass = (
    isEmailPass: boolean,
    isEmailCanUse: boolean,
    isPassWordPass: boolean,
    isPwChkPass: boolean,
    isNickPass: boolean
  ): boolean => {
    return (
      isEmailPass &&
      isEmailCanUse &&
      isPassWordPass &&
      isPwChkPass &&
      isNickPass
    );
  };

  const join = async () => {
    try {
      const isFormNotEmpty = checkEmptyValue(
        email,
        passWord,
        passCheck,
        nickName
      );
      const isFormValid = checkValuePass(
        isEmailPass,
        isEmailCanUse,
        isPassWordPass,
        isPwChkPass,
        isNickPass
      );
      if (
        (isFormNotEmpty && isFormValid && isTryNickCheck === 'notYet') ||
        isTryNickCheck === 'nonPass'
      ) {
        alert('닉네임 중복확인을 해주세요.');
      }
      if (!isFormNotEmpty || (!isFormValid && isTryNickCheck !== 'nonPass')) {
        alert('입력한 정보를 다시 확인해주세요.');
      }
      if (isFormNotEmpty && isFormValid && isTryNickCheck === 'pass') {
        const response = await axios.post(
          `${BACK_URL}:${BACK_PORT}/users/signup`,
          {
            nickname: nickName,
            email: email,
            password: passWord,
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          alert('회원가입되었습니다.');
          window.location.href = '/';
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert('잠시후 다시 시도해주세요.');
      }
    }
  };
  return (
    <div className="flexCenterAlign w-screen h-screen">
      <div className="flexCenterAlign flex-col">
        <div className="font-sans m-1.5 text-mainblue text-4xl font-bold">
          ALLREVIEW
        </div>
        <p className="mb-1.5">ALLREVIEW에 오신 여러분을 환영합니다!</p>
        <div className="grid items-center lg:grid-cols-3 md:grid-cols-1 gap-4">
          <span className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
            이메일
          </span>
          <div>
            <input
              className="w-96 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="text"
              placeholder="예시)example@email.com"
              onChange={checkEmail}
              onBlur={checkAlreadyUsedEmail}
            />
            <p
              className={`${
                isEmailPass ? 'hidden' : 'block'
              } mt-1.5 text-mainred text-sm`}
            >
              이메일 형식에 맞지 않습니다.
            </p>

            <p
              className={`${
                isEmailCanUse ? 'hidden' : 'block'
              } mt-1.5 text-mainred text-sm`}
            >
              사용중인 이메일입니다.
            </p>
          </div>
          <div />
          <span className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
            비밀번호
          </span>
          <div>
            <input
              className="w-96 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="password"
              placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
              onChange={checkPw}
            />
            <p
              className={`${
                isPassWordPass ? 'hidden' : 'block'
              } mt-1.5 text-mainred text-sm`}
            >
              비밀번호 조건을 확인해 주세요.
            </p>
          </div>
          <div />
          <span className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
            비밀번호 확인
          </span>
          <div>
            <input
              className="w-96 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              onChange={checkchkPw}
            />
            <p
              className={`${
                isPwChkPass ? 'hidden' : 'block'
              } mt-1.5 text-mainred text-sm`}
            >
              비밀번호와 일치하지 않습니다.
            </p>
          </div>
          <div />
          <span className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
            닉네임
          </span>
          <div>
            <input
              className={`${
                isNickEmpty ? 'bg-mainred/[.08]' : 'bg-inherit'
              } w-96 p-2.5 border border-solid border-mainblue rounded focus:outline-none`}
              type="text"
              placeholder="닉네임을 입력해주세요."
              onChange={getNickNameValue}
            />
          </div>
          <div>
            <button
              className="buttonLayout p-2.5 bg-buttongray"
              onClick={checkNickName}
            >
              중복확인
            </button>
          </div>
        </div>
        <ul className="list-disc text-sm mt-12 mb-4 text-sm">
          <li className="before:content-['*'] before:text-mainred">
            은 필수항목입니다.
          </li>
          <li>
            비밀번호는 영어 대문자, 소문자, 숫자, 특수문자 포함 8자리 이상으로
            설정해주세요.
          </li>
        </ul>
        <div>
          <Link to="/">
            <button className="buttonLayout p-2.5 bg-buttongray mr-4">
              취소
            </button>
          </Link>
          <button
            className="buttonLayout p-2.5 bg-mainred text-white"
            onClick={join}
          >
            가입하기
          </button>
        </div>
      </div>
      {openAlertModal()}
    </div>
  );
};
