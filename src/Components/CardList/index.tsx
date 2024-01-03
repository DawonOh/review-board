import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Card from '../Card';
import { useCardList } from '../../hooks/useCardList';

interface cardListType {
  category: string;
  categoryId: number;
  commentCnt: string;
  content: string;
  createdAt: string;
  filesCnt: string;
  id: number;
  imgUrl: string | undefined;
  likeCnt: string;
  title: string;
  userId: number;
  userNickname: string;
  viewCnt: number;
  updatedAt: string;
  postedAt: string;
  deletedAt: string | null;
  statusId: number;
}

interface PropsType {
  categoryId: any;
}

export const CardList = ({ categoryId }: PropsType) => {
  const [pageNum, setPageNum] = useState(0);
  const { cardList, hasMore, loading, error, isEmpty } = useCardList(
    pageNum,
    categoryId
  );
  useEffect(() => {
    setPageNum(0);
  }, [categoryId]);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNumber: number) => prevPageNumber + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const cardListReturnJsx = () => {
    if (isEmpty === true) {
      return (
        <div className="w-full h-[calc(100vh-6rem-58px)] flex flex-col items-center justify-center z-50">
          <div className="w-20 h-20 mb-4 bg-[url('./assets/images/first.png')] bg-no-repeat bg-cover animate-move" />
          <div>리뷰가 없습니다! 첫 리뷰를 작성해주세요😎</div>
        </div>
      );
    }
    if (isEmpty === false) {
      return (
        <main className="grid grid-cols-card justify-around items-center w-4/5 h-full p-8 mx-auto my-0 gap-8">
          {cardList.map((card: cardListType, index) => {
            if (cardList.length === index + 1) {
              return (
                <Card
                  ref={lastCardElementRef}
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  category={card.category}
                  file={card.filesCnt}
                  img={card.imgUrl}
                  content={card.content}
                  likeCount={card.likeCnt}
                  commentCount={card.commentCnt}
                  nickName={card.userNickname}
                  createdAt={card.createdAt}
                  viewCnt={card.viewCnt}
                />
              );
            } else {
              return (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  category={card.category}
                  file={card.filesCnt}
                  img={card.imgUrl}
                  content={card.content}
                  likeCount={card.likeCnt}
                  commentCount={card.commentCnt}
                  nickName={card.userNickname}
                  createdAt={card.createdAt}
                  viewCnt={card.viewCnt}
                />
              );
            }
          })}
          {loading && (
            <div className=" absolute top-1/2 left-1/2  w-8 h-8 bg-[url('./assets/images/loader.png')] bg-no-repeat bg-cover animate-spin" />
          )}
        </main>
      );
    }
    if (isEmpty === null && error) {
      return (
        <div className="w-full h-[calc(100vh-6rem-58px)] flex flex-col items-center justify-center z-50">
          <div>정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>
        </div>
      );
    }
  };

  return <Fragment>{cardListReturnJsx()}</Fragment>;
};
