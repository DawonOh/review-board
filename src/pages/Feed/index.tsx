import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { Header, MobileMenu, FeedDetail, CommentContainer } from 'Components';
import axios from 'axios';

const MainContainer = Styled.div`
  width: 80%;
  height: 100%;
  position: relate;
  margin: 0 auto;
  padding: 2em;
`;

export const Feed = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  //로그인 한 유저 Id
  const [loginUserId, setLoginUserId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        })
        .then(response => {
          setLoginUserId(response.data.id);
        });
    }
  }, []);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MainContainer>
        <FeedDetail loginUserId={loginUserId} />
        <CommentContainer loginUserId={loginUserId} />
      </MainContainer>
    </Fragment>
  );
};
