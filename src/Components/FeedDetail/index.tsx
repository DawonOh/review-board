import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Styled from 'styled-components';
import DoubleLikeImg from '../../assets/images/double-like.png';
import HeartIconImg from '../../assets/images/heart.png';
import LikeIconImg from '../../assets/images/like.png';
import DisLikeImg from '../../assets/images/dislike.png';
import ThumbsUpImg from '../../assets/images/thumbsUp.png';
import ViewIconImg from '../../assets/images/view.png';
import DownloadIconImg from '../../assets/images/download.png';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';
import { useParams } from 'react-router-dom';
import { AlertModal } from '../AlertModal';
import { Link } from 'react-router-dom';

const TitleContainer = Styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  margin: 0 auto;
  padding: 0.3em;
  gap: 1em;
  border-bottom: 2px solid #f1f1f1;
`;

// type === 1 : 매우좋아요 / 2 : 좋아요 / 3 : 별로예요
const LikeByWriter = Styled.div<{ type: number | undefined }>`
  width: 1.5em;
  height: 1.5em;
  min-width: 1.5em;
  min-height: 1.5em;
  background: url(${props =>
    props.type === 1
      ? DoubleLikeImg
      : props.type === 2
      ? ThumbsUpImg
      : DisLikeImg});
  background-repeat: no-repeat;
	background-size: cover;
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
`;

const ContentContainer = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
  margin-top: 1em;
  gap: 1em;
`;

const BothSideContainer = Styled.div`
  display: flex;
  width: 70%;
  justify-content: space-between;
  align-items: center;
  margin-top: 2em;
  @media (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
`;

const MainImgA = Styled.a`
  ${flexCenterAlign}
  width: 50%;
  @media (max-width: 767px) {
    width: 70%;
  }
`;
const MainImg = Styled.img`
  width: 100%;
`;

const Content = Styled.div`
  width: 70%;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.3em;
`;

const LikeContainer = Styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

// isLike : 좋아요 눌렀는지 여부
const LikeIcon = Styled.div<{ isLike: boolean }>`
  min-width: 2em;
  min-height: 2em;
  background: url(${props => (props.isLike ? LikeIconImg : HeartIconImg)});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

// isDownload : 아이콘 컴포넌트 - 다운로드 아이콘인지 조회수 아이콘인지 구분
const ViewIcon = Styled.div<{ isDownload?: boolean }>`
  min-width: 1em;
  min-height: 1em;
  margin-right: 0.3em;
  background: url(${props =>
    props.isDownload ? DownloadIconImg : ViewIconImg});
  background-repeat: no-repeat;
  background-size: cover;
`;

const BoldFont = Styled.span`
  font-weight: 700;
`;

const Dates = Styled.div`
  font-size: 0.8em;
`;
const Buttons = Styled.div`
  ${flexCenterAlign}
  gap: 0.5em;

`;

// text가 '수정'인 경우 배경색 파란색으로 변경 / 다른 경우에는 빨강(삭제 버튼)
const ModifyDeleteButton = Styled.button<{ text: string }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: ${props => (props.text === '수정' ? '#676FA3' : '#FF5959')};
  cursor: pointer;
`;

const ViewCntContainer = Styled.div`
  ${flexCenterAlign}
  margin-right: 0.5em;
`;

const FileTitleDiv = Styled.div`
  width: 70%;
  margin-top: 3em;
  padding: 1em;
  font-weight: 700;
  font-size: 1.1em;
  color: #676FA3;
  border-bottom: 1px solid #dbdbdb;
`;
const FileLink = Styled.a`
  display: flex;
  justify-content: space-between;
  gap: 1em;
  width: 70%;
  padding: 1em;
  cursor: pointer;
`;

const SmallFont = Styled.span`
  color: #BDBDBD;
  font-size: 0.8em;
  margin-left: 1em;
`;

// result : 백에서 받아온 데이터를 props로 전달
interface DataType {
  result: {
    category: { id: number; category: string };
    content: string;
    created_at: string;
    estimation: { estimation: string; id: number };
    id: number;
    posted_at: string;
    status: {
      id: number;
      is_status: string;
    };
    title: string;
    updated_at: string;
    uploadFiles: [
      {
        id: number;
        is_img: boolean;
        file_link: string;
        file_name: string;
        file_size: string;
      }
    ];
    length: number;
    user: {
      id: number;
      nickname: string;
    };
    viewCnt: number;
  };
}

