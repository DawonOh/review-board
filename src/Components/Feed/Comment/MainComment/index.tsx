import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../../../assets/images/lock.png';
import { CommentTextarea } from 'Components/Feed/Comment/CommentTextarea';

const InfoDiv = Styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5em;
`;

const WriteDate = Styled.span`
  font-size: 0.8em;
  color: #D3D3D3;
`;

const Content = Styled.div`
  margin-top: 0.5em;
  line-height: 1.3em;
`;

const LockIcon = Styled.div`
  width: 1em;
  height: 1em;
  background: url(${LockImg});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

const Buttons = Styled.div`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

const ModifyDeleteButton = Styled.button<{ isDelete?: boolean }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: ${props => (props.isDelete ? '#C1C1C1' : '#CDDEFF')};
  cursor: pointer;
`;

const WriteCommentButton = Styled.button<{ writeNestedComment?: boolean }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: #FF5959;
  border: none;
  cursor: pointer;
`;
interface MainCommentProps {
  userId: number;
  nickname: string;
  createdAt: string;
  comment: string;
  isPrivate: boolean;
  deletedAt: string | null;
  isChildren: boolean;
  setIsTextareaOpen: Function;
  isTextareaOpen: boolean;
  commentId: number;
  setIsDeleted: Function;
  loginUserId: Number;
}

export const MainComment = ({
  userId,
  nickname,
  createdAt,
  comment,
  isPrivate,
  deletedAt,
  isChildren,
  setIsTextareaOpen,
  isTextareaOpen,
  commentId,
  setIsDeleted,
  loginUserId,
}: MainCommentProps) => {
  const [specificComment, setSpecificComment] = useState(comment);
  const [isModify, setIsModify] = useState(false);
  const createAtDate = createdAt.slice(0, -8);

  const token = localStorage.getItem('token');
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('accept', 'application/json');
  token && requestHeaders.set('Authorization', token);

  useEffect(() => {
    setSpecificComment(comment);
    if (deletedAt) {
      setSpecificComment('삭제된 댓글입니다.');
      return;
    }
    if (isPrivate) {
      comment === '## PRIVATE_COMMENT ##' &&
        setSpecificComment('비밀댓글입니다.');
      return;
    }
  }, [comment]);
  const writeNewNestedReply = () => {
    setIsTextareaOpen(!isTextareaOpen);
  };
  const modifyNestedReply = () => {
    setIsModify(!isModify);
  };
  // const openAlertModal = () => {
  //   if (isAlertModalOpen) {
  //     return (
  //       <AlertModal
  //         isAlertModalOpen={isAlertModalOpen}
  //         setIsAlertModalOpen={setIsAlertModalOpen}
  //         contents=""
  //         isQuestion={isQuestion}
  //         setResult={setResult}
  //       />
  //     );
  //   }
  // };

  // const deleteComment = () => {};
  // useEffect(() => {
  //   if (result) {
  //     fetch(`${BACK_URL}:${BACK_PORT}/comments/${commentId}`, {
  //       method: 'DELETE',
  //       headers: requestHeaders,
  //     })
  //       .then(res => res.json())
  //       .then(json => {
  //         if (json.message.includes('SUCCESSFULLY')) {
  //           setAlertMessage([{ id: 1, text: '삭제되었습니다.' }]);
  //           setIsQuestion(false);
  //           setIsAlertModalOpen(true);
  //           setIsDeleted(true);
  //           return;
  //         }
  //         if (json.message.includes('INVALID_TOKEN')) {
  //           setAlertMessage([{ id: 1, text: '로그인 후 이용해주세요.' }]);
  //           setIsQuestion(false);
  //           setIsAlertModalOpen(true);
  //           setIsDeleted(false);
  //           return;
  //         }
  //         if (json.message.includes('EXIST')) {
  //           setAlertMessage([{ id: 1, text: '존재하지 않는 댓글입니다.' }]);
  //           setIsQuestion(false);
  //           setIsAlertModalOpen(true);
  //           setIsDeleted(false);
  //           return;
  //         }
  //       });
  //     return;
  //   }
  // }, [result]);
  return (
    <div className="flex flex-col justify-end items-end w-full">
      <div className={`${isChildren ? 'w-95%' : 'w-full'} font-bold`}>
        {(loginUserId !== userId && isPrivate) || deletedAt ? '-' : nickname}
      </div>
      <div className="flex justify-between w-full">
        {isChildren && <div className="w-1 h-auto rounded-md bg-mainsky" />}
        <div
          className={`${
            isChildren ? 'w-95%' : 'w-full'
          } p-4 rounded-md bg-white`}
        >
          <div className="flex justify-between">
            <div className="flex gap-4">
              <span className="text-sm text-buttongray">{createAtDate}</span>
              {isPrivate && deletedAt === null && <LockIcon />}
              {!isChildren && (
                <button
                  className="text-sm hover:underline cursor-pointer"
                  onClick={writeNewNestedReply}
                >
                  {isTextareaOpen ? '취소' : '답글 달기'}
                </button>
              )}
            </div>
            {!deletedAt && (
              <div className="flex items-center gap-2">
                {userId === loginUserId && (
                  <>
                    <button
                      className="text-sm hover:text-mainblue cursor-pointer"
                      onClick={modifyNestedReply}
                    >
                      {isModify ? '취소' : '수정'}
                    </button>
                    <span className="text-sm">|</span>
                    <button className="text-sm hover:text-mainred cursor-pointer">
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isModify && !deletedAt ? (
            <CommentTextarea
              isNestedComment={false}
              isModify={true}
              commentId={commentId}
              content={specificComment}
              setIsModify={setIsModify}
              setSuccess={setIsDeleted}
              modifyPrivate={isPrivate}
            />
          ) : (
            <div className="mt-2">{specificComment}</div>
          )}
        </div>
      </div>
    </div>
  );
};
