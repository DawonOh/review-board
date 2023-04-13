import React, { useCallback, useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';

import Card from '../Card';
import { useCardList } from '../../hooks/useCardList';

const CardListContainer = Styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(300px, 1fr));
  justify-content: space-around;
  align-items: center;
  width: 80%;
  height: 100%;
  padding: 2em;
  margin: 0 auto;
  gap: 2em;
  @media all and (max-width: 1023px) {
    width: 80%;
  }
`;

const Loader = Styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2em;
  height: 2em;
  border: 5px solid #cddeff;
  border-radius: 50%;
  border-top: 5px solid #fff;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

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
  setIsNotEmpty: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CardList = ({ categoryId, setIsNotEmpty }: PropsType) => {
  const [pageNum, setPageNum] = useState(1);
  const { cardList, hasMore, loading, error } = useCardList(
    pageNum,
    categoryId
  );
  useEffect(() => {
    if (setIsNotEmpty && cardList.length !== 0) setIsNotEmpty(true);
  }, [cardList]);
  useEffect(() => {
    setPageNum(1);
  }, [categoryId]);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNumber: number) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (error) {
      alert('잠시 후 다시 시도해주세요.');
    }
  }, [error]);

  return (
    <CardListContainer>
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
      {loading && <Loader />}
    </CardListContainer>
  );
};
