import { CheckPassword, Header } from 'Components';
import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';

export const Quit = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <CheckPassword />
    </Fragment>
  );
};
