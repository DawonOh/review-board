import { useState } from 'react';
import { MobileMenu } from 'Components';
import { Link, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks';
import { persistor } from 'index';
import { mobileMenuActions } from 'redux/slice/mobileMenu-slice';
import { SearchModal } from 'Components';
import { searchModalActions } from 'redux/slice/searchModal-slice';

export const Header = () => {
  const [isHover, setIsHover] = useState(false);
  const isMenuOn = useAppSelector(state => state.mobileMenu.isMenuOn);
  const isLogin = useAppSelector(state => state.login.isLogin);
  const loginUserId = useAppSelector(state => state.user.id);
  const dispatch = useAppDispatch();
  const handleMobileMenu = () => {
    dispatch(mobileMenuActions.handleMenuOn());
  };

  const handleLogout = async () => {
    persistor.purge();
    sessionStorage.removeItem('token');
  };

  const handleMouseOver = () => {
    setIsHover(true);
  };

  const handleMouseOut = () => {
    setIsHover(false);
  };

  const handleSearchModal = searchModalActions.handleModal;

  return (
    <>
      <header className="flexCenterAlign sticky h-12 top-0 bg-white z-50">
        <div className="flex justify-between items-center w-4/5 h-full p-8">
          <Link to="/">
            <h1 className="font-sans text-mainblue text-2xl font-bold">
              ALLREVIEW
            </h1>
          </Link>
          <div
            className={`md:hidden block w-5 h-5 ${
              isMenuOn
                ? "bg-[url('./assets/images/close.png')]"
                : "bg-[url('./assets/images/menu.png')]"
            } bg-no-repeat bg-cover cursor-pointer`}
            onClick={handleMobileMenu}
          />
          <div className="md:flex hidden justify-between items-center hidden">
            <div className="flex items-center relative gap-6">
              <button
                className="flexCenterAlign gap-2 buttonLayout bg-mainblue text-white px-2 py-1"
                onClick={() => {
                  dispatch(handleSearchModal());
                }}
              >
                검색
                <div className="w-4 h-4 bg-[url('./assets/images/search.png')] bg-no-repeat bg-cover cursor-pointer" />
              </button>
              {isLogin ? (
                <>
                  <div
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    <span className="cursor-pointer">메뉴</span>
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
                  <span className="cursor-pointer" onClick={handleLogout}>
                    로그아웃
                  </span>
                </>
              ) : (
                <Link to="/login">
                  <button className="cursor-pointer">로그인</button>
                </Link>
              )}
            </div>
            <MobileMenu />
          </div>
        </div>
      </header>
      <SearchModal />
      <Outlet />
    </>
  );
};
