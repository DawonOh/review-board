import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks';
import { alertActions } from 'redux/slice/alert-slice';
import instance from 'api';
import {
  DataType,
  LikeType,
  deleteLike,
  queryClient,
  sendLike,
} from 'util/feedDetail-http';
import { useMutation } from '@tanstack/react-query';
import { deleteFeed } from 'util/feed-http';
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
  feedLikeData,
}: {
  feedDetailData: DataType['result'] | undefined;
  feedLikeData: LikeType[] | undefined;
}) => {
  const [isLike, setIsLike] = useState(false);

  let isLogin = useAppSelector(state => state.login.isLogin);
  let loginUserId = useAppSelector(state => state.user.id);
  const params = useParams();
  let feedId = params.id;

  const dispatch = useAppDispatch();

  // 좋아요 요청
  const { mutate: getLikeMutate, isError: getLikeIsError } = useMutation({
    mutationFn: sendLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['like'],
      });
      setIsLike(true);
    },
  });

  const { mutate: deleteLikeMutate, isError: deletLikeHasError } = useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['like'],
      });
      setIsLike(false);
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
      getLikeMutate({ feedId });
      return;
    }
    if (isLike) {
      deleteLikeMutate({ feedId });
    }
  };

  const errorAlert = (content: string) => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: content,
        isQuestion: false,
        alertPath: '',
      })
    );
  };

  useEffect(() => {
    if (getLikeIsError) {
      errorAlert(
        '죄송합니다.현재 서버에 문제가 발생하여 요청을 처리할 수 없습니다.'
      );
    }
  }, [dispatch, getLikeIsError]);

  useEffect(() => {
    if (deletLikeHasError) {
      errorAlert(
        '죄송합니다.현재 서버에 문제가 발생하여 요청을 처리할 수 없습니다.'
      );
    }
  }, [deletLikeHasError, dispatch]);

  // 좋아요 수
  useEffect(() => {
    if (isLogin) {
      instance
        .get<LoginLikeType>(`/symbols/check/${feedId}`)
        .then(response => {
          setIsLike(response.data.checkValue);
        })
        .catch(error => {
          errorAlert(
            '좋아요 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
          );
        });
    }
  }, [isLogin, feedId]);

  // 게시물 삭제
  const deleteFeedAlert = () => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '삭제하시겠습니까?',
        alertPath: '',
        isQuestion: true,
      })
    );
  };

  const isDelete = useAppSelector(state => state.alert.isClickOk);

  useEffect(() => {
    if (isDelete) {
      deleteFeed(feedId);
    }
  }, [isDelete, feedId]);

  // useEffect(() => {
  //   if (result) {
  //     axios
  //       .delete<string>(`${BACK_URL}/feeds/${feedId}`, {
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
                      onClick={deleteFeedAlert}
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
            <span>{feedLikeData && feedLikeData[0].count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
