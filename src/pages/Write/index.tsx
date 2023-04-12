import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';

import { Header, MobileMenu, WriteContainer } from 'Components';

const MainContainer = Styled.div`
  width: 70%;
  height: 100%;
  position: relate;
  margin: 0 auto;
`;

export const WriteFeed = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MainContainer>
        <WriteContainer />
      </MainContainer>
    </Fragment>
  );
};
