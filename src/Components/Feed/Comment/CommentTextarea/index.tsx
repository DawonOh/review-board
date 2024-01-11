import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';
import { modifyComment, queryClient, sendComment } from 'util/feed-http';

interface Props {
  isNestedComment: boolean;
  isModify?: boolean;
  modifyReply?: () => void;
  content?: string;
  commentId?: number;
  parentId?: number;
  modifyPrivate?: boolean;
}
export const CommentTextarea = ({
  isNestedComment,
  isModify,
  modifyReply,
  content,
  commentId,
  parentId,
  modifyPrivate,
}: Props) => {
  //비밀댓글 여부
  const [isPrivate, setIsPrivate] = useState(false);
  //textarea 내 내용
  const [mainCommentText, setMainCommentText] = useState<string | undefined>(
    ''
  );
  //textarea 내 내용 길이
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);

  const dispatch = useAppDispatch();

  const textareaFocus = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isNestedComment || isModify) {
      const end = textareaFocus.current?.innerHTML.length;
      end && textareaFocus.current?.setSelectionRange(end + 1, end + 1);
      textareaFocus.current?.focus();
      if (content) {
        setReplyMainTextLength(content.length);
      }
    }
  }, [content, isModify, isNestedComment]);
  const params = useParams();
  let feedId = Number(params.id);

  // 알림창
  const newAlert = (content: string) => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: content,
        alertPath: '',
        isQuestion: false,
      })
    );
  };

  const notEmpty = () => {
    if (Boolean(mainCommentText?.replace(/ /g, '') === '')) {
      if (textareaFocus.current !== null) {
        textareaFocus.current.value = '';
      }
      setMainCommentText('');
      setReplyMainTextLength(0);
    }
  };

  const { mutate: sendMainCommentMutate } = useMutation({
    mutationFn: sendComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      setMainCommentText('');
      setReplyMainTextLength(0);
      newAlert('작성되었습니다.');
    },
  });

  const { mutate: sendChildrenCommentMutate } = useMutation({
    mutationFn: sendComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      newAlert('작성되었습니다.');
    },
  });

  const { mutate: modifyCommentMutate } = useMutation({
    mutationFn: modifyComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
      newAlert('수정되었습니다.');
      modifyReply && modifyReply();
    },
  });

  const cruComment = () => {
    //댓글 작성
    if (
      !isModify &&
      isNestedComment === false &&
      Boolean(mainCommentText?.replace(/ /g, '') === '') === false
    ) {
      sendMainCommentMutate({
        feed: feedId,
        mainCommentText,
        isPrivate,
        isChildren: false,
      });
    }
    //답글 작성
    if (
      !isModify &&
      isNestedComment &&
      Boolean(mainCommentText?.replace(/ /g, '') === '') === false
    ) {
      sendChildrenCommentMutate({
        feed: feedId,
        mainCommentText,
        isPrivate,
        parentId,
        isChildren: true,
      });
    }

    //댓글,답글 수정
    if (
      isModify &&
      Boolean(mainCommentText?.replace(/ /g, '') === '') === false
    ) {
      modifyCommentMutate({
        commentId,
        mainCommentText,
        isPrivate,
      });
    }
  };

  useEffect(() => {
    modifyPrivate && setIsPrivate(modifyPrivate);
  }, [modifyPrivate]);

  const handleClickPrivate = () => {
    setIsPrivate(!isPrivate);
  };

  useEffect(() => {
    if (isModify) {
      setMainCommentText(content);
    }
  }, [isModify, content]);

  const handleMainResizeHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.target.style.height = '1px';
    e.target.style.height = e.target.scrollHeight + 'px';
    const currentTextareaText = e.target.value;
    currentTextareaText
      ? setReplyMainTextLength(currentTextareaText.length)
      : setReplyMainTextLength(0);
    setMainCommentText(e.target.value);
  };

  return (
    <div
      className={`flex md:justify-between justify-center items-center md:items-start flex-col gap-4 p-4 ${
        isNestedComment ? 'w-95%' : 'w-full'
      } my-auto bg-white rounded-md`}
    >
      <textarea
        className="w-full border-none resize-none outline-none"
        placeholder={isNestedComment ? '답글 입력하기' : '댓글 입력하기'}
        onFocus={handleMainResizeHeight}
        onInput={handleMainResizeHeight}
        maxLength={1000}
        value={mainCommentText}
        ref={textareaFocus}
      />
      <div className="flex md:items-end items-start md:justify-start justify-center gap-4">
        <span
          className={`text-sm ${
            replyMainTextLength === 1000 && 'text-mainred'
          }`}
        >
          {replyMainTextLength}/1000
        </span>
        <div
          className="flexCenterAlign cursor-pointer"
          onClick={handleClickPrivate}
        >
          <div
            className={`w-4 h-4 ${
              isPrivate
                ? "bg-[url('./assets/images/lock.png')]"
                : "bg-[url('./assets/images/unlock.png')]"
            } bg-no-repeat bg-cover`}
          />
          <span className="text-sm">비밀댓글</span>
        </div>
        <button
          className="text-sm hover:text-mainblue"
          onClick={() => {
            cruComment();
            notEmpty();
          }}
        >
          {isModify ? '수정' : '등록'}
        </button>
      </div>
    </div>
  );
};
