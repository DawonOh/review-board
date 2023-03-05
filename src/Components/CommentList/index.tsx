import React, { Fragment } from 'react';
import { MainComment } from 'Components/MainComment';
import { ChildrenArr } from 'Components/CommentContainer';

export const CommentList = ({ mainComment, childrenComments }: any) => {
  return (
    <Fragment>
      <MainComment
        nickname={mainComment.user.nickname}
        createdAt={mainComment.created_at}
        comment={mainComment.comment}
        isPrivate={mainComment.is_private}
        deletedAt={mainComment.deleted_at}
        isChildren={false}
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
          />
        );
      })}
    </Fragment>
  );
};
