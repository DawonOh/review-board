import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';
import { Header, MobileMenu } from 'Components';
import DoubleLikeImg from '../../assets/images/double-like.png';

const MainContainer = Styled.div`
  width: 80%;
  height: 100%;
  position: relate;
  margin: 0 auto;
  padding: 2em;
`;

const TitleContainer = Styled.div`
  display: flex;
  width: 100%;
  padding: 0.3em;
  gap: 1em;
  align-items: center;
  border-bottom: 2px solid #f1f1f1;
`;

const LikeByWriter = Styled.div`
  width: 2em;
  height: 2em;
  background: url(${DoubleLikeImg});
  background-repeat: no-repeat;
	background-size: cover;
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
`;

export const Feed = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MainContainer>
        <TitleContainer>
          <LikeByWriter />
          <Title>안녕하세요! 테스트용 게시물입니다. 클릭하지 말아주세요</Title>
        </TitleContainer>
      </MainContainer>
    </Fragment>
  );
};
