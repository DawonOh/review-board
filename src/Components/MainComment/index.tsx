import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import { CommentTextarea } from 'Components/CommentTextarea';

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
  line-height: 1.1em;
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
  nickname: string;
  createdAt: string;
  comment: string;
  isPrivate: boolean;
  deletedAt: string | null;
  isChildren: boolean;
  setIsTextareaOpen: Function;
  isTextareaOpen: boolean;
}
export const MainComment = ({
  nickname,
  createdAt,
  comment,
  isPrivate,
  deletedAt,
  isChildren,
  setIsTextareaOpen,
  isTextareaOpen,
}: MainCommentProps) => {
  const [specificComment, setSpecificComment] = useState(comment);
  const [isModify, setIsModify] = useState(false);
  const [mainCommentText, setMainCommentText] = useState('');
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);
  const createAtDate = createdAt.slice(0, -8);
  useEffect(() => {
    if (deletedAt) {
      setSpecificComment('삭제된 댓글입니다.');
      return;
    }
    if (isPrivate) {
      setSpecificComment('비밀댓글입니다.');
      return;
    }
    setSpecificComment(comment);
    return;
  }, [comment, isPrivate, deletedAt]);
  const writeNewNestedReply = () => {
    setIsTextareaOpen(!isTextareaOpen);
  };
  const modifyNestedReply = () => {
    setIsModify(!isModify);
  };
  const handleMainResizeHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.target.style.height = '1px';
    e.target.style.height = e.target.scrollHeight + 'px';
    const currentTextareaText = e.target.value;
    setMainCommentText(currentTextareaText);
    currentTextareaText
      ? setReplyMainTextLength(currentTextareaText.length)
      : setReplyMainTextLength(0);
  };
  return (
    <MainCommentContainer isChildren={isChildren}>
      <InfoDiv>
        <Writer>{isPrivate || deletedAt ? '-' : nickname}</Writer>
        <WriteDate>{createAtDate}</WriteDate>
        {isPrivate && deletedAt === null && <LockIcon />}
        {!deletedAt && (
          <Buttons>
            <ModifyDeleteButton onClick={modifyNestedReply}>
              {isModify ? '취소' : '수정'}
            </ModifyDeleteButton>
            <ModifyDeleteButton isDelete>삭제</ModifyDeleteButton>
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
          content={specificComment}
        />
      ) : (
        <Content>{specificComment}</Content>
      )}
    </MainCommentContainer>
  );
};
