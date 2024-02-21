import { useMutation } from '@tanstack/react-query';
import { AlertModal, CheckPassword, MobileMenu } from 'Components';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from 'hooks';
import { persistor } from 'index';
import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';
import { loginActions } from 'redux/slice/login-slice';
import { modifyUserInfo } from 'util/user-http';
interface UserInfoType {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  nickname: string;
  updated_at: string;
}

export const ModifyPw = () => {
  const [newPw, setNewPw] = useState('');
  const [checkNewPw, setCheckNewPw] = useState('');
  const [isRegexPass, setIsRegexPass] = useState(true);
  const [isSamePass, setIsSamePass] = useState(true);
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  let isPwPass = useAppSelector(state => state.login.isPass);

  const dispatch = useAppDispatch();

  const location = useLocation();
  let params = new URLSearchParams(location.search);
  let query = params.get('token');

  useEffect(() => {
    if (query) {
      dispatch(loginActions.setIsPass(true));
      axios
        .get<UserInfoType>(`${BACK_URL}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: query },
        })
        .catch(error => {
          dispatch(
            alertActions.setModal({
              isModalOpen: true,
              contents: '링크가 만료되었습니다.메일을 다시 전송해주세요.',
              isQuestion: false,
              alertPath: '/findpw',
            })
          );
        });
    }
    return () => {
      dispatch(loginActions.setIsPass(null));
    };
  }, [BACK_URL, dispatch, query]);

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
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '변경하시겠습니까?',
        isQuestion: true,
        alertPath: '',
      })
    );
  };

  let isClickOk = useAppSelector(state => state.alert.isClickOk);

  const { mutate } = useMutation({
    mutationFn: modifyUserInfo,
    onSuccess: () => {
      persistor.purge();
      sessionStorage.removeItem('token');
      dispatch(loginActions.setIsPass(false));
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '변경되었습니다.새 비밀번호로 로그인해주세요.',
          isQuestion: false,
          alertPath: '/login',
        })
      );
    },
    onError: () => {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '잠시 후 다시 시도해주세요.?',
          isQuestion: false,
          alertPath: '/findpw',
        })
      );
    },
  });

  useEffect(() => {
    if (isClickOk) {
      query ? mutate({ password: newPw, query }) : mutate({ password: newPw });
    }
  }, [isClickOk, dispatch]);

  return (
    <Fragment>
      <MobileMenu />
      <div className="flex w-4/5 justify-between items-center mx-auto my-0 p-4">
        <h1 className="text-xl font-bold mb-8">비밀번호 변경</h1>
      </div>
      {isPwPass ? (
        <div className="flexCenterAlign flex-col w-full h-modifyInfoHeight">
          <div className="grid w-80 gap-4 mx-auto my-0">
            <div>새 비밀번호</div>
            <input
              className="w-full p-2 border-none outline-none rounded-lg"
              type="password"
              placeholder="비밀번호"
              onChange={getNewPw}
            />
            {isRegexPass === false && (
              <p className="text-sm text-mainred">
                비밀번호 조건을 확인해주세요.
              </p>
            )}
            <div>새 비밀번호 확인</div>
            <input
              className="w-full p-2 border-none outline-none rounded-lg"
              type="password"
              placeholder="비밀번호 확인"
              onChange={getCheckNewPw}
            />
            {isSamePass === false && (
              <p className="text-sm text-mainred">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
            <button
              className={`p-2 rounded-lg ${
                newPw.trim() !== '' &&
                checkNewPw.trim() &&
                isRegexPass &&
                isSamePass
                  ? 'bg-mainblue text-white cursor-pointer'
                  : 'bg-buttongray cursor-default'
              }`}
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
            </button>
          </div>
          <p className="mt-4 p-4 text-sm">
            • 영어 대문자, 소문자, 숫자, 특수문자 포함 8자 ~ 20자로
            설정해주세요.
          </p>
        </div>
      ) : (
        <CheckPassword />
      )}
      <AlertModal />
    </Fragment>
  );
};
