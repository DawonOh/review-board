import { AlertModal } from 'Components/AlertModal';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import UnlockImg from '../../assets/images/unlock.png';

const WriteReplyContainer = Styled.div<{
  isNestedComment: boolean;
  isModify?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: ${props => (props.isNestedComment ? '80%' : '90%')};
  margin: 1em auto;
  padding: 1em;
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  @media (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
`;

const TextArea = Styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  outline: none;
`;

const Buttons = Styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1em;
  @media (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
`;

const ApplyButton = Styled.button`
  ${ButtonLayout}
  padding: 0 0.4em;
  font-size: 0.9em;
  color: #fff;
  background-color: #FF5959;
  cursor: pointer;
`;

const LockDiv = Styled.div`
  display: flex;
  align-items: flex-end;
`;

const LockIcon = Styled.div<{ isPrivate: boolean }>`
  width: 1em;
  height: 1em;
  background: url(${props => (props.isPrivate ? LockImg : UnlockImg)});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

const Count = Styled.span<{ replyMainTextLength: number }>`
  font-size: 0.8em;
  color: ${props => props.replyMainTextLength === 1000 && '#FF5959'}
`;

const SmallFont = Styled.span`
  font-size: 0.8em;
`;
interface Props {
  isNestedComment: boolean;
  isModify?: boolean;
  setIsModify?: Function;
  content?: string;
  commentId?: number;
  parentId?: number;
  setSuccess?: Function;
}
interface MessageType {
  id: number;
  text: string;
}
export const CommentTextarea = ({
  isNestedComment,
  isModify,
  content,
  commentId,
  parentId,
  setSuccess,
  setIsModify,
}: Props) => {
  //비밀댓글 여부
  const [isPrivate, setIsPrivate] = useState(false);
  //textarea 내 내용
  const [mainCommentText, setMainCommentText] = useState('');
  //textarea 내 내용 길이
  const [replyMainTextLength, setReplyMainTextLength] = useState(0);
  //AlertModal open 여부
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  //AlertModal 버튼 - '취소/확인'으로 넣을 때 조건(default:'확인')
  const [isQuestion, setIsQuestion] = useState(false);
  //AlertModal 메세지 내용
  const [alertMessage, setAlertMessage] = useState<MessageType[]>([]);
  //AlertModal에서 취소(false)/확인(true)중 어떤걸 눌렀는 지 확인
  const [result, setResult] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const openAlertModal = () => {
    if (isAlertModalOpen) {
      return (
        <AlertModal
          isAlertModalOpen={isAlertModalOpen}
          setIsAlertModalOpen={setIsAlertModalOpen}
          contents={alertMessage}
          isQuestion={isQuestion}
          setResult={setResult}
        />
      );
    }
  };

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

  const token = localStorage.getItem('token');
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('accept', 'application/json');
  token && requestHeaders.set('Authorization', token);
  requestHeaders.set('Content-Type', 'application/json');
  const params = useParams();
  let feed = Number(params.id);
  const cruComment = () => {
    //댓글 작성
    if (!isModify && isNestedComment === false) {
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
          if (json.message.includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '댓글이 등록되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(true);
            if (textareaFocus.current !== null) {
              textareaFocus.current.value = '';
            }

            setReplyMainTextLength(0);
            return;
          }
          if (json.message.includes('empty')) {
            setAlertMessage([{ id: 1, text: '댓글을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.isNotEmpty) {
            setAlertMessage([{ id: 1, text: '댓글을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.includes('string')) {
            setAlertMessage([{ id: 1, text: '댓글 내용을 확인해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
        });
    }
    //답글 작성
    if (!isModify && isNestedComment) {
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
          if (json.message.includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '답글이 등록되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            return;
          }
          if (json.message.includes('empty')) {
            setAlertMessage([{ id: 1, text: '답글을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsModify && setIsModify(false);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.includes('string')) {
            setAlertMessage([{ id: 1, text: '답글 내용을 확인해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
        });
    }

    //댓글,답글 수정
    if (isModify) {
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
          if (json.message.includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '수정되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            return;
          }
          if (json.message.includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.includes('EXIST')) {
            setAlertMessage([{ id: 1, text: '존재하지 않는 댓글입니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
          if (json.message.includes('COMMENT_IS_NOT_CHANGED')) {
            setAlertMessage([{ id: 1, text: '수정할 내용을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }
        });
    }
  };

  useEffect(() => {
    result && setIsModify && setIsModify(false);
    result && setSuccess && setSuccess(true);
  }, [result]);

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
    <Fragment>
      <WriteReplyContainer
        isNestedComment={isNestedComment}
        isModify={isModify}
      >
        <TextArea
          placeholder={isNestedComment ? '답글 입력하기' : '댓글 입력하기'}
          onFocus={handleMainResizeHeight}
          onInput={handleMainResizeHeight}
          maxLength={1000}
          defaultValue={isModify ? content : ''}
          ref={textareaFocus}
        />
        <Buttons>
          <Count replyMainTextLength={replyMainTextLength}>
            {replyMainTextLength}/1000
          </Count>
          <LockDiv>
            <LockIcon isPrivate={isPrivate} onClick={handleClickPrivate} />
            <SmallFont>비밀댓글</SmallFont>
          </LockDiv>
          <ApplyButton onClick={cruComment}>
            {isModify ? '수정' : '등록'}
          </ApplyButton>
        </Buttons>
      </WriteReplyContainer>
      {openAlertModal()}
    </Fragment>
  );
};
