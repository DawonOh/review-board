import React, { useState } from 'react';

import { Header, MobileMenu, CardList } from 'Components';
import Styled from 'styled-components';

const MainContainer = Styled.div`
  width: 100%;
  height: 100%;
  position: relate;
`;
export const MainPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);

  return (
    <MainContainer>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <CardList />
    </MainContainer>
  );
};
