import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks';
import { Link } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';
import { login, loginActions } from 'redux/slice/login-slice';

export const CheckPassword = () => {
  const [pw, setPw] = useState('');
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.user);
  const isLoading = useAppSelector(state => state.login.isLoading);
  const isPass = useAppSelector(state => state.login.isPass);

  const getPw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  };

  const checkPw = () => {
    try {
      setPw('');
      dispatch(loginActions.setIsCheck(true));
      dispatch(
        login({
          email: userInfo.email,
          password: pw,
          isCheck: true,
        })
      );
    } catch (error) {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '비밀번호가 일치하지 않습니다.',
          isQuestion: false,
          alertPath: '',
        })
      );
      dispatch(loginActions.setIsPass(false));
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
        {isPass === false && (
          <p className="text-sm text-mainred">비밀번호가 일치하지 않습니다.</p>
        )}
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
            {isLoading ? '확인중...' : '확인'}
          </button>
          <Link
            className="w-16 p-2 text-center bg-buttongray cursor-pointer rounded-lg"
            to={`/channel/${userInfo.id}?type=review`}
          >
            <button>취소</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
