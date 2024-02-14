import { useAppDispatch, useAppSelector } from 'hooks';
import React, { Fragment, useState } from 'react';
import { alertActions } from 'redux/slice/alert-slice';
import { login, loginActions } from 'redux/slice/login-slice';

export const CheckPassword = () => {
  const [pw, setPw] = useState('');
  const dispatch = useAppDispatch();
  const email = useAppSelector(state => state.user.email);

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
        })
      );
      dispatch(loginActions.pass);
    } catch (error) {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '비밀번호가 일치하지 않습니다.',
          isQuestion: false,
          alertPath: '',
        })
      );
      dispatch(loginActions.nonPass);
    }
  };

  return (
    <Fragment>
      <div className="flexCenterAlign flex-col w-full h-3/5">
        <div className="mx-auto my-0">
          <input
            className="md:w-40 w-80 mr-4 p-2 border-none outline-none z-50"
            type="password"
            placeholder="현재 비밀번호를 입력해주세요."
            value={pw}
            onChange={getPw}
          />
          <button className="w-16 p-2 cursor-pointer" onClick={checkPw}>
            확인
          </button>
        </div>
      </div>
    </Fragment>
  );
};
