import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  let token = sessionStorage.getItem('token');

  const handleClickLike = () => {
    if (
      isLike === false &&
      token &&
      loginUserId !== detailContent?.result.user.id
    ) {
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

  const params = useParams();
  let feedId = params.id;

  useEffect(() => {
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

  const deleteFeed = () => {
    setMessages([{ id: 1, text: '삭제하시겠습니까?' }]);
    setIsQuestion(true);
    setIsAlertModalOpen(true);
  };

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

  const createDate = detailContent?.result.created_at.slice(0, -8);
  const updateDate = detailContent?.result.updated_at.slice(0, -8);
  const estimateIcon = () => {
    let id = detailContent?.result.estimation.id;
    if (id === 1) {
      return "bg-[url('./assets/images/double-like.png')]";
    }

    if (id === 2) {
      return "bg-[url('./assets/images/thumbsUp.png')]";
    }

    if (id === 3) {
      return "bg-[url('./assets/images/dislike.png')]";
    }
  };

  return (
    <div className="w-full p-8">
      <div className="w-4/5 my-0 mx-auto p-4 bg-white rounded-md">
        <div className="flex items-center gap-4 mb-4">
          {/* 카테고리 */}
          <div className="inline-block px-4 bg-bg-gray rounded-md">
            {detailContent?.result.category.category}
          </div>
          {/* 조회수 */}
          <div className="flexCenterAlign mr-2">
            <div className="w-4 h-4 min-w-4 min-h-4 mr-1 bg-[url('./assets/images/view.png')] bg-no-repeat bg-cover" />
            <span>{detailContent?.result.viewCnt}</span>
          </div>
        </div>
        {/* 제목 */}
        <div className="flex gap-4">
          <div
            className={`w-6 h-6 min-w-6 min-h-6 ${estimateIcon()} bg-no-repeat bg-cover`}
          />
          <h1 className="text-xl font-bold">{detailContent?.result.title}</h1>
        </div>
        <div className="flex justify-center items-center flex-col w-full mt-4 gap-4">
          <div className="flex justify-between items-center w-full md:mt-8">
            <div className="flex justify-between items-center w-full">
              {/* 작성일 | 편집일 */}
              <div className="text-sm text-buttongray">
                {createDate} 작성 | {updateDate} 편집
              </div>
              <div className="flex align-center gap-8">
                {/* 작성자 이름 */}
                <Link to={`/channel/${detailContent?.result.user.id}`}>
                  <span className="font-bold">
                    {detailContent?.result.user.nickname}
                  </span>
                </Link>
                {/* 수정 | 삭제 버튼 */}
                {detailContent?.result.user.id === loginUserId && (
                  <div className="flexCenterAlign gap-2">
                    <Link
                      to="/writeFeed"
                      state={{ feedId: feedId, isModify: true, isTemp: false }}
                    >
                      <button className="buttonLayout text-sm">수정</button>
                    </Link>
                    |
                    <button
                      className="buttonLayout text-sm"
                      onClick={deleteFeed}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 이미지 */}
          {detailContent?.result.uploadFiles.map((file, index) => {
            return (
              file.is_img && (
                <a
                  className="w-full"
                  href={file.file_link}
                  target="_blank"
                  rel="noreferrer"
                  key={file.id}
                >
                  <img
                    className="w-full"
                    src={file.file_link}
                    alt={index + 1 + '번 째 사진'}
                  />
                </a>
              )
            );
          })}
          {/* 내용 */}
          <div className="w-full whitespace-pre-wrap break-words leading-5 pt-4 border-t">
            {detailContent?.result.content}
          </div>
          {/* 첨부파일 */}
          {haveFile && (
            <div className="w-full mt-12 font-bold text-lg">첨부파일</div>
          )}
          {detailContent?.result.uploadFiles.map((file, index) => {
            return (
              file.is_img === false && (
                <a
                  className="flex justify-between gap-4 w-full p-4 cursor-pointer"
                  href={file.file_link}
                  key={file.id}
                  download
                >
                  <div>
                    <span>{file.file_name}</span>
                    <span className="text-buttongray text-sm ml-4">
                      {file.file_size}
                    </span>
                  </div>

                  <div className="w-4 h-4 min-w-4 min-h-4 mr-1 bg-[url('./assets/images/download.png')] bg-no-repeat bg-cover" />
                </a>
              )
            );
          })}
          {/* 좋아요 */}
          <div
            className="flex justify-end items-center w-full gap-2 cursor-pointer"
            onClick={handleClickLike}
          >
            <div
              className={`w-6 h-6 min-w-6 min-h-6 ${
                isLike
                  ? "bg-[url('./assets/images/likeCountClick.png')]"
                  : "bg-[url('./assets/images/likeCount.png')]"
              } bg-no-repeat bg-cover`}
            />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
