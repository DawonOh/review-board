import React, { Fragment, useEffect, useState } from 'react';
import { MainComment } from 'Components/MainComment';
import { ChildrenArr } from 'Components/CommentContainer';
import { CommentTextarea } from 'Components/CommentTextarea';

// mainComment : CommentContainer에서 백에서 받은 데이터를 props로 전달
// success,setSuccess : 댓글 작성 여부 state
// loginUserId : 로그인한 유저의 id
interface PropsType {
  mainComment: {
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
  };
  setSuccess: Function;
  loginUserId: number;
  success: boolean;
}

// 하나의 댓글에 여러개의 대댓글과 대댓글 입력창의 묶음
export const CommentList = ({
  mainComment,
  setSuccess,
  loginUserId,
  success,
}: PropsType) => {
  // 대댓글 목록
  const [childrenComments, setChildrenComments] = useState<ChildrenArr[]>([]);

  // 대댓글 입력창 나타나는지 여부
  const [isTextareaOpen, setIsTextareaOpen] = useState(false);

  // 대댓글 목록 저장
  useEffect(() => {
    setChildrenComments(mainComment.children);
  }, [mainComment]);

  // 댓글이 작성되면 대댓글 입력창 화면에서 제거
  useEffect(() => {
    success && setIsTextareaOpen(false);
  }, [success]);

  // MainComment의 isChildren 속성으로 댓글과 대댓글 구분
  // CommentTextarea : 대댓글 입력창
  return (
    <Fragment>
      <MainComment
        userId={mainComment.user.id}
        nickname={mainComment.user.nickname}
        createdAt={mainComment.created_at}
        comment={mainComment.comment}
        isPrivate={mainComment.is_private}
        deletedAt={mainComment.deleted_at}
        isChildren={false}
        setIsTextareaOpen={setIsTextareaOpen}
        isTextareaOpen={isTextareaOpen}
        commentId={mainComment.id}
        setIsDeleted={setSuccess}
        loginUserId={loginUserId}
      />

      {childrenComments.map((childrenComment: ChildrenArr) => {
        return (
          <MainComment
            key={childrenComment.id}
            userId={childrenComment.user.id}
            nickname={childrenComment.user.nickname}
            createdAt={childrenComment.created_at}
            comment={childrenComment.comment}
            isPrivate={childrenComment.is_private}
            deletedAt={childrenComment.deleted_at}
            isChildren={true}
            setIsTextareaOpen={setIsTextareaOpen}
            isTextareaOpen={isTextareaOpen}
            commentId={childrenComment.id}
            setIsDeleted={setSuccess}
            loginUserId={loginUserId}
          />
        );
      })}
      {isTextareaOpen && (
        <CommentTextarea
          isNestedComment={true}
          parentId={mainComment.id}
          setSuccess={setSuccess}
        />
      )}
    </Fragment>
  );
};
