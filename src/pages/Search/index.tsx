import { Header, SearchComponent } from 'Components';
import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';

export const SearchPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <SearchComponent />
    </Fragment>
  );
};
