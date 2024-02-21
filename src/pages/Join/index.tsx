import React, { useState } from 'react';
import axios from 'axios';
import useJoinInput from 'hooks/useJoinInput';
import { Link } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';
import { AlertModal } from 'Components';
import { useAppDispatch } from 'hooks';

// 이메일 유효성 검사
const emailRegex = /[a-zA-Z0-9._+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+/;
const checkEmailRegex = (value: string) => emailRegex.test(value);

// 비밀번호 유효성 검사
const passWordRegex =
  /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/;

const checkPassWordRegex = (value: string) => passWordRegex.test(value);

export const Join = () => {
  const [isEmailPass, setIsEmailPass] = useState<null | boolean>(null);
  const [isNickNamePass, setIsNickNamePass] = useState<null | boolean>(null);

  const BACK_URL = process.env.REACT_APP_BACK_URL;

  const dispatch = useAppDispatch();

  // 이메일 input
  const {
    value: email,
    hasError: emailHasError,
    isValid: emailIsValid,
    valueChangeHandler: emailChangeHandler,
    inputClickHandler: emailClickHandler,
  } = useJoinInput(checkEmailRegex);

  // 이메일 중복 확인 API 요청
  const emailCheckHandler = async () => {
    if (!emailHasError) {
      try {
        let response = await axios.get(
          `${BACK_URL}/users/checkemail?email=${email}`
        );
        if (response.status === 200) {
          setIsEmailPass(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            setIsEmailPass(false);
          }
        }
      }
    }
  };

  // 비밀번호 input
  const {
    value: passWord,
    hasError: passWordHasError,
    isValid: passWordIsValid,
    valueChangeHandler: passWordChangeHandler,
    inputClickHandler: passWordClickHandler,
  } = useJoinInput(checkPassWordRegex);

  // 비밀번호 확인 input
  const {
    value: passWordCheck,
    hasError: passWordCheckHasError,
    isValid: passWordCheckIsValid,
    valueChangeHandler: passWordCheckChangeHandler,
    inputClickHandler: passWordCheckClickHandler,
  } = useJoinInput(value => value === passWord);

  // 닉네임 input
  const {
    value: nickName,
    hasError: nickNameHasError,
    isValid: nickNameIsValid,
    valueChangeHandler: nickNameChangeHandler,
    inputClickHandler: nickNameClickHandler,
  } = useJoinInput(value => value.trim() !== '');

  //닉네임 중복확인
  const getNickNameValue = async () => {
    try {
      if (!nickNameHasError) {
        const response = await axios.get(
          `${BACK_URL}/users/checknickname?nickname=${nickName}`
        );
        if (response.status === 200) {
          setIsNickNamePass(true);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setIsNickNamePass(false);
        }
      }
    }
  };

  const join = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let isAllPass =
        emailIsValid &&
        passWordIsValid &&
        passWordCheckIsValid &&
        nickNameIsValid &&
        isNickNamePass === true;
      if (isNickNamePass === null) {
        dispatch(
          alertActions.setModal({
            isModalOpen: true,
            contents: '닉네임 중복확인을 해주세요.',
            isQuestion: false,
            alertPath: '',
          })
        );
        return;
      }
      if (isNickNamePass === false || !isAllPass) {
        dispatch(
          alertActions.setModal({
            isModalOpen: true,
            contents: '입력한 정보를 다시 확인해주세요.',
            isQuestion: false,
            alertPath: '',
          })
        );
        return;
      }
      if (isAllPass) {
        const response = await axios.post(
          `${BACK_URL}/users/signup`,
          {
            nickname: nickName,
            email: email,
            password: passWord,
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          dispatch(
            alertActions.setModal({
              isModalOpen: true,
              contents: '가입되었습니다.',
              isQuestion: false,
              alertPath: '/',
            })
          );
          return;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          dispatch(
            alertActions.setModal({
              isModalOpen: true,
              contents: '입력한 정보를 다시 확인해주세요.',
              isQuestion: false,
              alertPath: '',
            })
          );
          return;
        }
        dispatch(
          alertActions.setModal({
            isModalOpen: true,
            contents: '잠시 후 다시 시도해주세요.',
            isQuestion: false,
            alertPath: '',
          })
        );
        return;
      }
    }
  };

  return (
    <div className="flexCenterAlign w-screen h-screen">
      <div className="flexCenterAlign flex-col">
        <div className="font-sans m-1.5 text-mainblue text-4xl font-bold">
          ALLREVIEW
        </div>
        <p className="mb-10">안녕하세요!</p>
        <form className="flex flexCenterAlign flex-col gap-4" onSubmit={join}>
          <div className="flex flex-col mb-4">
            <label className="before:content-['*'] before:text-mainred">
              이메일
            </label>
            <input
              className="lg:w-96 w-80 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="text"
              placeholder="예시)example@email.com"
              onChange={emailChangeHandler}
              onClick={emailClickHandler}
              onBlur={emailCheckHandler}
              value={email}
            />
            {emailHasError && (
              <p className="mt-1.5 text-mainred text-sm">
                이메일 형식에 맞지 않습니다.
              </p>
            )}
            {isEmailPass === false && !emailHasError && (
              <p className="mt-1.5 text-mainred text-sm">
                사용중인 이메일입니다.
              </p>
            )}
          </div>

          <div className="flex flex-col mb-4">
            <label className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
              비밀번호
            </label>
            <input
              className="lg:w-96 w-80 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="password"
              placeholder="영문, 숫자, 특수문자 포함 8자리 이상"
              onChange={passWordChangeHandler}
              onClick={passWordClickHandler}
              value={passWord}
            />
            {passWordHasError && (
              <p className="mt-1.5 text-mainred text-sm">
                비밀번호 조건을 확인해 주세요.
              </p>
            )}
          </div>

          <div className="flex flex-col mb-4">
            <label className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
              비밀번호 확인
            </label>
            <input
              className="lg:w-96 w-80 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              onChange={passWordCheckChangeHandler}
              onClick={passWordCheckClickHandler}
              value={passWordCheck}
            />
            {passWordCheckHasError && (
              <p className="mt-1.5 text-mainred text-sm">
                비밀번호와 일치하지 않습니다.
              </p>
            )}
          </div>

          <div className="flex flex-col mb-4">
            <label className="lg:justify-self-end md:justify-self-start before:content-['*'] before:text-mainred">
              닉네임
            </label>
            <input
              className="lg:w-96 w-80 p-2.5 border border-solid border-mainblue rounded focus:outline-none"
              type="text"
              placeholder="닉네임을 입력해주세요."
              onChange={nickNameChangeHandler}
              onClick={nickNameClickHandler}
              value={nickName}
            />
            <button
              type="button"
              className="buttonLayout p-2.5 bg-buttongray"
              onClick={getNickNameValue}
            >
              중복확인
            </button>
            {isNickNamePass && (
              <p className="mt-1.5 text-mainblue text-sm">
                사용 가능한 닉네임입니다.
              </p>
            )}
            {isNickNamePass === false && (
              <p className="mt-1.5 text-mainred text-sm">
                이미 사용중인 닉네임입니다.
              </p>
            )}
          </div>
          <ul className="lg:w-96 w-80 list-disc text-sm mt-12 mb-4 text-sm">
            <li className="before:content-['*'] before:text-mainred">
              은 필수항목입니다.
            </li>
            <li>
              비밀번호는 영어 대문자, 소문자, 숫자, 특수문자 포함 8자리 이상으로
              설정해주세요.
            </li>
          </ul>
          <div className="w-full flex">
            <Link to="/">
              <button
                type="button"
                className="buttonLayout p-2.5 bg-buttongray mr-4"
              >
                취소
              </button>
            </Link>
            <button
              type="submit"
              className="w-80 buttonLayout p-2.5 bg-mainred text-white"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
      <AlertModal />
    </div>
  );
};
