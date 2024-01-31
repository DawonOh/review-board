import { Fragment, useEffect, useState } from 'react';
import { MobileMenu } from 'Components';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface TempListType {
  message: string;
  result: [
    {
      category: string;
      categoryId: number;
      commentCnt: string;
      content: string;
      createdAt: string;
      deletedAt: null;
      filesCnt: string;
      id: number;
      imgCnt: string;
      imgUrl: null;
      likeCnt: string;
      postedAt: null;
      statusId: number;
      title: string;
      updatedAt: string;
      userId: number;
      userNickname: string;
      viewCnt: number;
    }
  ];
}

interface TempType {
  category: string;
  categoryId: number;
  commentCnt: string;
  content: string;
  createdAt: string;
  deletedAt: null;
  filesCnt: string;
  id: number;
  imgCnt: string;
  imgUrl: null;
  likeCnt: string;
  postedAt: null;
  statusId: number;
  title: string;
  updatedAt: string;
  userId: number;
  userNickname: string;
  viewCnt: number;
}

export const TempList = () => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [tempFeedId, setTempFeedId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const [tempData, setTempData] = useState<TempType[]>([]);

  let token = sessionStorage.getItem('token');

  useEffect(() => {
    axios
      .get<TempListType>(`${BACK_URL}/feeds/temp`, {
        timeout: 5000,
        headers: { Accept: `application/json`, Authorization: token },
      })
      .then(response => {
        setTempData(response.data.result);
      })
      .catch(() => {
        alert('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      });
  }, [isDeleted]);

  const deleteTempFeed = () => {
    // setMessages([{ id: 1, text: '삭제하시겠습니까?' }]);
    // setIsQuestion(true);
    // setIsAlertModalOpen(true);
  };

  // useEffect(() => {
  //   if (result) {
  //     axios
  //       .delete(`${BACK_URL}/feeds/${tempFeedId}`, {
  //         timeout: 5000,
  //         headers: { Accept: `application/json`, Authorization: token },
  //       })
  //       .then(() => {
  //         setIsDeleted(true);
  //       })
  //       .catch(() => {
  //         alert('잠시 후 다시 시도해주세요.');
  //         setIsDeleted(false);
  //       });
  //   }
  // }, [result]);

  return (
    <Fragment>
      <MobileMenu />
      <div className="flexCenterAlign w-full p-8 bg-bg-gray">
        <div className="w-4/5">
          <h1 className="text-2xl font-bold">임시 저장 목록</h1>
          <div className="flex flex-col gap-4 w-full mt-12">
            {tempData.length !== 0 ? (
              tempData.map(feed => {
                return (
                  <div
                    className="w-full p-8 bg-white rounded-lg cursor-pointer"
                    onClick={() => setTempFeedId(feed.id)}
                    key={feed.id}
                  >
                    <Link
                      to={`/writeFeed?mode=temp&id=${feed.id}`}
                      state={{
                        feedId: feed.id,
                        isModify: false,
                        isTemp: true,
                      }}
                    >
                      <div className="text-xl font-bold">{feed.title}</div>
                      <div className="mt-4 overflow-hidden whitespace-nowrap text-ellipsis">
                        {feed.content}
                      </div>
                    </Link>
                    <div className="flex justify-between mt-4">
                      <div className="text-sm text-buttongray">
                        {feed.createdAt.slice(0, -3)}
                      </div>
                      <button
                        className="buttonLayout bg-bg-gray text-white"
                        onClick={deleteTempFeed}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                임시저장된 게시물이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
