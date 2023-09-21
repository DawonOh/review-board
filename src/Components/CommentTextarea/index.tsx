import { AlertModal } from 'Components/AlertModal';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';
import UnlockImg from '../../assets/images/unlock.png';

// isNestedComment : 댓글 입력창과 대댓글 입력창을 구분
// isModify : 댓글 작성과 수정을 구분
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

// isPrivate : 비밀댓글 여부
const LockIcon = Styled.div<{ isPrivate: boolean }>`
  width: 1em;
  height: 1em;
  background: url(${props => (props.isPrivate ? LockImg : UnlockImg)});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

// replyMainTextLength : 댓글 길이
const Count = Styled.span<{ replyMainTextLength: number }>`
  font-size: 0.8em;
  color: ${props => props.replyMainTextLength === 1000 && '#FF5959'}
`;

const SmallFont = Styled.span`
  font-size: 0.8em;
`;

// isNestedComment : 댓글과 대댓글을 구분
// isModify : 댓글 작성인지 수정인지 구분
// content : 댓글 내용
// commentId : 댓글 id
// parentId : 해당 대댓글이 달린 댓글 id
// setSuccess : 댓글 작성 완료 여부
// modifyPrivate : 댓글 수정 시 비밀댓글인지 여부
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
  modifyPrivate,
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
  //수정되었는지 여부
  const [successModify, setSuccessModify] = useState(false);
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

  // 댓글 입력창 focus를 위한 ref
  const textareaFocus = useRef<HTMLTextAreaElement>(null);

  // 댓글 입력창 focus 및 내용 끝에 커서를 두기 위한 코드
  useEffect(() => {
    // 대댓글 입력창 또는 수정일 경우
    if (isNestedComment || isModify) {
      // 입력창 내 내용 길이
      const end = textareaFocus.current?.innerHTML.length;

      // 내용이 있는 경우에 setSelectionRange를 사용하여 커서 위치 맨 끝으로 이동
      end && textareaFocus.current?.setSelectionRange(end + 1, end + 1);

      // 댓글 입력창 focus
      textareaFocus.current?.focus();

      // content가 있으면 길이 값 replyMainTextLength에 저장
      if (content) {
        setReplyMainTextLength(content.length);
      }
    }
  }, [content]);

  // 로그인 여부 확인을 위한 토큰
  const token = localStorage.getItem('token');

  // api 요청시 headers에 넣을 객체 생성
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('accept', 'application/json');
  token && requestHeaders.set('Authorization', token);
  requestHeaders.set('Content-Type', 'application/json');

  // url에 있는 게시물 id
  const params = useParams();
  let feed = Number(params.id);

  // 댓글 입력할 때 내용이 비어있는 상태로 등록하면 알림창을 띄우기 위한 함수
  const notEmpty = () => {
    if (Boolean(mainCommentText.replace(/ /g, '') === '')) {
      setAlertMessage([{ id: 1, text: '내용을 입력해주세요.' }]);
      setIsQuestion(false);
      setIsAlertModalOpen(true);
      setSuccess && setSuccess(false);

      // textareaFocus에 연결되어있는 요소가 있다면 -> 화면에 댓글 작성칸이 있으면
      // 내용 초기화
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
          // 댓글 등록 완료 알림창 띄우기
          if (String(json.message).includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '댓글이 등록되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(true);
            // 댓글 등록 후 댓글 입력창 초기화
            if (textareaFocus.current !== null) {
              textareaFocus.current.value = '';
            }
            setMainCommentText('');

            setReplyMainTextLength(0);
            return;
          }

          // 등록 시 내용이 없는 경우 알림창 띄우기
          if (String(json.message.isNotEmpty).includes('empty')) {
            setAlertMessage([{ id: 1, text: '댓글을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }

          // 등록 시 비로그인 상태일 경우 알림창 띄우기
          if (String(json.message).includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }

          // 댓글 내용이 올바르지 않은 경우 알림창 띄우기
          if (String(json.message).includes('string')) {
            setAlertMessage([{ id: 1, text: '댓글 내용을 확인해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
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
          // 대댓글 작성 완료 시 알림창 띄우기
          if (String(json.message).includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '답글이 등록되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            return;
          }

          // 대댓글 내용이 없는 경우 알림창 띄우기
          if (String(json.message.isNotEmpty).includes('empty')) {
            setAlertMessage([{ id: 1, text: '답글을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            return;
          }

          // 대댓글 등록 시 비로그인 상태일 경우 알림창 띄우기
          if (String(json.message).includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsModify && setIsModify(false);
            setSuccess && setSuccess(false);
            return;
          }

          // 대댓글 내용이 올바르지 않은 경우 알림창 띄우기
          if (String(json.message).includes('string')) {
            setAlertMessage([{ id: 1, text: '답글 내용을 확인해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
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
          // 댓글 수정 성공 시 알림창 띄우기
          if (String(json.message).includes('SUCCESSFULLY')) {
            setAlertMessage([{ id: 1, text: '수정되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccessModify(true);
            return;
          }

          // 댓글 수정 시 비로그인 상태인 경우 알림창 띄우기
          if (String(json.message).includes('INVALID_TOKEN')) {
            setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            setSuccessModify(false);
            return;
          }

          // 대댓글을 달 댓글이 없는 경우 알림창 띄우기
          if (String(json.message).includes('EXIST')) {
            setAlertMessage([{ id: 1, text: '존재하지 않는 댓글입니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            setSuccessModify(false);
            return;
          }

          // 대댓글 수정 시 내용이 바뀌지 않은 경우 알림창 띄우기
          if (String(json.message).includes('COMMENT_IS_NOT_CHANGED')) {
            setAlertMessage([{ id: 1, text: '수정할 내용을 입력해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setSuccess && setSuccess(false);
            setSuccessModify(false);
            return;
          }
        });
    }
  };

  // 알림창에서 확인 클릭 시 수정 여부 변경
  useEffect(() => {
    result && setIsModify && setIsModify(false);
    result && setSuccess && setSuccess(true);
  }, [result]);

  // 수정 시 비밀댓글인 경우에 setIsPrivate(true)로 변경
  useEffect(() => {
    modifyPrivate && setIsPrivate(modifyPrivate);
  }, [modifyPrivate]);

  // 수정 성공 시 setSuccess(true)로 변경(화면에 수정된 내용을 바로 렌더링하기 위함)
  useEffect(() => {
    successModify && setSuccess && setSuccess(true);
  }, [successModify]);

  // 비밀댓글 여부 클릭 핸들링 함수
  const handleClickPrivate = () => {
    setIsPrivate(!isPrivate);
  };

  // 댓글 입력창 내용에 따라 자동으로 높이가 조절되는 함수
  const handleMainResizeHeight = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // 내용에 상관없이 높이를 1px로 지정
    e.target.style.height = '1px';

    // 해당 요소 내용의 총 높이를 요소의 높이에 px로 저장
    e.target.style.height = e.target.scrollHeight + 'px';

    // 현재 요소의 내용을 currentTextareaText 변수에 저장
    const currentTextareaText = e.target.value;

    // 내용이 있다면 길이 저장 / 없으면 길이에 0 저장
    currentTextareaText
      ? setReplyMainTextLength(currentTextareaText.length)
      : setReplyMainTextLength(0);

    // 댓글 내용에 현재값 저장
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
          <ApplyButton
            onClick={() => {
              cruComment();
              notEmpty();
            }}
          >
            {isModify ? '수정' : '등록'}
          </ApplyButton>
        </Buttons>
      </WriteReplyContainer>
      {openAlertModal()}
    </Fragment>
  );
};
