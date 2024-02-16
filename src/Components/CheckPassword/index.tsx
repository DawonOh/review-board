import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks';
import { Link } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';
import { login, loginActions } from 'redux/slice/login-slice';

export const CheckPassword = () => {
  const [pw, setPw] = useState('');
  const dispatch = useAppDispatch();
  const email = useAppSelector(state => state.user.email);
  const loginUserId = useAppSelector(state => state.user.id);

  const getPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  const checkPw = () => {
    try {
      setPw('');
      dispatch(
        login({
          email: email,
          password: pw,
          isLogin: true,
          isCheck: true,
        })
      );
      dispatch(loginActions.pass());
    } catch (error) {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '비밀번호가 일치하지 않습니다.',
          isQuestion: false,
          alertPath: '',
        })
      );
      dispatch(loginActions.nonPass());
    }
  };

  return (
    <div className="flexCenterAlign md:w-132 w-80 h-modifyInfoHeight mx-auto my-0">
      <div className="flex justify-start flex-col w-4/5 gap-4">
        <label className="w-full">
          <p>현재 비밀번호를 입력해주세요.</p>
          <input
            className="w-full p-2 border-none outline-none rounded-lg"
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={getPw}
          />
        </label>
        <div className="flexCenterAlign gap-4">
          <button
            className={`flex-1 p-2 rounded-lg ${
              pw !== ''
                ? 'bg-mainblue text-white cursor-pointer'
                : 'bg-buttongray cursor-default'
            }`}
            disabled={pw === ''}
            onClick={checkPw}
          >
            확인
          </button>
          <Link
            className="w-16 p-2 text-center bg-buttongray cursor-pointer rounded-lg"
            to={`/channel/${loginUserId}?type=review`}
          >
            <button>취소</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
