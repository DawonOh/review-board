import React from 'react';
import Styled from 'styled-components';

const MenuContainer = Styled.div<{ isMenuOn: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  transform: ${props =>
    props.isMenuOn ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.5s;
  background-color: #fff;
  border: 1px solid #EBEBEB;
  z-index: 999;
  @media all and (min-width:767px) {
    display: none;
  }
`;

interface Props {
  isMenuOn: boolean;
  setIsMenuOn: (isModalOpen: boolean) => void;
}

export const MobileMenu = ({ isMenuOn, setIsMenuOn }: Props) => {
  return <MenuContainer isMenuOn={isMenuOn}></MenuContainer>;
};
