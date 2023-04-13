import React, { Fragment, useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';

import { Login, MobileMenu } from 'Components';
import { ButtonLayout } from 'Styles/CommonStyle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '../../assets/images/menu.png';
import CloseIcon from '../../assets/images/close.png';
import PersonIcon from '../../assets/images/person.png';
import LogoutIcon from '../../assets/images/logout.png';
import axios from 'axios';

const HeaderContainer = Styled.header`
  position: sticky;
  width: 100%;
  height: 100%;
  top: 0;
  margin-bottom: 2em;
  background-color: #fff;
  box-shadow: 1px 1px 5px 1px #f7f7f7;
  z-index: 999;
`;

const CenterContainer = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 100%;
  padding: 2em;
  margin: 0 auto;
  background-color: #fff;
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
  width: 20em;
  margin-right: 1em;
  padding: 0.6em;
  font-size: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  &:focus {
    outline: none;
  }
  z-index: 999;
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
  width: 9em;
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

const SearchListContainer = Styled.div`
  position: absolute;
  width: 20em;
  padding: 1em;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0.3em;
  z-index: 999;
`;

const ContentContainer = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 23em;
  padding: 1em;
  gap: 1em;
  background-color: #fff;
  overflow-y: auto;
  z-index: 999;
`;

const SearchListItemTitle = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`;

const SearchTitle = Styled.div`
  width: 8em;
  font-weight: 700;
`;

const SearchDate = Styled.div`
  width: 6em;
  font-size: 0.8em;
  color: #BDBDBD;
`;

const SearchContent = Styled.div`
  width: 12em;
  min-height: 2.5em;
`;

const SearchBackground = Styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: #000;
  opacity: 0.1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 999;
`;

const GotoSearchPage = Styled.div`
  positioin: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 1em;
  margin-top: 0.3em;
  text-align: center;
  cursor: pointer;
`;

const NoResult = Styled.div`
  text-align: center;
`;
interface Props {
  isMenuOn: boolean;
  setIsMenuOn: (isModalOpen: boolean) => void;
}

interface SearchListType {
  id: number;
  postedAt: string;
  titleSnippet: string;
  contentSnippet: string;
}

export const Header = ({ isMenuOn, setIsMenuOn }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchList, setSearchList] = useState<SearchListType[]>([]);
  const [loading, setLoading] = useState(true);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const location = useLocation();
  const pathname = location.pathname;

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

  const getSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const SearchDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeClickOutside = (e: any) => {
      if (
        SearchDivRef.current &&
        !SearchDivRef.current.contains(e.target as Node)
      ) {
        setSearchValue('');
      }
    };
    document.addEventListener('click', closeClickOutside);
    return () => {
      document.removeEventListener('click', closeClickOutside);
    };
  }, [SearchDivRef]);

  useEffect(() => {
    if (searchValue.trim() !== '') {
      const timer = setTimeout(() => {
        axios
          .get<SearchListType[]>(
            `${BACK_URL}:${BACK_PORT}/search?query=${searchValue}`,
            { timeout: 5000 }
          )
          .then(response => {
            setSearchList(response.data);
            setLoading(false);
          });
      }, 500);
      return () => clearTimeout(timer);
    }
    if (searchValue.trim() === '') {
      setSearchList([]);
      setLoading(true);
    }
  }, [searchValue]);

  const showResult = (searchList: SearchListType[]) => {
    if (!loading && searchList.length !== 0) {
      return searchList.map(result => {
        return (
          <Link key={result.id} to={'/feed/' + result.id}>
            <div>
              <SearchListItemTitle>
                <SearchTitle>
                  {result.titleSnippet ? result.titleSnippet : '-'}
                </SearchTitle>
                <SearchDate>
                  {result.postedAt && result.postedAt.slice(0, -8)}
                </SearchDate>
              </SearchListItemTitle>
              <SearchContent>
                {result.contentSnippet ? result.contentSnippet : '-'}
              </SearchContent>
            </div>
          </Link>
        );
      });
    }
    if (!loading && searchList.length === 0) {
      return <NoResult>검색 결과가 없습니다😥</NoResult>;
    }
  };

  const navigate = useNavigate();

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchValue.trim() !== '' && e.key === 'Enter') {
      let url = `/search?query=${searchValue}`;
      navigate(url);
    }
  };

  return (
    <Fragment>
      {searchValue.trim() !== '' && <SearchBackground />}
      <HeaderContainer>
        <CenterContainer>
          <Link to="/">
            <Logo>LOGO</Logo>
          </Link>
          <MenuButton onClick={handleMenuOn} isMenuOn={isMenuOn} />
          <RightContents>
            {pathname !== '/search' && (
              <div ref={SearchDivRef}>
                <Input
                  type="search"
                  placeholder="검색어를 입력해주세요"
                  onChange={e => getSearchValue(e)}
                  onKeyUp={search}
                />
                {searchValue && (
                  <SearchListContainer>
                    <ContentContainer>
                      {loading ? (
                        <NoResult>Loading...</NoResult>
                      ) : (
                        showResult(searchList)
                      )}
                    </ContentContainer>
                    <Link to={'/search?query=' + searchValue}>
                      <GotoSearchPage>더보기</GotoSearchPage>
                    </Link>
                  </SearchListContainer>
                )}
              </div>
            )}
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
        </CenterContainer>
      </HeaderContainer>
    </Fragment>
  );
};
