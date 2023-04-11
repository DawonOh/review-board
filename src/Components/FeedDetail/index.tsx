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

const MainImg = Styled.img`
  width: 70%;
`;
const Content = Styled.div`
  width: 70%;
  white-space: pre-wrap;
  line-height: 1.3em;
`;

const LikeContainer = Styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
const LikeIcon = Styled.div<{ isLike: boolean }>`
  min-width: 2em;
  min-height: 2em;
  background: url(${props => (props.isLike ? LikeIconImg : HeartIconImg)});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

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

interface LikeType {
  count: number;
  feedId: number;
  symbol: string;
  symbolId: number;
}

interface SymbolType {
  message: string;
  result: [{ count: number; feedId: number; symbol: string; symbolId: number }];
}

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

interface MessageType {
  id: number;
  text: string;
}

export const FeedDetail = ({ loginUserId }: loginUserIdType) => {
  const [isLike, setIsLike] = useState(false);
  const [detailContent, setDetailContent] = useState<DataType>();
  const [likeCount, setLikeCount] = useState(0);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [result, setResult] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
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

  const handleClickLike = () => {
    if (isLike === false) {
      axios
        .post<SymbolType>(
          `${BACK_URL}:${BACK_PORT}/symbols/${feedId}`,
          {
            symbolId: 1,
          },
          { headers: { Accept: `application/json`, Authorization: token } }
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
        });
      return;
    }
    if (isLike) {
      axios
        .delete<SymbolType>(`${BACK_URL}:${BACK_PORT}/symbols/${feedId}`, {
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          setIsLike(false);
          for (let i = 0; i < response.data.result.length; i++) {
            if (response.data.result[i].symbolId === 1) {
              setLikeCount(response.data.result[i].count);
            }
          }
        });
      return;
    }
  };

  const params = useParams();
  let feedId = params.id;

  useEffect(() => {
    axios
      .get<DataType>(`${BACK_URL}:${BACK_PORT}/feeds/${feedId}`)
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

    axios
      .get<LikeType[]>(`${BACK_URL}:${BACK_PORT}/symbols/${feedId}`)
      .then(response => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].symbolId === 1) {
            setLikeCount(response.data[i].count);
          }
        }
      });

    axios
      .get<LoginLikeType>(`${BACK_URL}:${BACK_PORT}/symbols/check/${feedId}`, {
        headers: { Accept: `application/json`, Authorization: token },
      })
      .then(response => {
        setIsLike(response.data.checkValue);
      });
  }, []);

  const deleteFeed = () => {
    setMessages([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };

  useEffect(() => {
    if (result) {
      axios
        .delete<string>(`${BACK_URL}:${BACK_PORT}/feeds/${feedId}`, {
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          setIsAlertModalOpen(false);
          window.location.href = '/';
        })
        .catch(() => {
          alert('잠시 후 다시 시도해주세요.');
        });
    }
  }, [result]);

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

        {detailContent?.result.uploadFiles.map((file, index) => {
          return (
            file.is_img && (
              <MainImg
                key={file.id}
                src={file.file_link}
                alt={index + 1 + '번 째 사진'}
              />
            )
          );
        })}
        <Content>{detailContent?.result.content}</Content>
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
            <BoldFont>by {detailContent?.result.user.nickname}</BoldFont>
          </Buttons>
        </BothSideContainer>
      </ContentContainer>
      {openAlertModal()}
    </Fragment>
  );
};
