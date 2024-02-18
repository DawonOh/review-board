import { Fragment, useEffect } from 'react';
import { AlertModal, CheckPassword } from 'Components';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from 'hooks';
import { alertActions } from 'redux/slice/alert-slice';
import { loginActions } from 'redux/slice/login-slice';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from 'util/user-http';
import { persistor } from 'index';

export const Quit = () => {
  const dispatch = useAppDispatch();
  let isClickOk = useAppSelector(state => state.alert.isClickOk);
  let isPass = useAppSelector(state => state.login.isPass);
  let isLogin = useAppSelector(state => state.login.isLogin);

  useEffect(() => {
    return () => {
      dispatch(loginActions.setIsCheck(false));
      dispatch(loginActions.setIsPass(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (isPass) {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents:
            '정말로 탈퇴하시겠습니까?작성한 모든 리뷰 및 댓글이 사라집니다.',
          isQuestion: true,
          alertPath: '',
        })
      );
    }
  }, [isPass, dispatch]);

  const alertModal = (content: string) => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: content,
        isQuestion: false,
        alertPath: '/',
      })
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      persistor.purge();
      sessionStorage.removeItem('token');
      dispatch(loginActions.setIsPass(false));
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '탈퇴되었습니다.',
          isQuestion: false,
          alertPath: '/',
        })
      );
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alertModal(`존재하지 않는 사용자입니다.`);
          dispatch(loginActions.setIsPass(false));
        } else {
          alertModal('잠시 후 다시 시도해주세요.');
          dispatch(loginActions.setIsPass(false));
        }
      }
    },
  });

  useEffect(() => {
    if (isClickOk) {
      dispatch(loginActions.setIsCheck(false));
      mutate();
    }
  }, [isClickOk, dispatch]);

  return (
    <Fragment>
      {isLogin ? (
        <>
          <div className="flex w-4/5 justiry-between items-center mx-auto my-0 p-4">
            <h1 className="text-xl font-bold mb-8">탈퇴하기</h1>
          </div>
          {isPending ? (
            <div className="w-8 h-8 border-4 border-mainsky rounded-full border-t-4 border-t-white animate-spin" />
          ) : (
            <CheckPassword />
          )}
        </>
      ) : (
        <div className="flexCenterAlign w-full h-noScroll">
          <div className="mx-auto my-0">로그인 후 이용해주세요.</div>
        </div>
      )}
      <AlertModal />
    </Fragment>
  );
};
