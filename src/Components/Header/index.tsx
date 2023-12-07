import { useEffect, useState } from 'react';
import { MobileMenu } from 'Components';
import { Link } from 'react-router-dom';
import PersonIcon from '../../assets/images/person.png';
import LogoutIcon from '../../assets/images/logout.png';

import axios from 'axios';
import { useAppSelector } from 'hooks';
import { persistor } from 'index';
interface Props {
  isMenuOn: boolean;
  setIsMenuOn: (isModalOpen: boolean) => void;
}

export const Header = ({ isMenuOn, setIsMenuOn }: Props) => {
  const [isHover, setIsHover] = useState(false);
  const [loginUserId, setLoginUserId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

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

  return (
    <header className="flexCenterAlign sticky h-12 top-0 mb-20 bg-white z-50">
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
        />
        <div className="md:flex hidden justify-between items-center hidden">
          {isLogin ? (
            <div className="flex items-center relative gap-6">
              <button className="flexCenterAlign gap-2 buttonLayout bg-mainblue text-white px-2 py-1">
                검색
                <div className="w-4 h-4 bg-[url('./assets/images/search.png')] bg-no-repeat bg-cover cursor-pointer" />
              </button>
              <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
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
            </div>
          ) : (
            <Link to="/login">
              <button className="cursor-pointer">로그인</button>
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
  );
};
