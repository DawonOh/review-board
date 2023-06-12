import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';
import { Header } from 'Components';

export const LikeList = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
    </Fragment>
  );
};
