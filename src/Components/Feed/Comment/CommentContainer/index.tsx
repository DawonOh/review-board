import { Fragment } from 'react';
import { CommentList } from 'Components/Feed/Comment/CommentList';
import { CommentTextarea } from 'Components/Feed/Comment/CommentTextarea';

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

export const CommentContainer = ({
  mainCommentList,
}: {
  mainCommentList: CommentJsonType[];
}) => {
  return (
    <div className="w-full p-8">
      <div className="xl:w-1/2 w-4/5 my-0 mx-auto pb-8">
        <h2 className="mt-4 text-xl font-bold mb-4">댓글</h2>
        <CommentTextarea isNestedComment={false} />
        {mainCommentList &&
          mainCommentList.map((mainComment: CommentJsonType) => {
            return (
              <Fragment key={mainComment.id}>
                <CommentList mainComment={mainComment} />
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};
