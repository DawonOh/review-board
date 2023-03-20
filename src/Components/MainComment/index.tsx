import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import { CommentTextarea } from 'Components/CommentTextarea';
import { AlertModal } from 'Components/AlertModal';

const MainCommentContainer = Styled.div<{ isChildren: boolean }>`
  width: ${props => (props.isChildren ? '80%' : '90%')};
  margin: 1em auto;
  padding: 1em;
  border-left: 2px solid #f1f1f1;
`;

const InfoDiv = Styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5em;
`;

const Writer = Styled.span`
  font-weight: 700;
`;

const WriteDate = Styled.span`
  font-size: 0.8em;
  color: #D3D3D3;
`;

const Content = Styled.div`
  margin-top: 0.5em;
  line-height: 1.3em;
`;

const LockIcon = Styled.div`
  width: 1em;
  height: 1em;
  background: url(${LockImg});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

const Buttons = Styled.div`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

const ModifyDeleteButton = Styled.button<{ isDelete?: boolean }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: ${props => (props.isDelete ? '#C1C1C1' : '#CDDEFF')};
  cursor: pointer;
`;

const WriteCommentButton = Styled.button<{ writeNestedComment?: boolean }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: #FF5959;
  border: none;
  cursor: pointer;
`;
interface MainCommentProps {
  userId: number;
  nickname: string;
  createdAt: string;
  comment: string;
  isPrivate: boolean;
  deletedAt: string | null;
  isChildren: boolean;
  setIsTextareaOpen: Function;
  isTextareaOpen: boolean;
  commentId: number;
  setIsDeleted: Function;
  loginUserId: Number;
}

interface MessageType {
  id: number;
  text: string;
}
export const MainComment = ({
  userId,
  nickname,
  createdAt,
  comment,
  isPrivate,
  deletedAt,
  isChildren,
  setIsTextareaOpen,
  isTextareaOpen,
  commentId,
  setIsDeleted,
  loginUserId,
}: MainCommentProps) => {
  const [specificComment, setSpecificComment] = useState(comment);
  const [isModify, setIsModify] = useState(false);
  //AlertModal open 여부
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  //AlertModal 버튼 - '취소/확인'으로 넣을 때 조건(default:'확인')
  const [isQuestion, setIsQuestion] = useState(false);
  //AlertModal 메세지 내용
  const [alertMessage, setAlertMessage] = useState<MessageType[]>([]);
  //AlertModal에서 취소(false)/확인(true)중 어떤걸 눌렀는 지 확인
  const [result, setResult] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const createAtDate = createdAt.slice(0, -8);

  const token = localStorage.getItem('token');
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('accept', 'application/json');
  token && requestHeaders.set('Authorization', token);

  useEffect(() => {
    setSpecificComment(comment);
    if (deletedAt) {
      setSpecificComment('삭제된 댓글입니다.');
      return;
    }
    if (isPrivate) {
      comment === '## PRIVATE_COMMENT ##' &&
        setSpecificComment('비밀댓글입니다.');
      return;
    }
  }, [comment]);
  const writeNewNestedReply = () => {
    setIsTextareaOpen(!isTextareaOpen);
  };
  const modifyNestedReply = () => {
    setIsModify(!isModify);
  };
  const openAlertModal = () => {
    if (isAlertModalOpen) {
      return (
        <AlertModal
          isAlertModalOpen={isAlertModalOpen}
          setIsAlertModalOpen={setIsAlertModalOpen}
          contents={alertMessage}
          isQuestion={isQuestion}
          setResult={setResult}
        />
      );
    }
  };

  const deleteComment = () => {
    setAlertMessage([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };
  useEffect(() => {
    if (result) {
      fetch(`${BACK_URL}:${BACK_PORT}/comments/${commentId}`, {
        method: 'DELETE',
        headers: requestHeaders,
      })
        .then(res => res.json())
        .then(json => {
          if (json.message.includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '삭제되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsDeleted(true);
            return;
          }
          if (json.message.includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsDeleted(false);
            return;
          }
          if (json.message.includes('EXIST')) {
            setAlertMessage([{ id: 1, text: '존재하지 않는 댓글입니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsDeleted(false);
            return;
          }
        });
      return;
    }
  }, [result]);
  return (
    <Fragment>
      <MainCommentContainer isChildren={isChildren}>
        <InfoDiv>
          <Writer>
            {(loginUserId !== userId && isPrivate) || deletedAt
              ? '-'
              : nickname}
          </Writer>
          <WriteDate>{createAtDate}</WriteDate>
          {isPrivate && deletedAt === null && <LockIcon />}
          {!deletedAt && (
            <Buttons>
              {userId === loginUserId && (
                <Fragment>
                  <ModifyDeleteButton onClick={modifyNestedReply}>
                    {isModify ? '취소' : '수정'}
                  </ModifyDeleteButton>
                  <ModifyDeleteButton isDelete onClick={deleteComment}>
                    삭제
                  </ModifyDeleteButton>
                </Fragment>
              )}
              {!isChildren && (
                <WriteCommentButton onClick={writeNewNestedReply}>
                  {isTextareaOpen ? '취소' : '답글 달기'}
                </WriteCommentButton>
              )}
            </Buttons>
          )}
        </InfoDiv>
        {isModify && !deletedAt ? (
          <CommentTextarea
            isNestedComment={false}
            isModify={true}
            commentId={commentId}
            content={specificComment}
            setIsModify={setIsModify}
            setSuccess={setIsDeleted}
            modifyPrivate={isPrivate}
          />
        ) : (
          <Content>{specificComment}</Content>
        )}
      </MainCommentContainer>
      {openAlertModal()}
    </Fragment>
  );
};
