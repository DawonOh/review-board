import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';

import { Login } from 'Components/Login';
import { ButtonLayout } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';

const MenuContainer = Styled.div<{ isMenuOn: boolean }>`
  width: 100vw;
  height: 100vh;
  position: absolute;
  padding: 3em;
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

const MenuTitle = Styled.h1`
  margin-bottom: 2em;
  font-size: 2em;
  font-weight: 600;
`;

const MenuList = Styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2em;
  width: 90%;
`;

const MenuIcon = Styled.img`
  width: 1em;
  margin-right: 1em;
`;

const MenuItem = Styled.li`
  font-size: 1.3em;
  cursor: pointer;
`;

const LoginButton = Styled.button`
  ${ButtonLayout}
  padding: 0.8em 1.5em;
  background-color: #676FA3;
  color: #fff;
  cursor: pointer;
`;

const LogoutButton = Styled.button`
  ${ButtonLayout}
  padding: 0.3em;
  background-color: #EBEBEB;
  color: #000;
  cursor: pointer;
`;

interface Props {
  isMenuOn: boolean;
  setIsMenuOn: (isModalOpen: boolean) => void;
}

interface MenuProps {
  id: number;
  title: string;
  icon?: string;
  link: string;
}

export const MobileMenu = ({ isMenuOn, setIsMenuOn }: Props) => {
  const [menuList, setMenuList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  let token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    fetch('/data/mobileMenu.json')
      .then(res => res.json())
      .then(json => {
        if (isLogin) {
          setMenuList(json.menuList);
        } else if (!isLogin) {
          setMenuList(json.logoutMenuList);
        }
      });
  }, [isLogin, token]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
    setIsMenuOn(false);
  };
  return (
    <MenuContainer isMenuOn={isMenuOn}>
      <MenuTitle>메뉴</MenuTitle>
      <MenuList>
        {menuList.map((menuItem: MenuProps) => {
          return (
            <Fragment key={menuItem.id}>
              <Link to={menuItem.link}>
                <MenuItem>
                  <MenuIcon src={menuItem.icon} alt={menuItem.title} />
                  {menuItem.title}
                </MenuItem>
              </Link>
            </Fragment>
          );
        })}
        {isLogin ? (
          <LogoutButton onClick={logout}>로그아웃</LogoutButton>
        ) : (
          <LoginButton onClick={handleModalOpen}>로그인</LoginButton>
        )}
      </MenuList>
      <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </MenuContainer>
  );
};
