import React, { useState } from 'react';
import Styled from 'styled-components';
import { Header } from 'Components';

export const ModifyInfoPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  return <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />;
};
