import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { CommentList } from 'Components/CommentList';
import { CommentTextarea } from 'Components/CommentTextarea';
import { useParams } from 'react-router-dom';

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
  //댓글 작성 여부
  const [success, setSuccess] = useState(false);
  //로그인 한 유저 Id
  const [loginUserId, setLoginUserId] = useState(0);
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('accept', 'application/json');
  let token = localStorage.getItem('token');
  token && requestHeaders.set('Authorization', token);

  const params = useParams();
  let feedId = params.id;

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  useEffect(() => {
    fetch(`${BACK_URL}:${BACK_PORT}/comments/${feedId}`, {
      headers: requestHeaders,
    })
      .then(response => response.json())
      .then(json => {
        setMainCommentList(json);
      });
    if (success) {
      setSuccess(false);
    }
  }, [success]);
  useEffect(() => {
    fetch(`${BACK_URL}:${BACK_PORT}/users/getme`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        json.myInfo && setLoginUserId(json.myInfo.id);
      });
  }, []);
  return (
    <ReplyContainer>
      <Title>댓글</Title>
      <CommentTextarea isNestedComment={false} setSuccess={setSuccess} />
      {mainCommentList.map((mainComment: CommentJsonType) => {
        return (
          <Fragment key={mainComment.id}>
            <CommentList
              mainComment={mainComment}
              setSuccess={setSuccess}
              loginUserId={loginUserId}
            />
          </Fragment>
        );
      })}
    </ReplyContainer>
  );
};
