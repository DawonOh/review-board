import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';
import { Header, MobileMenu } from 'Components';
import { FeedDetail } from 'Components';

const MainContainer = Styled.div`
  width: 80%;
  height: 100%;
  position: relate;
  margin: 0 auto;
  padding: 2em;
`;

export const Feed = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MainContainer>
        <FeedDetail />
      </MainContainer>
    </Fragment>
  );
};
