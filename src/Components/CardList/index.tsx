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

// categorId : 카테고리id에 따른 데이터를 보여주기 위해 받는 props로, useCardList에 전달
// setIsNotEmpty : 카드 목록이 비었는지를 확인
interface PropsType {
  categoryId: any;
  setIsNotEmpty: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CardList = ({ categoryId, setIsNotEmpty }: PropsType) => {
  const [pageNum, setPageNum] = useState(0);
  // useCardList 커스텀 훅 : 카드 리스트, 불러올 데이터가 더 있는지 여부, 로딩 여부, 에러 여부
  const { cardList, hasMore, loading, error } = useCardList(
    pageNum,
    categoryId
  );
  useEffect(() => {
    if (setIsNotEmpty && cardList.length !== 0) setIsNotEmpty(true);
  }, [cardList]);
  useEffect(() => {
    setPageNum(0);
  }, [categoryId]);

  // 무한스크롤 - Intersection Observer API 사용
  // observer : 관찰하려는 요소
  const observer = useRef<IntersectionObserver | null>(null);

  // 마지막 카드 요소를 가져오는 ref
  const lastCardElementRef = useCallback(
    (node: HTMLDivElement) => {
      // 로딩중이라면 함수 종료
      if (loading) return;

      // 이전의 observer가 있으면 해제
      if (observer.current) observer.current.disconnect();

      // 새 observer.current 생성
      observer.current = new IntersectionObserver(entries => {
        // 화면에 마지막 요소가 있고 더 불러올 데이터가 있다면 pageNumber에 10을 추가
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNumber: number) => prevPageNumber + 10);
        }
      });
      // 마지막 요소가 있으면 관찰 대상으로 지정
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (error) {
      alert('잠시 후 다시 시도해주세요.');
    }
  }, [error]);

  // cardList의 길이가 index+1과 같아지면 마지막 Card이므로 lastCardElementRef를 Card 컴포넌트에 연결
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
