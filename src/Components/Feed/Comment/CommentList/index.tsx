import { useEffect, useState } from 'react';
import { MainComment } from 'Components/Feed/Comment/MainComment';
import { ChildrenArr } from 'Components/Feed/Comment/CommentContainer';
import { CommentTextarea } from 'Components/Feed/Comment/CommentTextarea';
import { useAppSelector } from 'hooks';

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
  const loginUserId = useAppSelector(state => state.user.id);
  useEffect(() => {
    setChildrenComments(mainComment.children);
  }, [mainComment]);
  return (
    <div className="flex flex-col items-end gap-4 mt-8">
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
            loginUserId={loginUserId}
          />
        );
      })}
      {isTextareaOpen && (
        <CommentTextarea isNestedComment={true} parentId={mainComment.id} />
      )}
    </div>
  );
};
