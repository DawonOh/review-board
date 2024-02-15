import React, { Fragment, useEffect, useState } from 'react';
import { AlertModal, MobileMenu } from 'Components';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks';
import { alertActions } from 'redux/slice/alert-slice';
import { useMutation } from '@tanstack/react-query';
import { modifyUserInfo } from 'util/user-http';
import { userActions } from 'redux/slice/user-slice';
import { queryClient } from 'util/feedDetail-http';

export const ModifyInfoPage = () => {
  const loginUserInfo = useAppSelector(state => state.user);
  const [newNickName, setNewNickName] = useState(loginUserInfo?.nickname);
  const [newEmail, setNewEmail] = useState(loginUserInfo?.email);
  const [isEmailPass, setIsEmailPass] = useState(true);
  const [warningMessage, setWarningMessage] = useState('');

  const dispatch = useAppDispatch();
  const isLogin = useAppSelector(state => state.login.isLogin);
  const isClickedOk = useAppSelector(state => state.alert.isClickOk);

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
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '변경하시겠습니까?',
        isQuestion: true,
        alertPath: '',
      })
    );
  };

  const alertModal = (content: string, path?: string) => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: content,
        isQuestion: false,
        alertPath: path ? path : '',
      })
    );
  };

  const { mutate } = useMutation({
    mutationFn: modifyUserInfo,
    onSuccess: data => {
      dispatch(
        userActions.changeInfo({
          email: data?.result.email,
          nickname: data?.result.nickname,
        })
      );
      dispatch(alertActions.closeModal());
      queryClient.invalidateQueries({
        queryKey: ['channelUserInfo', { userId: loginUserInfo.id.toString() }],
      });
      alertModal('변경되었습니다.', `/channel/${loginUserInfo.id}?type=review`);
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          error.response?.data.message.includes('EMAIL')
            ? alertModal(`이미 존재하는 이메일입니다.`)
            : alertModal(`이미 존재하는 닉네임입니다.`);
        }
        if (error.response?.status === 400) {
          alertModal('기존의 정보와 다르게 작성해주세요.');
        }
        if (error.response?.status === 500) {
          alertModal('잠시 후 다시 시도해주세요.');
        }
      }
    },
  });

  useEffect(() => {
    if (isClickedOk) {
      mutate({ nickname: newNickName, email: newEmail });
      dispatch(alertActions.setIsClickOk());
    }
  }, [isClickedOk]);

  const buttonStyle = () => {
    if (newEmail !== '' && newNickName !== '' && isEmailPass) {
      return 'bg-mainblue text-white text-sm cursor-pointer';
    }
    return 'bg-buttongray text-sm cursor-pointer';
  };
  return (
    <Fragment>
      <MobileMenu />
      <Fragment>
        <h1 className="w-4/5 mx-auto my-0 text-xl font-bold mb-8 p-8">
          개인 정보 수정
        </h1>
        {isLogin ? (
          <div className="flexCenterAlign flex-col md:w-132 w-80 h-3/5 mx-auto my-0">
            <div className="flex justify-start flex-col w-4/5 gap-4">
              <label className="w-full">
                <p>닉네임</p>
                <input
                  className="w-full p-2 border-none outline-none rounded-lg"
                  defaultValue={loginUserInfo.nickname}
                  onChange={getNickName}
                />
              </label>
              <label className="w-full">
                <p>이메일</p>
                <input
                  className="w-full p-2 border-none outline-none rounded-lg"
                  defaultValue={loginUserInfo.email}
                  onChange={getEmail}
                />
              </label>
              <p
                className={`mt-2 text-mainred text-sm ${
                  warningMessage === '' ? 'hidden' : 'block'
                }`}
              >
                {warningMessage}
              </p>
              <div>
                <span className="mr-4">비밀번호</span>
                <Link to="/changepw">
                  <button className="w-full p-2 bg-buttongray text-white text-sm rounded-lg cursor-pointer">
                    비밀번호 수정
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex w-4/5 justify-between items-center mt-12">
              <Link to="/quit">
                <div className="text-sm">탈퇴하기</div>
              </Link>
              <div className="flexCenterAlign gap-2">
                <button
                  className={`p-2 rounded-lg ${buttonStyle()}`}
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
                </button>
                <Link to={`/channel/${loginUserInfo.id}?type=review`}>
                  <button className="p-2 bg-mainred text-white text-sm rounded-lg cursor-pointer">
                    취소
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flexCenterAlign flex-col w-full h-3/5">
            <div className="mx-auto my-0">로그인 후 이용해주세요.</div>
          </div>
        )}
      </Fragment>
      <AlertModal />
    </Fragment>
  );
};
