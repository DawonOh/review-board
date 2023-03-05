import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { CommentList } from 'Components/CommentList';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import UnlockImg from '../../assets/images/unlock.png';

const ReplyContainer = Styled.div`
  width: 70%;
  margin: 1em auto;
  border-top: 2px solid #f1f1f1;
`;
const Title = Styled.h2`
  margin-top: 1em;
  font-size: 1.3em;
  font-weight: 700;
`;

const WriteReplyContainer = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 90%;
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
export interface CommentJsonType {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    nickname: string;
    email: string;
  };
  feed: {
    id: number;
    title: string;
  };
  comment: string;
  is_private: boolean;
  children: [
    {
      id: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      user: {
        id: number;
        nickname: string;
        email: string;
      };
      comment: string;
      is_private: boolean;
    }
  ];
}
export interface ChildrenArr {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    nickname: string;
    email: string;
  };
  comment: string;
  is_private: boolean;
}
export const CommentContainer = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [mainCommentText, setMainCommentText] = useState('');
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);
  const [mainCommentList, setMainCommentList] = useState<CommentJsonType[]>([]);

  const handleClickPrivate = () => {
    setIsPrivate(!isPrivate);
  };

  const handleMainResizeHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    //textarea 내용에 따른 높이 변경
    e.target.style.height = '1px';
    e.target.style.height = e.target.scrollHeight + 'px';
    //글자수 count
    const currentTextareaText = e.target.value;
    setMainCommentText(currentTextareaText);
    currentTextareaText
      ? setReplyMainTextLength(currentTextareaText.length)
      : setReplyMainTextLength(0);
  };

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  useEffect(() => {
    fetch('/data/commentData.json')
      .then(res => res.json())
      .then(result => {
        setMainCommentList(result);
      });
  }, []);
  return (
    <ReplyContainer>
      <Title>댓글</Title>
      <WriteReplyContainer>
        <TextArea
          placeholder="댓글 입력하기"
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
      {mainCommentList.map((mainComment: CommentJsonType) => {
        return (
          <CommentList
            key={mainComment.id}
            mainComment={mainComment}
            childrenComments={mainComment.children}
          />
        );
      })}
    </ReplyContainer>
  );
};
