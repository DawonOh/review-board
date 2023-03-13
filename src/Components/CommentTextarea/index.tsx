import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import UnlockImg from '../../assets/images/unlock.png';

const WriteReplyContainer = Styled.div<{
  isNestedComment: boolean;
  isModify?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: ${props => (props.isNestedComment ? '80%' : '90%')};
  margin: 1em auto;
  padding: 1em;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  @media (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
`;

const TextArea = Styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  outline: none;
`;

const Buttons = Styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1em;
  @media (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
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
  isModify?: boolean;
  content?: string;
}
export const CommentTextarea = ({
  isNestedComment,
  isModify,
  content,
}: Props) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [mainCommentText, setMainCommentText] = useState('');
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);

  const textareaFocus = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const end = textareaFocus.current?.innerHTML.length;
    end && textareaFocus.current?.setSelectionRange(end + 1, end + 1);
    textareaFocus.current?.focus();
    if (content) {
      setReplyMainTextLength(content.length);
    }
  }, [content]);

  const handleClickPrivate = () => {
    setIsPrivate(!isPrivate);
  };

  const handleMainResizeHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.target.style.height = '1px';
    e.target.style.height = e.target.scrollHeight + 'px';
    const currentTextareaText = e.target.value;
    currentTextareaText
      ? setReplyMainTextLength(currentTextareaText.length)
      : setReplyMainTextLength(0);
  };
  return (
    <WriteReplyContainer isNestedComment={isNestedComment} isModify={isModify}>
      <TextArea
        placeholder={isNestedComment ? '답글 입력하기' : '댓글 입력하기'}
        onFocus={handleMainResizeHeight}
        onInput={handleMainResizeHeight}
        maxLength={1000}
        defaultValue={isModify ? content : ''}
        ref={textareaFocus}
      />
      <Buttons>
        <Count replyMainTextLength={replyMainTextLength}>
          {replyMainTextLength}/1000
        </Count>
        <LockDiv>
          <LockIcon isPrivate={isPrivate} onClick={handleClickPrivate} />
          <SmallFont>비밀댓글</SmallFont>
        </LockDiv>
        <ApplyButton>{isModify ? '수정' : '등록'}</ApplyButton>
      </Buttons>
    </WriteReplyContainer>
  );
};
