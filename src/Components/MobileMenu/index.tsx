import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '../../assets/images/person.png';
import { persistor } from 'index';
import { useAppDispatch, useAppSelector } from 'hooks';
import { mobileMenuActions } from 'redux/slice/mobileMenu-slice';

interface MenuProps {
  id: number;
  title: string;
  icon?: string;
  link: string;
}

export const MobileMenu = () => {
  const [menuList, setMenuList] = useState([]);
  const isMenuOn = useAppSelector(state => state.mobileMenu.isMenuOn);
  const isLogin = useAppSelector(state => state.login.isLogin);
  const loginUserId = useAppSelector(state => state.user.id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios.get('/data/mobileMenu.json').then(response => {
      if (isLogin) {
        setMenuList(response.data.menuList);
        return;
      }
      if (!isLogin || isLogin === null) {
        setMenuList(response.data.logoutMenuList);
        return;
      }
    });
  }, [isLogin]);

  const closeMenu = () => {
    dispatch(mobileMenuActions.handleMenuOn());
  };

  const handleLogout = async () => {
    persistor.purge();
    sessionStorage.removeItem('token');
  };
  return (
    <div
      className={`w-full h-full fixed p-12 ${
        isMenuOn ? 'translate-x-0' : '-translate-x-full'
      } duration-500 bg-white border border-buttongray z-50 md:hidden`}
    >
      <h1 className="mb-8 text-xl font-bold">메뉴</h1>
      <ul className="flex flex-col justify-center items-start gap-8 w-11/12">
        {menuList.map((menuItem: MenuProps) => {
          return (
            <Fragment key={menuItem.id}>
              <Link to={menuItem.link}>
                <li
                  className="flexCenterAlign gap-4 text-xl cursor-pointer"
                  onClick={closeMenu}
                >
                  <img
                    className="w-4 h-4"
                    src={menuItem.icon}
                    alt={menuItem.title}
                  />
                  {menuItem.title}
                </li>
              </Link>
            </Fragment>
          );
        })}
        {isLogin ? (
          <>
            <Link to={`/channel/${loginUserId}`}>
              <li className="flexCenterAlign gap-4 text-xl cursor-pointer">
                <img
                  className="w-4 h-4"
                  src={PersonIcon}
                  alt="내 채널 아이콘"
                />
                마이페이지
              </li>
            </Link>
            <button
              className="buttonLayout px-3 py-2 bg-buttongray cursor-pointer"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="buttonLayout px-3 py-2 bg-mainblue text-white cursor-pointer">
              로그인
            </button>
          </Link>
        )}
      </ul>
    </div>
  );
};
