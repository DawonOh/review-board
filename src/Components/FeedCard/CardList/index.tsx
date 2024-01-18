import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Card from '../Card';
import { useCardList } from '../../../hooks/useCardList';

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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useCardList(categoryId);

  const cardLists: cardListType[][] | undefined = data?.pages;
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (status === 'pending' || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, status]
  );
  const cardListReturnJsx = () => {
    if (cardLists?.length === 0) {
      return (
        <div className="w-full h-[calc(100vh-6rem-58px)] flex flex-col items-center justify-center z-50">
          <div className="w-20 h-20 mb-4 bg-[url('./assets/images/first.png')] bg-no-repeat bg-cover animate-move" />
          <div>리뷰가 없습니다! 첫 리뷰를 작성해주세요😎</div>
        </div>
      );
    }
    if (cardLists !== undefined && cardLists?.length > 0) {
      return (
        <main className="grid grid-cols-card justify-around items-center w-4/5 h-full p-8 mx-auto my-0 gap-8">
          {cardLists?.map((cardList, i) => (
            <Fragment key={i}>
              {cardList?.map(card => (
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
              ))}
            </Fragment>
          ))}
        </main>
      );
    }
    if (status === 'pending' || isFetchingNextPage) {
      return (
        <div className=" absolute top-1/2 left-1/2  w-8 h-8 bg-[url('./assets/images/loader.png')] bg-no-repeat bg-cover animate-spin" />
      );
    }
    if (cardLists?.length === 0 && error) {
      return (
        <div className="w-full h-[calc(100vh-6rem-58px)] flex flex-col items-center justify-center z-50">
          <div>정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>
        </div>
      );
    }
  };

  return <Fragment>{cardListReturnJsx()}</Fragment>;
};
