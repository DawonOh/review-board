import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const Login = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabeld] = useState(true);
  const [isLoginPass, setIsLoginPass] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const loginDivRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const closeClickOutside = (e: any) => {
  //     if (
  //       loginDivRef.current &&
  //       !loginDivRef.current.contains(e.target as Node)
  //     ) {
  //       setIsModalOpen(false);
  //     }
  //   };
  //   document.addEventListener('click', closeClickOutside);
  //   return () => {
  //     document.removeEventListener('click', closeClickOutside);
  //   };
  // }, [setIsModalOpen]);

  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const getPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  useEffect(() => {
    if (email && password) {
      setIsDisabeld(false);
    } else {
      setIsDisabeld(true);
    }

    if (isModalOpen === false) {
      setEmail('');
      setPassword('');
    }
  }, [email, password, isModalOpen]);

  const emailInput = useRef<HTMLInputElement>(null);

  const login = () => {
    fetch(`${BACK_URL}:${BACK_PORT}/users/signin`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(res => res.json())
      .then(json => {
        let message = String(json.message);
        if (message.includes('SIGNIN_SUCCESS')) {
          localStorage.setItem('token', json.result.token);
          setIsModalOpen(false);
          setIsLoginPass(false);
          window.location.href = '/';
        } else {
          setIsLoginPass(true);
          setEmail('');
          setPassword('');
          emailInput.current?.focus();
        }
      });
  };

  return (
    <div className="flexCenterAlign fixed inset-x-0 inset-y-0 bg-black/50">
      <div
        className="w-132 h-80 flexCenterAlign bg-white rounded"
        ref={loginDivRef}
      >
        <div className="w-full h-full relative flexCenterAlign flex-col gap-5">
          <div
            className="w-4 h-4 absolute top-8 right-8 bg-[url('./assets/images/close.png')] bg-no-repeat bg-cover cursor-pointer"
            onClick={() => setIsModalOpen(false)}
            data-testid="close button"
          />
          <h1 className="font-sans text-mainblue text-3xl font-bold">
            ALLREVIEW
          </h1>
          <input
            className="w-80 p-2.5 text-base border border-buttongray rounded-md focus:outline-none"
            type="text"
            placeholder="이메일을 입력해주세요."
            onChange={getEmail}
            value={email}
            ref={emailInput}
          />
          <input
            className="w-80 p-2.5 text-base border border-buttongray rounded-md focus:outline-none"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            onChange={getPw}
            value={password}
          />
          {isLoginPass && (
            <p className="text-mainred text-sm">
              이메일/비밀번호가 일치하지 않습니다.
            </p>
          )}

          <div className="flexCenterAlign gap-1.5">
            <button
              className={`buttonLayout p-2 ${
                isDisabled ? 'bg-buttongray' : 'bg-mainblue'
              } text-white ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={login}
              disabled={isDisabled}
            >
              로그인
            </button>
          </div>
          <div className="flex gap-2">
            <Link to="/join">
              <span className="text-sm">회원가입</span>
            </Link>
            |
            <Link to="/findpw">
              <span className="text-sm">비밀번호 찾기</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
