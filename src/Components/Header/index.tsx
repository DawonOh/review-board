import React, { Fragment, useEffect, useRef, useState } from 'react';
import { MobileMenu } from 'Components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PersonIcon from '../../assets/images/person.png';
import LogoutIcon from '../../assets/images/logout.png';

import axios from 'axios';
import { useAppSelector } from 'hooks';
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
  const [isHover, setIsHover] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchList, setSearchList] = useState<SearchListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginUserId, setLoginUserId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const location = useLocation();
  const pathname = location.pathname;

  const isLogin = useAppSelector(state => state.login.isLogin);

  let token = localStorage.getItem('token');

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
              <div className="flex justify-between items-center mb-4">
                <div className="w-32 font-bold">
                  {result.titleSnippet ? result.titleSnippet : '-'}
                </div>
                <div className="w-24 text-sm text-buttongray">
                  {result.postedAt && result.postedAt.slice(0, -8)}
                </div>
              </div>
              <div className="w-48 min-h-[2.5rem]">
                {result.contentSnippet ? result.contentSnippet : '-'}
              </div>
            </div>
          </Link>
        );
      });
    }
    if (!loading && searchList.length === 0) {
      return <div className="text-center">검색 결과가 없습니다😥</div>;
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
      {searchValue.trim() !== '' && (
        <div className="fixed w-full h-screen bg-black/[.1] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 overflow-hidden z-50" />
      )}
      <header className="sticky w-full h-full top-0 m-0 md:mb-8 bg-white shadow-[1px_1px_5px_1px_#f7f7f7] z-50">
        <div className="flex justify-between items-center w-4/5 h-full p-8 my-0 mx-auto bg-white">
          <Link to="/">
            <h1 className="font-sans text-mainblue text-3xl font-bold">
              ALLREVIEW
            </h1>
          </Link>
          <div
            className={`md:hidden block w-5 h-5 ${
              isMenuOn
                ? "bg-[url('./assets/images/close.png')]"
                : "bg-[url('./assets/images/menu.png')]"
            } bg-no-repeat bg-cover cursor-pointer`}
          />
          <div className="md:flex hidden justify-between items-center hidden">
            {pathname !== '/search' && (
              <div ref={SearchDivRef}>
                <input
                  className="w-80 mr-4 p-2.5 border border-buttongray rounded-md focus:outline-none z-50"
                  type="search"
                  placeholder="검색어를 입력해주세요"
                  onChange={e => getSearchValue(e)}
                  onKeyUp={search}
                />
                {searchValue && (
                  <div className="absolute w-80 p-4 bg-white border border-buttongray rounded-md z-50">
                    <div className="flex flex-col w-full max-h-96 p-4 gap-4 bg-white overflow-y-auto z-50">
                      {loading ? (
                        <div className="text-center">Loading...</div>
                      ) : (
                        showResult(searchList)
                      )}
                    </div>
                    <Link to={'/search?query=' + searchValue}>
                      <div className="w-full h-4 mt-1.5 text-center cursor-pointer">
                        더보기
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
            {isLogin ? (
              <div className="flex relative gap-6">
                <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                  <img
                    className="w-6 cursor-pointer"
                    src={PersonIcon}
                    alt="마이페이지"
                  />
                  <div
                    className={`${
                      isHover ? 'flex' : 'hidden'
                    } absolute w-36 flex-col p-4 gap-4 bg-white border border-buttongray rounded-md`}
                  >
                    <Link to={'/channel/' + loginUserId}>
                      <span className="cursor-pointer hover:text-mainblue">
                        내 채널
                      </span>
                    </Link>
                    <Link to="/temp/list">
                      <span className="cursor-pointer hover:text-mainblue">
                        임시저장 목록
                      </span>
                    </Link>
                    <Link to="/likes">
                      <span className="cursor-pointer hover:text-mainblue">
                        좋아요 목록
                      </span>
                    </Link>
                  </div>
                </div>
                <img
                  className="w-6 cursor-pointer"
                  src={LogoutIcon}
                  alt="로그아웃"
                  onClick={logout}
                />
              </div>
            ) : (
              <Link to="/login">
                <button className="buttonLayout py-3 px-6 text-white bg-mainblue cursor-pointer">
                  로그인
                </button>
              </Link>
            )}
            <MobileMenu
              isMenuOn={isMenuOn}
              setIsMenuOn={setIsMenuOn}
              loginUserId={loginUserId}
            />
          </div>
        </div>
      </header>
    </Fragment>
  );
};
