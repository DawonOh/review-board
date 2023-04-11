import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';

import { Login, MobileMenu } from 'Components';
import { ButtonLayout } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';
import SearchIcon from '../../assets/images/search.png';
import MenuIcon from '../../assets/images/menu.png';
import CloseIcon from '../../assets/images/close.png';
import PersonIcon from '../../assets/images/person.png';
import LogoutIcon from '../../assets/images/logout.png';

const HeaderContainer = Styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 100%;
  padding: 2em;
  margin: 0 auto;
  @media all and (max-width: 1023px) {
    width: 80%;
  }
`;

const Logo = Styled.h1`
  color: #676FA3;
  font-size: 2em;
  font-weight: 700;
`;

const RightContents = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media all and (max-width:767px) {
    display: none;
  }
`;

const Input = Styled.input`
  width: 15em;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
`;

const SearchButton = Styled.div`
  width: 1.3em;
  height: 1.3em;
  margin: 0 1.3em 0 0.4em;
  background: url(${SearchIcon});
  background-repeat: no-repeat;
	background-size: cover;
  cursor: pointer;
`;

const MenuButton = Styled.div<{ isMenuOn: boolean }>`
  display : none;
  @media all and (max-width:767px) {
    display: block;
    width: 1.3em;
    height: 1.3em;
    background: url(${props => (props.isMenuOn ? CloseIcon : MenuIcon)});
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
  }
`;
const Icons = Styled.div`
  display: flex;
  position: relatve;
  gap: 1.3em;
`;
const Icon = Styled.img`
  width: 1.3em;
  cursor: pointer;
`;

const LoginButton = Styled.button`
  ${ButtonLayout}
  padding: 0.8em 1.5em;
  background-color: #676FA3;
  color: #fff;
  cursor: pointer;
`;

const HoverMenu = Styled.div<{ isHover: boolean }>`
  display: ${props => (props.isHover ? 'flex' : 'none')};
  position: absolute;
  flex-direction: column;
  padding: 1em;
  gap: 1em;
  background-color: #fff;
  border: 1px solid #BDBDBD;
  border-radius: 0.3em;
`;

const HoverMenuItem = Styled.span`
  cursor: pointer;
  &:hover {
    color: #676FA3;
  }
`;

interface Props {
  isMenuOn: boolean;
  setIsMenuOn: (isModalOpen: boolean) => void;
}

export const Header = ({ isMenuOn, setIsMenuOn }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleMenuOn = () => {
    setIsMenuOn(!isMenuOn);
  };
  let token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [token, isLogin]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleMouseOver = () => {
    setIsHover(true);
  };

  const handleMouseOut = () => {
    setIsHover(false);
  };
  return (
    <HeaderContainer>
      <Link to="/">
        <Logo>LOGO</Logo>
      </Link>
      <MenuButton onClick={handleMenuOn} isMenuOn={isMenuOn} />
      <RightContents>
        <Input type="search" placeholder="검색어를 입력해주세요" />
        <Link to="/search">
          <SearchButton />
        </Link>
        {isLogin ? (
          <Icons>
            <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              <Icon src={PersonIcon} alt="마이페이지" />
              <HoverMenu isHover={isHover}>
                <Link to="/mychannel">
                  <HoverMenuItem>내 채널</HoverMenuItem>
                </Link>
                <Link to="/temp/list">
                  <HoverMenuItem>임시저장 목록</HoverMenuItem>
                </Link>
              </HoverMenu>
            </div>
            <Icon src={LogoutIcon} alt="로그아웃" onClick={logout} />
          </Icons>
        ) : (
          <LoginButton onClick={handleModalOpen}>로그인</LoginButton>
        )}

        <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      </RightContents>
    </HeaderContainer>
  );
};
