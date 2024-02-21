import { useAppDispatch, useAppSelector } from 'hooks';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, loginActions } from 'redux/slice/login-slice';

export const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector((state: any) => state.login.isLogin);
  const isLoading = useAppSelector(state => state.login.isLoading);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginActions.setIsCheck(false));
    dispatch(
      login({
        email: userInfo.email,
        password: userInfo.password,
        isCheck: false,
      })
    );
  };

  const handleUserInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserInfo({ ...userInfo, [id]: value });
  };
  return (
    <div className="flex">
      <div className="md:flexCenterAlign hidden w-1/2 h-screen bg-mainsky/[.4]">
        <Link to="/">
          <div className="w-6 h-6 absolute top-8 left-8 bg-[url('./assets/images/back.png')] bg-no-repeat bg-cover cursor-pointer" />
        </Link>
        <div className="w-full h-1/2 flex justify-between items-center flex-col">
          <div className="text-center animate-fade-in">
            <p className="text-3xl font-bold mb-3.5">안녕하세요!</p>
            <p className="text-3xl font-bold">처음이신가요?</p>
          </div>
          <Link to="/join">
            <button className="w-60 h-20 bg-white text-2xl rounded-full hover:bg-mainblue hover:text-white opacity-0 animate-fade-in-slow">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>

      <div className="md:w-1/2 w-full h-screen flexCenterAlign flex-col bg-white">
        <Link to="/">
          <div className="w-6 h-6 absolute top-8 left-8 bg-[url('./assets/images/back.png')] bg-no-repeat bg-cover cursor-pointer" />
        </Link>
        <form
          className="w-full h-1/2 flex flex-col items-center justify-between animate-fade-in"
          onSubmit={submit}
        >
          <div className="flexCenterAlign flex-col md:gap-7 gap-3">
            <h1 className="mb-10 font-sans text-mainblue text-3xl font-bold">
              ALLREVIEW
            </h1>
            <input
              className="w-80 p-2.5 text-base border border-buttongray rounded-md focus:outline-none"
              type="text"
              placeholder="이메일을 입력해주세요."
              id="email"
              onChange={handleUserInfo}
            />
            <input
              className="w-80 p-2.5 text-base border border-buttongray rounded-md focus:outline-none"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              id="password"
              onChange={handleUserInfo}
            />
            {isLogin === false && (
              <p className="text-mainred text-sm">
                이메일/비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <div className="flexCenterAlign gap-1.5">
            <button
              className={`w-40 md:w-60 h-12 md:h-20 ${
                userInfo.email?.trim() === '' ||
                userInfo.password?.trim() === ''
                  ? 'bg-buttongray text-black'
                  : 'bg-mainblue text-white'
              } text-2xl  rounded-full opacity-0 animate-fade-in-slow`}
              type="submit"
              disabled={
                userInfo.email?.trim() === '' ||
                userInfo.password?.trim() === ''
                  ? true
                  : false
              }
            >
              {isLoading ? '로그인 중...' : 'SIGN IN'}
            </button>
          </div>
        </form>

        <span className="flex gap-2 mt-5 md:hidden animate-fade-in">
          <Link to="/join">
            <span className="text-sm">회원가입</span>
          </Link>
          |
          <Link to="/findpw" className="md:fixed md:bottom-40">
            <span className="text-sm">비밀번호 찾기</span>
          </Link>
        </span>
        <Link
          to="/findpw"
          className="hidden md:block md:fixed md:bottom-40 animate-fade-in"
        >
          <span className="text-sm">비밀번호 찾기</span>
        </Link>
      </div>
    </div>
  );
};
