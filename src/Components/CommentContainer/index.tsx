import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { CommentList } from 'Components/CommentList';
import { CommentTextarea } from 'Components/CommentTextarea';

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
  const [mainCommentList, setMainCommentList] = useState<CommentJsonType[]>([]);
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
      <CommentTextarea isNestedComment={false} />
      {mainCommentList.map((mainComment: CommentJsonType) => {
        return (
          <Fragment key={mainComment.id}>
            <CommentList mainComment={mainComment} />
          </Fragment>
        );
      })}
    </ReplyContainer>
  );
};