// 좋아요 관련 타입
// count : 좋아요 수
// feedId : 해당 좋아요가 속한 게시물 id
// symbol, symbolId : 백에서 여러 종류의 좋아요 타입 제공 - 먼저 좋아요 하나만 구현
interface LikeType {
  count: number;
  feedId: number;
  symbol: string;
  symbolId: number;
}

// 게시글별 심볼 총 개수 조회 api에서 받아오는 데이터 타입
interface SymbolType {
  message: string;
  result: [{ count: number; feedId: number; symbol: string; symbolId: number }];
}

// 로그인 사용자의 좋아요 여부 조회 api에서 받아오는 데이터 타입
// checkValue : 좋아요 여부
interface LoginLikeType {
  checkValue: boolean;
  result: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user: number;
    feed: number;
    symbol: number;
  };
}

interface loginUserIdType {
  loginUserId: number;
}

// 알림창에 들어가는 내용 타입
interface MessageType {
  id: number;
  text: string;
}

export const FeedDetail = ({ loginUserId }: loginUserIdType) => {
  // 좋아요 눌렀는지 여부
  const [isLike, setIsLike] = useState(false);

  // 상세페이지 내용
  const [detailContent, setDetailContent] = useState<DataType>();

  // 좋아요 수
  const [likeCount, setLikeCount] = useState(0);

  // 알림창 모달을 위한 state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  // 첨부파일 있는지 여부
  const [haveFile, setHaveFile] = useState(false);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const openAlertModal = () => {
    if (isAlertModalOpen) {
      return (
        <AlertModal
          isAlertModalOpen={isAlertModalOpen}
          setIsAlertModalOpen={setIsAlertModalOpen}
          contents={messages}
          isQuestion={isQuestion}
          setResult={setResult}
        />
      );
    }
  };

  let token = localStorage.getItem('token');

  // 좋아요 버튼에 onclick으로 지정하는 함수
  const handleClickLike = () => {
    // 좋아요X + 로그인 한 상태 + 본인 게시물이 아닌 경우
    if (
      isLike === false &&
      token &&
      loginUserId !== detailContent?.result.user.id
    ) {
      // 리뷰를 보는 사용자가 각 게시글에 대해 좋아요를 추가 및 수정
      axios
        .post<SymbolType>(
          `${BACK_URL}:${BACK_PORT}/symbols/${feedId}`,
          {
            symbolId: 1,
          },
          {
            timeout: 5000,
            headers: { Accept: `application/json`, Authorization: token },
          }
        )
        .then(response => {
          setIsLike(true);
          for (let i = 0; i < response.data.result.length; i++) {
            for (let i = 0; i < response.data.result.length; i++) {
              if (response.data.result[i].symbolId === 1) {
                setLikeCount(response.data.result[i].count);
              }
            }
          }
        })
        .catch(error => {
          if (error.code === 'ECONNABORTED') {
            alert('잠시 후 다시 시도해주세요.');
          }
        });
      return;
    }
    // 좋아요를 누른 상태라면 좋아요 취소
    if (isLike) {
      axios
        .delete<SymbolType>(`${BACK_URL}:${BACK_PORT}/symbols/${feedId}`, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          setIsLike(false);
          for (let i = 0; i < response.data.result.length; i++) {
            if (response.data.result[i].symbolId === 1) {
              setLikeCount(response.data.result[i].count);
            }
          }
        })
        .catch(error => {
          if (error.code === 'ECONNABORTED') {
            alert('잠시 후 다시 시도해주세요.');
          }
        });
      return;
    }
  };

  // 해당 게시물 id url에서 조회
  const params = useParams();
  let feedId = params.id;

  useEffect(() => {
    // 해당 게시물 상세 정보 조회
    axios
      .get<DataType>(`${BACK_URL}:${BACK_PORT}/feeds/${feedId}`, {
        timeout: 5000,
      })
      .then(response => {
        setDetailContent(response.data);
        response.data.result.uploadFiles.forEach(file => {
          if (file.is_img === false) {
            setHaveFile(true);
            return;
          }
        });
      })
      .catch(() => {
        alert('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      });

    // 해당 게시글 좋아요 총 개수 조회
    axios
      .get<LikeType[]>(`${BACK_URL}:${BACK_PORT}/symbols/${feedId}`, {
        timeout: 5000,
      })
      .then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].symbolId === 1) {
            setLikeCount(response.data[i].count);
          }
        }
      })
      .catch(error => {
        alert('잠시 후 다시 시도해주세요.');
      });

    // 로그인 한 상태라면 해당 게시물에 좋아요를 눌렀는지 여부 조회
    if (token) {
      axios
        .get<LoginLikeType>(
          `${BACK_URL}:${BACK_PORT}/symbols/check/${feedId}`,
          {
            timeout: 5000,
            headers: { Accept: `application/json`, Authorization: token },
          }
        )
        .then(response => {
          setIsLike(response.data.checkValue);
        })
        .catch(error => {
          if (error.code === 'ECONNABORTED') {
            alert('잠시 후 다시 시도해주세요.');
          }
        });
    }
  }, []);

  // 게시물 삭제 알림창
  const deleteFeed = () => {
    setMessages([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };

  // deleteFeed로 띄운 알림창에서 확인 버튼 클릭 시 게시물 삭제
  useEffect(() => {
    if (result) {
      axios
        .delete<string>(`${BACK_URL}:${BACK_PORT}/feeds/${feedId}`, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          setIsAlertModalOpen(false);
          window.location.href = '/';
        })
        .catch(error => {
          if (error.code === 'ECONNABORTED') {
            alert('잠시 후 다시 시도해주세요.');
          }
        });
    }
  }, [result]);

  // 작성일, 수정일 yyyy-MM-dd 형태로 표시
  const createDate = detailContent?.result.created_at.slice(0, -8);
  const updateDate = detailContent?.result.updated_at.slice(0, -8);
  return (
    <Fragment>
      <TitleContainer>
        <LikeByWriter type={detailContent?.result.estimation.id} />
        <Title>{detailContent?.result.title}</Title>
      </TitleContainer>
      <ContentContainer>
        <BothSideContainer>
          <div>
            <Dates>{createDate} 작성</Dates>
            <Dates>{updateDate} 편집</Dates>
          </div>
          {/* 로그인 한 유저가 작성자인 경우 수정/삭제 버튼 표시 */}
          {detailContent?.result.user.id === loginUserId && (
            <Buttons>
              <Link
                to="/writeFeed"
                state={{ feedId: feedId, isModify: true, isTemp: false }}
              >
                <ModifyDeleteButton text="수정">수정</ModifyDeleteButton>
              </Link>

              <ModifyDeleteButton text="삭제" onClick={deleteFeed}>
                삭제
              </ModifyDeleteButton>
            </Buttons>
          )}
        </BothSideContainer>

        {/* 사진 */}
        {detailContent?.result.uploadFiles.map((file, index) => {
          return (
            file.is_img && (
              <MainImgA
                href={file.file_link}
                target="_blank"
                rel="noreferrer"
                key={file.id}
              >
                <MainImg src={file.file_link} alt={index + 1 + '번 째 사진'} />
              </MainImgA>
            )
          );
        })}

        {/* 게시글 내용 */}
        <Content>{detailContent?.result.content}</Content>

        {/* 첨부파일 */}
        {haveFile && <FileTitleDiv>첨부파일</FileTitleDiv>}
        {detailContent?.result.uploadFiles.map((file, index) => {
          return (
            file.is_img === false && (
              <FileLink href={file.file_link} key={file.id} download>
                <div>
                  <span>{file.file_name}</span>
                  <SmallFont>{file.file_size}</SmallFont>
                </div>

                <ViewIcon isDownload={true} />
              </FileLink>
            )
          );
        })}
        {/* 좋아요 ,조회수, 작성자 명 */}
        <BothSideContainer>
          <LikeContainer>
            <LikeIcon isLike={isLike} onClick={handleClickLike} />
            <span>{likeCount}</span>
          </LikeContainer>
          <Buttons>
            <ViewCntContainer>
              <ViewIcon />
              <span>{detailContent?.result.viewCnt}</span>
            </ViewCntContainer>
            <Link to={`/channel/${detailContent?.result.user.id}`}>
              <BoldFont>by {detailContent?.result.user.nickname}</BoldFont>
            </Link>
          </Buttons>
        </BothSideContainer>
      </ContentContainer>
      {openAlertModal()}
    </Fragment>
  );
};
