import React, {
  ForwardedRef,
  Fragment,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import Styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import ReplyIconImg from '../../assets/images/reply.png';
import LockIconImg from '../../assets/images/lock.png';
import { ButtonLayout, flexCenterAlign } from 'Styles/CommonStyle';
import { AlertModal } from 'Components/AlertModal';

const CommentContainer = Styled.div<{
  ref?: ForwardedRef<HTMLDivElement> | null;
}>`
  display: flex;
  width: 100%;
  padding: 0.3em;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px 1px #f3f3f3;
    transition-duration: 300ms;
  }
  &:not(:hover) {
    transition-duration: 300ms;
  }
`;

const ItemInfo = Styled.div`
  padding: 1em;
`;

const Index = Styled.div`
  ${flexCenterAlign}
  min-width: 3em;
  height: 100%;
  min-height: 4em;
  font-weight: 700;
`;

const ItemContent = Styled.div`
  display: -webkit-box;
  margin-bottom: 0.8em;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient:vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDates = Styled.div`
  font-size: 0.8em;
  color: #BDBDBD;
`;

const DeleteButton = Styled.button`
  ${ButtonLayout}
  min-width: 3em;
  min-height: 2em;
  color: #fff;
  font-size: 0.8em;
  background-color: #FF5959;
  cursor: pointer;
`;

const IndexAndContent = Styled.div`
  display: flex;
`;

const Icon = Styled.img`
  width: 1.3em;
  margin: 0 0.1em 0.8em 0;
`;

const Flex = Styled.div`
  display: flex;
  align-items: center;
`;

const DeletedCommentFont = Styled.div`
  color: #bdbdbd;
`;

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
  index: number;
  loginUserId: number | undefined;
}

interface MessageType {
  id: number;
  text: string;
}

const MyComments = (
  { userComments, index, loginUserId }: UserCommentInfoType,
  ref: ForwardedRef<HTMLDivElement> | null
) => {
  //AlertModal open 여부
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  //AlertModal 버튼 - '취소/확인'으로 넣을 때 조건(default:'확인')
  const [isQuestion, setIsQuestion] = useState(false);
  //AlertModal 메세지 내용
  const [alertMessage, setAlertMessage] = useState<MessageType[]>([]);
  //AlertModal에서 취소(false)/확인(true)중 어떤걸 눌렀는 지 확인
  const [result, setResult] = useState(false);
  const [content, setContent] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const token = localStorage.getItem('token');

  const params = useParams();
  let userId = params.id;

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

  const deleteComment = () => {
    setAlertMessage([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };
  useEffect(() => {
    if (result) {
      axios
        .delete(`${BACK_URL}:${BACK_PORT}/comments/${userComments.id}`, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          if (response.status === 200) {
            setAlertMessage([{ id: 1, text: '삭제되었습니다.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsDeleted(true);
            return;
          }
          if (response.status !== 200) {
            setAlertMessage([{ id: 1, text: '잠시 후 다시 시도해주세요.' }]);
            setIsQuestion(false);
            setIsAlertModalOpen(true);
            setIsDeleted(false);
            return;
          }
        })
        .catch(() => {
          alert('오류가 발생했습니다.');
        });
    }
  }, [result]);

  useEffect(() => {
    if (userComments.deleted_at !== null || isDeleted) {
      setContent('삭제된 댓글입니다.');
      return;
    }
    if (userComments.is_private) {
      setContent('비밀댓글입니다.');
      return;
    }
    setContent(userComments.comment);
  }, [isDeleted]);

  return (
    <Fragment>
      <CommentContainer ref={ref}>
        <Link to={'/feed/' + userComments.feed.id}>
          <IndexAndContent>
            <Index>{index + 1}</Index>
            <Flex>
              <ItemInfo>
                <Flex>
                  {userComments.parent &&
                    userComments.deleted_at === null &&
                    !isDeleted && <Icon src={ReplyIconImg} alt="대댓글" />}
                  {userComments.is_private &&
                    userComments.deleted_at === null &&
                    !isDeleted && <Icon src={LockIconImg} alt="비밀댓글" />}
                  <ItemContent>
                    {userComments.deleted_at !== null || isDeleted ? (
                      <DeletedCommentFont>{content}</DeletedCommentFont>
                    ) : (
                      content
                    )}
                  </ItemContent>
                </Flex>
                <ItemDates>{userComments.created_at.slice(0, -8)}</ItemDates>
              </ItemInfo>
            </Flex>
          </IndexAndContent>
        </Link>
        {loginUserId === Number(userId) &&
          userComments.deleted_at === null &&
          !isDeleted && (
            <DeleteButton onClick={deleteComment}>삭제</DeleteButton>
          )}
      </CommentContainer>
      {/* {openAlertModal()} */}
    </Fragment>
  );
};

export default forwardRef(MyComments);
