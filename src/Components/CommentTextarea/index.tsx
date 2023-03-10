import React, { useState } from 'react';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import UnlockImg from '../../assets/images/unlock.png';

const WriteReplyContainer = Styled.div<{ isNestedComment: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: ${props => (props.isNestedComment ? '80%' : '90%')};
  margin: 1em auto;
  padding: 1em;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  @media (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
`;

const TextArea = Styled.textarea`
  width: 70%;
  border: none;
  resize: none;
  outline: none;
`;

const Buttons = Styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1em;
`;

const ApplyButton = Styled.button`
  ${ButtonLayout}
  padding: 0 0.4em;
  font-size: 0.9em;
  color: #fff;
  background-color: #FF5959;
  cursor: pointer;
`;

const LockDiv = Styled.div`
  display: flex;
  align-items: flex-end;
`;

const LockIcon = Styled.div<{ isPrivate: boolean }>`
  width: 1em;
  height: 1em;
  background: url(${props => (props.isPrivate ? LockImg : UnlockImg)});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

const Count = Styled.span<{ replyMainTextLength: number }>`
  font-size: 0.8em;
  color: ${props => props.replyMainTextLength === 1000 && '#FF5959'}
`;

const SmallFont = Styled.span`
  font-size: 0.8em;
`;
interface Props {
  isNestedComment: boolean;
}
export const CommentTextarea = ({ isNestedComment }: Props) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [mainCommentText, setMainCommentText] = useState('');
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);

  const handleClickPrivate = () => {
    setIsPrivate(!isPrivate);
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
    <WriteReplyContainer isNestedComment={isNestedComment}>
      <TextArea
        placeholder={isNestedComment ? '답글 입력하기' : '댓글 입력하기'}
        onInput={handleMainResizeHeight}
        maxLength={1000}
      />
      <Buttons>
        <Count replyMainTextLength={replyMainTextLength}>
          {replyMainTextLength}/1000
        </Count>
        <LockDiv>
          <LockIcon isPrivate={isPrivate} onClick={handleClickPrivate} />
          <SmallFont>비밀댓글</SmallFont>
        </LockDiv>
        <ApplyButton>등록</ApplyButton>
      </Buttons>
    </WriteReplyContainer>
  );
};
