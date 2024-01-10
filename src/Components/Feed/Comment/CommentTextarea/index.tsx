import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  isNestedComment: boolean;
  isModify?: boolean;
  setIsModify?: Function;
  content?: string;
  commentId?: number;
  parentId?: number;
  setSuccess?: Function;
  modifyPrivate?: boolean;
}
export const CommentTextarea = ({
  isNestedComment,
  isModify,
  content,
  commentId,
  parentId,
  setSuccess,
  setIsModify,
  modifyPrivate,
}: Props) => {
  //비밀댓글 여부
  const [isPrivate, setIsPrivate] = useState(false);
  //textarea 내 내용
  const [mainCommentText, setMainCommentText] = useState('');
  //textarea 내 내용 길이
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);
  //수정되었는지 여부
  const [successModify, setSuccessModify] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

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
  }, [content]);

  const token = sessionStorage.getItem('token');
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('accept', 'application/json');
  token && requestHeaders.set('Authorization', token);
  requestHeaders.set('Content-Type', 'application/json');
  const params = useParams();
  let feed = Number(params.id);

  const notEmpty = () => {
    if (Boolean(mainCommentText.replace(/ /g, '') === '')) {
      setSuccess && setSuccess(false);
      if (textareaFocus.current !== null) {
        textareaFocus.current.value = '';
      }
      setMainCommentText('');
      setReplyMainTextLength(0);
    }
  };
  const cruComment = () => {
    //댓글 작성
    if (
      !isModify &&
      isNestedComment === false &&
      Boolean(mainCommentText.replace(/ /g, '') === '') === false
    ) {
      fetch(`${BACK_URL}:${BACK_PORT}/comments`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          feed: feed,
          comment: mainCommentText,
          is_private: isPrivate,
        }),
      })
        .then(res => res.json())
        .then(json => {
          if (String(json.message).includes('SUCCESSFULLY')) {
            setSuccess && setSuccess(true);
            if (textareaFocus.current !== null) {
              textareaFocus.current.value = '';
            }
            setMainCommentText('');

            setReplyMainTextLength(0);
            return;
          }
          if (String(json.message.isNotEmpty).includes('empty')) {
            setSuccess && setSuccess(false);
            return;
          }
          if (String(json.message).includes('INVALID_TOKEN')) {
            setSuccess && setSuccess(false);
            return;
          }
          if (String(json.message).includes('string')) {
            setSuccess && setSuccess(false);
            return;
          }
        });
    }
    //답글 작성
    if (
      !isModify &&
      isNestedComment &&
      Boolean(mainCommentText.replace(/ /g, '') === '') === false
    ) {
      fetch(`${BACK_URL}:${BACK_PORT}/comments`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          feed: feed,
          comment: mainCommentText,
          is_private: isPrivate,
          parent: parentId,
        }),
      })
        .then(res => res.json())
        .then(json => {
          if (String(json.message).includes('SUCCESSFULLY')) {
            return;
          }
          if (String(json.message.isNotEmpty).includes('empty')) {
            setSuccess && setSuccess(false);
            return;
          }
          if (String(json.message).includes('INVALID_TOKEN')) {
            setIsModify && setIsModify(false);
            setSuccess && setSuccess(false);
            return;
          }
          if (String(json.message).includes('string')) {
            setSuccess && setSuccess(false);
            return;
          }
        });
    }

    //댓글,답글 수정
    if (
      isModify &&
      Boolean(mainCommentText.replace(/ /g, '') === '') === false
    ) {
      fetch(`${BACK_URL}:${BACK_PORT}/comments`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({
          commentId: commentId,
          comment: mainCommentText,
          is_private: isPrivate,
        }),
      })
        .then(res => res.json())
        .then(json => {
          if (String(json.message).includes('SUCCESSFULLY')) {
            setSuccessModify(true);
            return;
          }
          if (String(json.message).includes('INVALID_TOKEN')) {
            setSuccess && setSuccess(false);
            setSuccessModify(false);
            return;
          }
          if (String(json.message).includes('EXIST')) {
            setSuccess && setSuccess(false);
            setSuccessModify(false);
            return;
          }
          if (String(json.message).includes('COMMENT_IS_NOT_CHANGED')) {
            setSuccess && setSuccess(false);
            setSuccessModify(false);
            return;
          }
        });
    }
  };

  // useEffect(() => {
  //   result && setIsModify && setIsModify(false);
  //   result && setSuccess && setSuccess(true);
  // }, [result]);

  useEffect(() => {
    modifyPrivate && setIsPrivate(modifyPrivate);
  }, [modifyPrivate]);

  useEffect(() => {
    successModify && setSuccess && setSuccess(true);
  }, [successModify]);

  const handleClickPrivate = () => {
    setIsPrivate(!isPrivate);
  };

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
        defaultValue={isModify ? content : ''}
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
