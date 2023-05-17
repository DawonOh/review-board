import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';

import { Header, MobileMenu, WriteContainer } from 'Components';
import axios from 'axios';

const MainContainer = Styled.div`
  width: 70%;
  height: 100%;
  position: relate;
  margin: 0 auto;
`;

export const WriteFeed = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserId, setLoginUserId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      axios
        .get(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        })
        .then(response => setLoginUserId(response.data.id));
    }
  }, [token]);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu
        isMenuOn={isMenuOn}
        setIsMenuOn={setIsMenuOn}
        loginUserId={loginUserId}
      />
      <MainContainer>
        <WriteContainer />
      </MainContainer>
    </Fragment>
  );
};
