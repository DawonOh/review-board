import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const [deleteFeedId, setDeleteFeedId] = useState<string | null>(null);

  let isLogin = useAppSelector(state => state.login.isLogin);
  let loginUserId = useAppSelector(state => state.user.id);
  const params = useParams();
  let feedId = params.id;

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // 좋아요 요청
  const { mutate: getLikeMutate, isError: getLikeIsError } = useMutation({
    mutationFn: sendLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['like'],
      });
      queryClient.invalidateQueries({
        queryKey: ['likeList', { feedListId: feedId && parseInt(feedId) }],
      });
      queryClient.invalidateQueries({
        queryKey: ['userLikeList'],
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
      queryClient.invalidateQueries({
        queryKey: ['likeList', { feedListId: feedId && parseInt(feedId) }],
      });
      queryClient.invalidateQueries({
        queryKey: ['userLikeList'],
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
    feedId && setDeleteFeedId(feedId);
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

  const { mutate: deleteMutate, isError } = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainList'] });
      navigate('/');
    },
  });

  useEffect(() => {
    if (isDelete && deleteFeedId !== null) {
      deleteMutate(feedId);
      dispatch(alertActions.setIsClickOk());
      setDeleteFeedId(null);
    }
  }, [isDelete, deleteFeedId, dispatch, deleteMutate]);

  useEffect(() => {
    if (isError) {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
          alertPath: '',
          isQuestion: false,
        })
      );
    }
  }, [isError, dispatch]);

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
    <div className="flex justify-center w-full">
      <div className="flex justify-center fixed w-full p-4 bg-white border-t">
        <div className="flex xl:flex-row flex-col xl:items-center items-start 2xl:w-1/2 w-3/4 relative">
          {/* 카테고리 */}
          <div className="text-center mr-4 px-4 bg-buttongray rounded-md">
            {feedDetailData?.category.category}
          </div>
          {/* 제목 */}
          <div className="flex gap-2 xl:mt-0 mt-4">
            <div
              className={`w-6 h-6 min-w-6 min-h-6 ${estimateIcon()} bg-no-repeat bg-cover`}
            />
            <h1 className="text-xl font-bold">
              {feedDetailData?.title}
              {/* 작성자 */}
              <Link
                to={`/channel/${feedDetailData?.user.id}?type=review`}
                className="text-sm ml-4 mt-auto"
              >
                <span className="font-bold text-textgray hover:text-mainblue">
                  {feedDetailData?.user.nickname}
                </span>
              </Link>
            </h1>
          </div>
          {/* 조회수 + 좋아요 */}
          <div className="flex gap-4 ml-auto xl:static absolute right-0">
            <div className="flex items-center">
              <div className="w-4 h-4 min-w-4 min-h-4 mr-1 bg-[url('./assets/images/view.png')] bg-no-repeat bg-cover" />
              <span>{feedDetailData?.viewCnt}</span>
            </div>
            <button
              className="flexCenterAlign gap-2 py-1 px-2 buttonLayout bg-buttongray cursor-pointer"
              onClick={handleClickLike}
            >
              <div
                className={`w-4 h-4 min-w-4 min-h-4 ${
                  isLike
                    ? "bg-[url('./assets/images/heart-fill.png')]"
                    : "bg-[url('./assets/images/heart-red.png')]"
                } bg-no-repeat bg-cover`}
              />
              좋아요 {feedLikeData && feedLikeData[0].count}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full my-0 mx-auto bg-white rounded-md xl:mt-16 md:mt-20 mt-24 px-8 py-8">
        <div className="flex md:flex-row flex-col 2xl:w-1/2 w-3/4 my-0 mx-auto text-sm text-textgray">
          <span>{createDate} 작성 </span>
          <span className="md:inline hidden mx-4">|</span>
          <span>{updateDate} 편집</span>
        </div>
        <div className="2xl:w-1/2 w-3/4 gap-4">
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
          <div className="w-full whitespace-pre-wrap leading-5 pt-4">
            {feedDetailData?.content}
          </div>
          <div className="flex flex-col justify-between items-center w-full md:mt-8">
            <div className="flex md:flex-row flex-col items-end md:justify-end justify-center w-full">
              <div className="flex align-center gap-8">
                {feedDetailData?.user.id === loginUserId && (
                  <div className="flexCenterAlign gap-2 ">
                    <Link to={`/writeFeed?mode=modify&id=${feedId}`}>
                      <button className="buttonLayout text-sm bg-mainblue text-white px-2 py-1 hover:opacity-75">
                        수정
                      </button>
                    </Link>
                    <button
                      className="buttonLayout text-sm bg-mainred text-white px-2 py-1 hover:opacity-75"
                      onClick={deleteFeedAlert}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
