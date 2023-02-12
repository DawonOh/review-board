import React, { useEffect, useRef, useState } from 'react';

import { Header, MobileMenu, CardList } from 'Components';
import Styled from 'styled-components';
import ToggleImg from '../../assets/images/toggleDown.png';

const MainContainer = Styled.div`
  width: 100%;
  height: 100%;
  position: relate;
`;
const CategoryContainer = Styled.div`
  display: flex;
  width: 80%;
  padding: 0 2em;
  margin: 0 auto;
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
  margin-top: 2em;
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
      margin-top: 2em;
      opacity: 1;
    }
  }

  @keyframes slide-modal-close {
    from {
      visibility: visible;
      margin-top: 2em;
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
  useEffect(() => {
    fetch('/data/category.json')
      .then(res => res.json())
      .then(json => {
        setCategoryList([{ id: 0, category: '전체보기' }, ...json]);
      });
  }, []);
  const ref = useRef(null);
  const testClick = (e: React.MouseEvent) => {
    console.log(e.target);
  };

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
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <CategoryContainer ref={ref} onClick={testClick}>
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
      </CategoryContainer>
      <CardList />
    </MainContainer>
  );
};
