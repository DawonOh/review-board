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
  @media (max-width: 767px) {
    margin: 0em;
  }
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
  font-family: 'Kanit', serif;
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

// 모바일 메뉴 버튼 : isMenuOn이 true인 경우 표시
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

// 데스크탑 hover 메뉴 : isHover가 true인 경우 표시
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

// isMenuOn : 모바일 메뉴 오픈 여부
// setIsMenuOn : 메뉴 오픈 핸들링
interface Props {
  isMenuOn: boolean;
  setIsMenuOn: (isModalOpen: boolean) => void;
}

// 검색창
// id : id
// postedAt : 작성일
// titleSnippet : 제목
// contentSnippet : 내용
interface SearchListType {
  id: number;
  postedAt: string;
  titleSnippet: string;
  contentSnippet: string;
}

export const Header = ({ isMenuOn, setIsMenuOn }: Props) => {
  // 로그인 모달창 오픈 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로그인 여부
  const [isLogin, setIsLogin] = useState(false);

  // hover 여부
  const [isHover, setIsHover] = useState(false);

  // 검색어
  const [searchValue, setSearchValue] = useState('');

  // 검색결과
  const [searchList, setSearchList] = useState<SearchListType[]>([]);

  // 검색창 - 로딩 여부
  const [loading, setLoading] = useState(true);

  // 로그인한 유저 id
  const [loginUserId, setLoginUserId] = useState(0);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  // url에서 pathname 조회
  const location = useLocation();
  const pathname = location.pathname;

  // 로그인 모달창 핸들러
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 모바일 메뉴 핸들러
  const handleMenuOn = () => {
    setIsMenuOn(!isMenuOn);
  };

  let token = localStorage.getItem('token');

  // 로그인 한 경우 로그인한 유저 id 조회
  useEffect(() => {
    if (token) {
      axios
        .get(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        })
        .then(response => setLoginUserId(response.data.id));
    }
  }, [token]);

  // isLogin 값 변경
  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [token, isLogin]);

  // 로그아웃 : localStorage 비운 후 메인 페이지로 이동
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // onMouseOver과 onMouseOut에 각각 할당하기 위해 MouseOver함수와 MouseOut함수로 구분
  const handleMouseOver = () => {
    setIsHover(true);
  };

  const handleMouseOut = () => {
    setIsHover(false);
  };

  // 검색창에서 검색어 가져오기
  const getSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색창 ref
  const SearchDivRef = useRef<HTMLDivElement>(null);

  // 검색결과창 외부 클릭 시 창 닫기
  useEffect(() => {
    const closeClickOutside = (e: any) => {
      // SearchDivRef가 존재하고 SearchDivRef의 자식요소가 아닌 경우에
      if (
        // 이벤트 버블링에 의해 SearchDivRef의 자식요소가 아닌 경우를 판단
        SearchDivRef.current &&
        !SearchDivRef.current.contains(e.target as Node)
      ) {
        // 검색창 내용 초기화
        setSearchValue('');
      }
    };
    // 이벤트 리스너 할당
    document.addEventListener('click', closeClickOutside);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      document.removeEventListener('click', closeClickOutside);
    };
  }, [SearchDivRef]);

  // 검색 내용이 있다면 0.5초마다 검색 api 요청
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
    // 검색어가 없다면 검색내용 초기화 및 로딩 여부 true
    if (searchValue.trim() === '') {
      setSearchList([]);
      setLoading(true);
    }
  }, [searchValue]);

  // 검색 결과창 JSX 리턴하는 함수
  const showResult = (searchList: SearchListType[]) => {
    // 로딩중이 아니고 검색 결과가 있다면
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
    // 로딩중이 아니고 검색 결과가 없다면
    if (!loading && searchList.length === 0) {
      return <NoResult>검색 결과가 없습니다😥</NoResult>;
    }
  };

  // 페이지 이동을 위한 navigate
  const navigate = useNavigate();

  // 검색어가 있고 엔터키를 누르면 검색페이지로 이동
  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchValue.trim() !== '' && e.key === 'Enter') {
      let url = `/search?query=${searchValue}`;
      navigate(url);
    }
  };

  return (
    <Fragment>
      {/* 검색결과창 노출 시 하단 카드 화면의 옅은 회색 배경 */}
      {searchValue.trim() !== '' && <SearchBackground />}
      <HeaderContainer>
        <CenterContainer>
          <Link to="/">
            <Logo>ALLREVIEW</Logo>
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
            {/* 로그인한 경우 */}
            {isLogin ? (
              <Icons>
                <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                  <Icon src={PersonIcon} alt="마이페이지" />
                  <HoverMenu isHover={isHover}>
                    <Link to={'/channel/' + loginUserId}>
                      <HoverMenuItem>내 채널</HoverMenuItem>
                    </Link>
                    <Link to="/temp/list">
                      <HoverMenuItem>임시저장 목록</HoverMenuItem>
                    </Link>
                    <Link to="/likes">
                      <HoverMenuItem>좋아요 목록</HoverMenuItem>
                    </Link>
                  </HoverMenu>
                </div>
                <Icon src={LogoutIcon} alt="로그아웃" onClick={logout} />
              </Icons>
            ) : (
              <LoginButton onClick={handleModalOpen}>로그인</LoginButton>
            )}

            {/* 로그인 버튼 */}
            <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

            {/* 모바일 메뉴 */}
            <MobileMenu
              isMenuOn={isMenuOn}
              setIsMenuOn={setIsMenuOn}
              loginUserId={loginUserId}
            />
          </RightContents>
        </CenterContainer>
      </HeaderContainer>
    </Fragment>
  );
};
