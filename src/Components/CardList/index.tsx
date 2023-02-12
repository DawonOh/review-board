import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';

import { Card } from 'Components/Card';

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

interface cardListType {
  id: number;
  categoryId: number;
  category: string;
  title: string;
  content: string;
  imgUrl: string;
  likeCnt: string;
  filesCnt: string;
  commentCnt: string;
  createdAt: string;
}

export const CardList = () => {
  const [cardList, setCardList] = useState([]);

  useEffect(() => {
    fetch('/data/cardListData.json')
      .then(res => res.json())
      .then(json => {
        setCardList(json);
      });

    //통신을 위한 fetch
    // fetch('http://localhost:3000/feeds?page=1', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then(res => res.json())
    //   .then(json => setCardList(json));
  }, []);
  return (
    <CardListContainer>
      {cardList.map((card: cardListType) => {
        return (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            category={card.category}
            file={card.filesCnt}
            img={card.imgUrl}
            content={card.content}
            isLike={true}
            likeCount={card.likeCnt}
            commentCount={card.commentCnt}
            nickName="Tester"
            createdAt={card.createdAt}
          />
        );
      })}
    </CardListContainer>
  );
};
