import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { Login } from 'Components/Login';
import { ButtonLayout } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '../../assets/images/person.png';

const MenuContainer = Styled.div<{ isMenuOn: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
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
  loginUserId: number | undefined;
}

interface MenuProps {
  id: number;
  title: string;
  icon?: string;
  link: string;
}

export const MobileMenu = ({ isMenuOn, setIsMenuOn, loginUserId }: Props) => {
  const [menuList, setMenuList] = useState([]);

  let token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/data/mobileMenu.json').then(response => {
      if (token) {
        setMenuList(response.data.menuList);
        return;
      }
      if (!token) {
        setMenuList(response.data.logoutMenuList);
        return;
      }
    });
  }, [token]);

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
        <Link to={`/channel/${loginUserId}`}>
          <MenuItem>
            <MenuIcon src={PersonIcon} alt="내 채널 아이콘" />
            마이페이지
          </MenuItem>
        </Link>
        {token ? (
          <LogoutButton onClick={logout}>로그아웃</LogoutButton>
        ) : (
          <LoginButton onClick={handleModalOpen}>로그인</LoginButton>
        )}
      </MenuList>
      <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </MenuContainer>
  );
};
