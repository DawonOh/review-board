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

// CommentContainer에 ref속성을 사용하기 위해 ForwardedRef 사용
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

// 댓글 정보 타입
// userComments : 사용자가 작성한 댓글 정보
// index : 인덱스
// loginUserId : 로그인한 유저 id
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
    // 부모 댓글(대댓글인 경우 존재)
    parent: { id: 65; user: { id: number } };
    updated_at: string;
    user: { id: number };
  };
  index: number;
  loginUserId: number | undefined;
}

// 알림창 모달에 들어가는 내용 타입
interface MessageType {
  id: number;
  text: string;
}

// 내 채널에서 MyComments 컴포넌트에 ref 속성을 사용하기 위해 ForwardedRef 사용
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

  // 댓글 내용
  const [content, setContent] = useState('');

  // 삭제 여부
  const [isDeleted, setIsDeleted] = useState(false);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  // 로그인 확인을 위한 토큰
  const token = localStorage.getItem('token');

  // url에서 userId 조회
  const params = useParams();
  let userId = params.id;

  // 알림창 모달
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

  // 댓글 삭제 알림창 띄우기
  const deleteComment = () => {
    setAlertMessage([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };

  // 댓글 삭제 알림창에서 확인을 누른 경우 댓글 삭제
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

  // 삭제,비밀댓글 내용 변경
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
                  {/* 부모 댓글이 있고 삭제되지 않은 경우 대댓글 아이콘 추가 */}
                  {userComments.parent &&
                    userComments.deleted_at === null &&
                    !isDeleted && <Icon src={ReplyIconImg} alt="대댓글" />}
                  {/* is_private가 true이고 삭제되지 않은 경우 비밀댓글 아이콘 추가 */}
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
        {/* 로그인 유저 본인 페이지인 경우에 삭제 버튼 표시 */}
        {loginUserId === Number(userId) &&
          userComments.deleted_at === null &&
          !isDeleted && (
            <DeleteButton onClick={deleteComment}>삭제</DeleteButton>
          )}
      </CommentContainer>
      {openAlertModal()}
    </Fragment>
  );
};

export default forwardRef(MyComments);
