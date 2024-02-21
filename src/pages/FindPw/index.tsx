import instance from 'api';
import { AlertModal } from 'Components';
import { useAppDispatch } from 'hooks';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';

export const FindPw = () => {
  const [email, setEmail] = useState('');
  const [isEmailPass, setIsEmailPass] = useState<boolean | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  //이메일 유효성 검사
  const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+/;
    if (emailRegex.test(e.target.value)) {
      setWarningMessage('');
      setIsEmailPass(true);
    } else {
      setWarningMessage('이메일 형식을 확인해주세요.');
      setIsEmailPass(false);
    }
    setEmail(e.target.value);
  };

  const alert = (content: string) => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: content,
        alertPath: '',
        isQuestion: false,
      })
    );
  };

  // 비밀번호 찾기 버튼 클릭 시 메일 전송 API 호출
  const sendEmail = () => {
    setLoading(true);
    if (email !== '' && isEmailPass) {
      instance
        .post(`/users/signup/password`, {
          email: email,
          resetPasswordUrl: `http://localhost:3000/changepw`,
        })
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            setIsEmailPass(false);
            alert('메일을 전송했습니다.');
          }
        })
        .catch(error => {
          if (error.response.status === 404) {
            setLoading(false);
            setWarningMessage('존재하지 않는 사용자입니다.');
            setIsEmailPass(false);
            return;
          }
          if (error.response.status === 500) {
            setLoading(false);
            setIsEmailPass(false);
            alert('잠시 후 다시 시도해주세요.');
          }
        });
    }
  };
  return (
    <div className="flexCenterAlign flex-col w-full h-screen">
      <div className="flex justify-center items-start flex-col gap-4">
        {loading ? (
          <div className="flexCenterAlign flex-col gap-4">
            <div className="w-8 h-8 border-4 border-mainsky rounded-full border-t-4 border-t-white animate-spin" />
            메일을 전송하고 있습니다.
          </div>
        ) : (
          <Fragment>
            <div className="flex w-full justify-between items-center mx-auto my-0">
              <h1 className="text-xl font-bold">비밀번호 찾기</h1>
            </div>
            <p>가입한 이메일을 입력해주세요.</p>
            <p className="text-sm">
              • 비밀번호를 변경할 수 있는 메일을 보내드립니다.
            </p>
            <input
              className="w-80 p-2 border-[#eo0e0e0] rounded-lg focus:outline-none"
              placeholder="example@email.com"
              onChange={checkEmail}
            />
            <p className="text-mainred text-sm">{warningMessage}</p>
            <div className="flex gap-4">
              <Link to="/">
                <button className="p-2 bg-buttongray rounded-lg">
                  메인으로 돌아가기
                </button>
              </Link>
              <button
                className={`p-2 rounded-lg ${
                  isEmailPass === true
                    ? 'bg-mainblue text-white cursor-pointer'
                    : 'bg-buttongray text-black'
                }`}
                disabled={email !== '' && isEmailPass ? false : true}
                onClick={sendEmail}
              >
                비밀번호 찾기
              </button>
            </div>
          </Fragment>
        )}
      </div>
      <AlertModal />
    </div>
  );
};
