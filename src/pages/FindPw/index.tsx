import axios from 'axios';
import { AlertModal } from 'Components';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Styled from 'styled-components';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';

const MainContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const CenterContainer = Styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 1em;
`;

const TitleDiv = Styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  @media (max-width: 767px) {
    margin-top: 2em;
  }
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
  @media (max-width: 767px) {
    font-size: 1.4em;
  }
`;

const Input = Styled.input`
  width: 20em;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
  @media (max-width: 767px) {
    width: 10em;
  }
`;

const SmallMessage = Styled.p`
  font-size: 0.8em;
`;

const WarningMessage = Styled.p`
  color: #FF5959;
  font-size: 0.8em;
`;

const Button = Styled.button<{
  color?: string;
  email?: string;
  isEmailPass?: boolean;
}>`
  ${ButtonLayout}
  padding: 0.3em;
  background-color: ${props =>
    props.email !== '' && props.isEmailPass ? '#676FA3' : '#BDBDBD'};
  color: #fff;
  cursor: ${props =>
    (props.email !== '' && props.isEmailPass) || props.color === 'gray'
      ? 'pointer'
      : 'default'};
`;

const Flex = Styled.div`
  display: flex;
  gap: 1em;
`;

const Loader = Styled.div`
  width: 2em;
  height: 2em;
  border: 5px solid #cddeff;
  border-radius: 50%;
  border-top: 5px solid #fff;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FlexCenter = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
  gap: 1em;
`;

interface MessageType {
  id: number;
  text: string;
}
export const FindPw = () => {
  const [email, setEmail] = useState('');
  const [isEmailPass, setIsEmailPass] = useState(true);
  const [warningMessage, setWarningMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // 알림창을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const BACK_URL = process.env.REACT_APP_BACK_URL;

  // const openAlertModal = () => {
  //   if (isAlertModalOpen) {
  //     return (
  //       <AlertModal
  //         isAlertModalOpen={isAlertModalOpen}
  //         setIsAlertModalOpen={setIsAlertModalOpen}
  //         contents=""
  //         isQuestion={isQuestion}
  //         setResult={setResult}
  //       />
  //     );
  //   }
  // };

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

  // 비밀번호 찾기 버튼 클릭 시 메일 전송 API 호출
  const sendEmail = () => {
    setLoading(true);
    if (email !== '' && isEmailPass) {
      axios
        .post(
          `${BACK_URL}/users/signup/password`,
          {
            email: email,
            resetPasswordUrl: `http://localhost:3000/changepw`,
          },
          {
            timeout: 5000,
            headers: { Accept: 'application/json' },
          }
        )
        .then(response => {
          if (response.status === 200) {
            setLoading(false);
            setMessages([{ id: 1, text: '메일을 전송했습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
          }
        })
        .catch(error => {
          if (error.response.status === 404) {
            setLoading(false);
            setWarningMessage('존재하지 않는 사용자입니다.');
            return;
          }
          if (error.response.status === 500) {
            setLoading(false);
            setMessages([{ id: 1, text: '잠시 후 다시 시도해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
          }
        });
    }
  };
  // 3. loading state로 true일 때 jsx 주석 해놓은 부분으로 레이아웃 변경 (로딩 완료되면 다시 이메일 입력칸 나오게 하고, 이메일 칸은 비우기)
  // 4. 응답 status 200 -> alertModal 표시
  // + 응답 status 404 -> 존재하지 않는 사용자입니다. 표시
  return (
    <MainContainer>
      <CenterContainer>
        {loading ? (
          <FlexCenter>
            <Loader />
            메일을 전송하고 있습니다.
          </FlexCenter>
        ) : (
          <Fragment>
            <TitleDiv>
              <Title>비밀번호 찾기</Title>
            </TitleDiv>
            <p>가입한 이메일을 입력해주세요.</p>
            <SmallMessage>
              • 비밀번호를 변경할 수 있는 메일을 보내드립니다.
            </SmallMessage>
            <Input placeholder="example@email.com" onChange={checkEmail} />
            <WarningMessage>{warningMessage}</WarningMessage>
            <Flex>
              <Link to="/">
                <Button color="gray">메인으로 돌아가기</Button>
              </Link>
              <Button
                disabled={email !== '' && isEmailPass ? false : true}
                email={email}
                isEmailPass={isEmailPass}
                onClick={sendEmail}
              >
                비밀번호 찾기
              </Button>
            </Flex>
          </Fragment>
        )}
      </CenterContainer>
      {/* {openAlertModal()} */}
    </MainContainer>
  );
};
