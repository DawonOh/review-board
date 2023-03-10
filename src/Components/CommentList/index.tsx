import React, { Fragment, useEffect, useState } from 'react';
import { MainComment } from 'Components/MainComment';
import { ChildrenArr } from 'Components/CommentContainer';
import { CommentTextarea } from 'Components/CommentTextarea';

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
}

export const CommentList = ({ mainComment }: PropsType) => {
  const [childrenComments, setChildrenComments] = useState<ChildrenArr[]>([]);
  const [isTextareaOpen, setIsTextareaOpen] = useState(false);
  useEffect(() => {
    setChildrenComments(mainComment.children);
  }, [mainComment]);
  return (
    <Fragment>
      <MainComment
        nickname={mainComment.user.nickname}
        createdAt={mainComment.created_at}
        comment={mainComment.comment}
        isPrivate={mainComment.is_private}
        deletedAt={mainComment.deleted_at}
        isChildren={false}
        setIsTextareaOpen={setIsTextareaOpen}
        isTextareaOpen={isTextareaOpen}
      />

      {childrenComments.map((childrenComment: ChildrenArr) => {
        return (
          <MainComment
            key={childrenComment.id}
            nickname={childrenComment.user.nickname}
            createdAt={childrenComment.created_at}
            comment={childrenComment.comment}
            isPrivate={childrenComment.is_private}
            deletedAt={childrenComment.deleted_at}
            isChildren={true}
            setIsTextareaOpen={setIsTextareaOpen}
            isTextareaOpen={isTextareaOpen}
          />
        );
      })}
      {isTextareaOpen && <CommentTextarea isNestedComment={true} />}
    </Fragment>
  );
};
