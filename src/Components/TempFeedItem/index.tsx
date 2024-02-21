import { useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from 'hooks';
import { TempType } from 'pages';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';
import { deleteFeed } from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';

export const TempFeedItem = ({ feed }: { feed: TempType }) => {
  const [clickedId, setClickedId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const isClickOk = useAppSelector(state => state.alert.isClickOk);

  const deleteTempFeedAlert = (id: number) => {
    setClickedId(id);
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: '삭제하시겠습니까?',
        isQuestion: true,
        alertPath: '',
      })
    );
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempList'], exact: true });
    },
    onError: () => {
      dispatch(
        alertActions.setModal({
          isModalOpen: true,
          contents: '삭제에 실패했습니다.잠시 후 다시 시도해주세요.',
          isQuestion: false,
          alertPath: '',
        })
      );
    },
  });

  useEffect(() => {
    if (isClickOk && clickedId !== null) {
      deleteMutate(clickedId?.toString());
      dispatch(alertActions.setIsClickOk());
    }
  }, [isClickOk, clickedId, dispatch, deleteMutate]);

  return (
    <>
      <div className="flex md:justify-between justify-start md:flex-row flex-col md:items-center items-start w-full p-8 bg-white rounded-lg cursor-pointer hover:-translate-y-0.5 hover:duration-300 [&:not(:hover)]:translate-y-0.5 [&:not(:hover)]:duration-300">
        <Link
          to={`/writeFeed?mode=temp&id=${feed.id}`}
          className="w-11/12 md:inline flex flex-col"
        >
          <span className="text-xl font-bold">{feed.title}</span>
          <span className="text-sm text-buttongray md:ml-4 ml-0">
            {feed.createdAt.slice(0, -3)}
          </span>
          <div className="mt-4 overflow-hidden whitespace-nowrap text-ellipsis">
            {feed.content}
          </div>
        </Link>
        <button
          className="px-4 bg-[#F8C7C7] border border-mainred text-mainred rounded-lg md:mt-0 mt-4"
          onClick={() => {
            deleteTempFeedAlert(feed.id);
          }}
        >
          삭제
        </button>
      </div>
    </>
  );
};
