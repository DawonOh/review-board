import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks';
import { alertActions } from 'redux/slice/alert-slice';
import instance from 'api';
import { DataType, queryClient, sendLike } from 'util/feed-http';
import { AlertModal } from 'Components/Modal/AlertModal';
import { useMutation } from '@tanstack/react-query';

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

export const FeedDetail = ({
  feedDetailData,
}: {
  feedDetailData: DataType['result'] | undefined;
}) => {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [haveFile, setHaveFile] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  let isLogin = useAppSelector(state => state.login.isLogin);
  let loginUserId = useAppSelector(state => state.user.id);
  const params = useParams();
  let feedId = params.id;

  feedDetailData?.uploadFiles.forEach(file => {
    if (file.is_img === false) {
      setHaveFile(true);
      return;
    }
  });

  const dispatch = useAppDispatch();

  const { mutate } = useMutation({
    mutationFn: sendLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feed', { feedId }],
        refetchType: 'none',
      });
      setIsLike(true);
    },
  });

  const handleClickLike = async () => {
    if (isLogin === null || isLogin === false) {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '로그인 후 이용해주세요.',
          isQuestion: false,
          alertPath: '/login',
        })
      );
      return;
    }
    if (
      isLike === false &&
      isLogin &&
      loginUserId !== feedDetailData?.user.id
    ) {
      mutate({ feedId });
      return;
    }
    if (isLike) {
      instance
        .delete<SymbolType>(`/symbols/${feedId}`)
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

  // 좋아요 요청 에러 발생 시
  // if (isError) {
  // dispatch(
  //   alertActions.setModal({
  //     isModalOpen: true,
  //     contents: '잠시 후 다시 시도해주세요.',
  //     isQuestion: false,
  //     alertPath: '',
  //   })
  // );
  // }

  // 좋아요 수
  useEffect(() => {
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

    if (isLogin) {
      instance
        .get<LoginLikeType>(`/symbols/check/${feedId}`)
        .then(response => {
          setIsLike(response.data.checkValue);
        })
        .catch(error => {
          if (error.code === 'ECONNABORTED') {
            alert('잠시 후 다시 시도해주세요.');
          }
        });
    }
  }, [BACK_PORT, BACK_URL, isLogin, feedId]);

  // 게시물 삭제
  const deleteFeed = () => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '삭제하시겠습니까?',
        isQuestion: true,
        alertPath: '',
      })
    );
  };

  // useEffect(() => {
  //   if (result) {
  //     axios
  //       .delete<string>(`${BACK_URL}:${BACK_PORT}/feeds/${feedId}`, {
  //         timeout: 5000,
  //         headers: { Accept: `application/json`, Authorization: token },
  //       })
  //       .then(response => {
  //         setIsAlertModalOpen(false);
  //         window.location.href = '/';
  //       })
  //       .catch(error => {
  //         if (error.code === 'ECONNABORTED') {
  //           alert('잠시 후 다시 시도해주세요.');
  //         }
  //       });
  //   }
  // }, [result]);

  let createDate = feedDetailData?.created_at.slice(0, -8);
  let updateDate = feedDetailData?.updated_at.slice(0, -8);

  const estimateIcon = () => {
    let id = feedDetailData?.estimation.id;
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
      <div className="w-4/5 my-0 mx-auto bg-white rounded-md md:px-20 px-8 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="inline-block px-4 bg-bg-gray rounded-md">
            {feedDetailData?.category.category}
          </div>
          <div className="flexCenterAlign mr-2">
            <div className="w-4 h-4 min-w-4 min-h-4 mr-1 bg-[url('./assets/images/view.png')] bg-no-repeat bg-cover" />
            <span>{feedDetailData?.viewCnt}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div
            className={`w-6 h-6 min-w-6 min-h-6 ${estimateIcon()} bg-no-repeat bg-cover`}
          />
          <h1 className="text-xl font-bold">{feedDetailData?.title}</h1>
        </div>
        <div className="flex justify-center items-center flex-col w-full mt-4 gap-4">
          <div className="flex justify-between items-center w-full md:mt-8">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-buttongray">
                {createDate} 작성 | {updateDate} 편집
              </div>
              <div className="flex align-center gap-8">
                <Link to={`/channel/${feedDetailData?.user.id}`}>
                  <span className="font-bold">
                    {feedDetailData?.user.nickname}
                  </span>
                </Link>
                {feedDetailData?.user.id === loginUserId && (
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
          {feedDetailData?.uploadFiles.map((file, index) => {
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
          <div className="w-full whitespace-pre-wrap break-words leading-5 pt-4 border-t">
            {feedDetailData?.content}
          </div>
          {haveFile && (
            <div className="w-full mt-12 font-bold text-lg">첨부파일</div>
          )}
          {feedDetailData?.uploadFiles.map((file, index) => {
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
          <div
            className="flex justify-end items-center w-full gap-2 cursor-pointer"
            onClick={handleClickLike}
          >
            <div
              className={`w-7 h-6 min-w-6 min-h-6 ${
                isLike
                  ? "bg-[url('./assets/images/likeCountClick.png')]"
                  : "bg-[url('./assets/images/likeCount.png')]"
              } bg-no-repeat bg-cover`}
            />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>
      <AlertModal />
    </div>
  );
};
