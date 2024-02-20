import { ForwardedRef, Fragment, forwardRef, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReplyIconImg from '../../../../assets/images/reply.png';
import LockIconImg from '../../../../assets/images/lock.png';
import { useAppDispatch, useAppSelector } from 'hooks';
import { alertActions } from 'redux/slice/alert-slice';
import { useMutation } from '@tanstack/react-query';
import { deleteChannelComment } from 'util/user-http';
import { queryClient } from 'util/feedDetail-http';

interface UserCommentInfoType {
  userComments: {
    comment: string;
    created_at: string;
    deleted_at: null | string;
    feed: {
      id: number;
      user: {
        id: number;
      };
    };
    id: number;
    is_private: boolean;
    parent: { id: 65; user: { id: number } };
    updated_at: string;
    user: { id: number };
  };
}

const CommentItem = (
  { userComments }: UserCommentInfoType,
  ref: ForwardedRef<HTMLDivElement> | null
) => {
  const [content, setContent] = useState('');
  const [clickedId, setClickedId] = useState<number | null>(null);

  const params = useParams();
  let userId = params.id;

  const dispatch = useAppDispatch();
  const isClickOk = useAppSelector(state => state.alert.isClickOk);
  const loginUserId = useAppSelector(state => state.user.id);

  const deleteComment = (id: number) => {
    setClickedId(id);
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '삭제하시겠습니까?',
        isQuestion: true,
        alertPath: '',
      })
    );
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteChannelComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userCommentList'],
      });
    },
    onError: () => {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '잠시 후 다시 시도해주세요.',
          isQuestion: false,
          alertPath: '',
        })
      );
    },
  });

  useEffect(() => {
    if (isClickOk && clickedId !== null) {
      deleteMutate({ commentId: clickedId });
      dispatch(alertActions.setIsClickOk());
    }
  }, [isClickOk, clickedId, dispatch, deleteMutate]);

  useEffect(() => {
    if (userComments.deleted_at !== null) {
      setContent('삭제된 댓글입니다.');
      return;
    }
    if (
      userComments.is_private &&
      userId &&
      loginUserId !== parseInt(userId, 10)
    ) {
      setContent('비밀댓글입니다.');
      return;
    }
    setContent(userComments.comment);
  }, [userComments.deleted_at, userComments.is_private, userComments.comment]);

  return (
    <Fragment>
      <div
        className="flex w-full p-2 justify-between items-center cursor-pointer hover:duration-300 [&:not(:hover)]:translate-y-0.5 [&:not(:hover)]:duration-300 rounded-md shadow-md shadow-buttongray bg-white"
        ref={ref}
      >
        <Link to={'/feed/' + userComments.feed.id}>
          <div className="flex">
            <div className="flex items-center">
              <div className="p-4">
                <div className="flex items-center">
                  {userComments.parent && userComments.deleted_at === null && (
                    <img className="w-5 h-5" src={ReplyIconImg} alt="대댓글" />
                  )}
                  {userComments.is_private &&
                    userComments.deleted_at === null && (
                      <img
                        className="w-5 h-5"
                        src={LockIconImg}
                        alt="비밀댓글"
                      />
                    )}
                  <div className="line-clamp-2 whitespace-pre-wrap break-words leading-5 overflow-hidden whitespace-nowrap text-ellipsis">
                    {userComments.deleted_at !== null ? (
                      <div className="text-textgray">{content}</div>
                    ) : (
                      content
                    )}
                  </div>
                </div>
                <div className="text-sm text-textgray">
                  {userComments.created_at.slice(0, -8)}
                </div>
              </div>
            </div>
          </div>
        </Link>
        {loginUserId === Number(userId) && userComments.deleted_at === null && (
          <button
            className="min-w-16 px-4 bg-[#F8C7C7] border border-mainred text-mainred rounded-lg md:mt-0 mt-4"
            onClick={() => deleteComment(userComments.id)}
          >
            삭제
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default forwardRef(CommentItem);
