import React, { useEffect, useState } from 'react';

import { Header, MobileMenu, CardList } from 'Components';
import { ButtonLayout } from 'Styles/CommonStyle';
import Styled from 'styled-components';
import ToggleImg from '../../assets/images/toggleDown.png';
import FirstIcon from '../../assets/images/first.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MainContainer = Styled.div`
  width: 100%;
  height: 100%;
  position: relate;
`;
const CategoryContainer = Styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  padding: 0 2em;
  margin: 0 auto;
  margin-top: 1em;
`;

const CategoryButton = Styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.2em;
  cursor: pointer;
`;
const ToggleButton = Styled.img<{ isToggleOpen: string }>`
  width: 1em;
  margin-left: 0.5em;
  transform: ${props => props.isToggleOpen === 'open' && 'rotateZ(-60deg)'};
  transition: transform 0.5s;
`;

const CategorySelectBox = Styled.ul<{ isToggleOpen: string }>`
  visibility: ${props =>
    props.isToggleOpen === 'open' ? 'visible' : 'hidden'};
  position: absolute;
  margin-top: 1em;
  padding: 1em;
  background-color: #fff;
  border: 1px solid #EDEDED;
  animation-name: ${props =>
    props.isToggleOpen === 'open'
      ? 'slide-modal-open'
      : props.isToggleOpen === 'close'
      ? 'slide-modal-close'
      : 'slide-modal-default'};
  animation-duration: 500ms;

  @keyframes slide-modal-open {
    from {
      visibility: hidden;
      margin-top: 0;
      opacity: 0;
    }
    50% {
      visibility:visible;
    }
    to{
      visibility: visible;
      margin-top: 1em;
      opacity: 1;
    }
  }

  @keyframes slide-modal-close {
    from {
      visibility: visible;
      margin-top: 1em;
      opacity: 1;
    }
    50% {
      visibility:visible;
    }
    to{
      visibility: hidden;
      margin-top: 0;
      opacity: 0;
    }
  }

  @keyframes slide-modal-default {
    0% {
      display: none;
    }
    100% {
      display: none;
    }
  }
  z-index: 999;
`;

const CategoryItem = Styled.li`
  padding: 0.5em;
  cursor: pointer;
  &:hover {
    font-weight: 700;
  }
`;

const ActiveItem = Styled.li`
  padding: 0.5em;
  color: #fff;
  background-color: #CDDEFF;
  border-radius: 8px;
`;

const GotoWriteButton = Styled.button`
  ${ButtonLayout}
  padding: 0.5em;
  background-color: #fff;
  color: #676FA3;
  border: 1px solid #676FA3;
  cursor: pointer;
`;

const NoResults = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`;

const NoDataImg = Styled.div`
  width: 5em;
  height: 5em;
  margin-bottom: 1em;
  background: url(${FirstIcon});
  background-repeat: no-repeat;
  background-size: cover;
  animation-name: move;
  animation-duration: 1s;
  animation-direction: alternate-reverse;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  @keyframes move {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(0.5em);
    }
    0% {
      transform: translateY(0px);
    }
`;

interface CategoryType {
  id: number;
  category: string;
}

export const MainPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [isToggleOpen, setIsToggleOpen] = useState('none');
  const [categoryName, setCategoryName] = useState('전체보기');
  const [categoryId, setCategoryId] = useState(0);
  const [countIdx, setCountIdx] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const [loginUserId, setLoginUserId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const token = localStorage.getItem('token');
  useEffect(() => {
    token && setIsLogin(true);
    !token && setIsLogin(false);
  }, []);

  useEffect(() => {
    fetch(`${BACK_URL}:${BACK_PORT}/categories`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        setCategoryList([{ id: 0, category: '전체보기' }, ...json]);
      });
  }, []);

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

  const toggleDown = () => {
    if (isToggleOpen === 'close' || isToggleOpen === 'none') {
      setIsToggleOpen('open');
    } else if (isToggleOpen === 'open') {
      setIsToggleOpen('close');
    }
  };
  const handleClickIndex = (e: React.MouseEvent, idx: number) => {
    setCountIdx(idx);
  };
  return (
    <MainContainer>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu
        isMenuOn={isMenuOn}
        setIsMenuOn={setIsMenuOn}
        loginUserId={loginUserId}
      />
      <CategoryContainer>
        <div>
          <CategoryButton onClick={toggleDown}>
            {categoryName}
            <ToggleButton
              src={ToggleImg}
              alt="토글버튼"
              isToggleOpen={isToggleOpen}
            />
          </CategoryButton>
          <CategorySelectBox isToggleOpen={isToggleOpen}>
            {categoryList.map((category: CategoryType, idx: number) => {
              return idx !== countIdx ? (
                <CategoryItem
                  key={category.id}
                  value={category.id}
                  onClick={e => {
                    setCategoryName(category.category);
                    setIsToggleOpen('close');
                    setCategoryId(category.id);
                    handleClickIndex(e, idx);
                  }}
                >
                  {category.category}
                </CategoryItem>
              ) : (
                <ActiveItem
                  key={category.id}
                  value={category.id}
                  onClick={e => {
                    setCategoryName(category.category);
                    setIsToggleOpen('open');
                    setCategoryId(category.id);
                    handleClickIndex(e, idx);
                  }}
                >
                  {category.category}
                </ActiveItem>
              );
            })}
          </CategorySelectBox>
        </div>
        {isLogin && (
          <Link
            to="/writefeed"
            state={{ feedId: 0, isModify: false, isTemp: true }}
          >
            <GotoWriteButton>리뷰쓰기</GotoWriteButton>
          </Link>
        )}
      </CategoryContainer>
      <CardList categoryId={categoryId} setIsNotEmpty={setIsNotEmpty} />
      {!isNotEmpty && (
        <NoResults>
          <NoDataImg />
          <div>리뷰가 없습니다! 첫 리뷰를 작성해주세요😎</div>
        </NoResults>
      )}
    </MainContainer>
  );
};
