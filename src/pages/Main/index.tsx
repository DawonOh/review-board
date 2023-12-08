import React, { useEffect, useState } from 'react';
import { MobileMenu, CardList } from 'Components';
import ToggleImg from '../../assets/images/toggleDown.png';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import axios from 'axios';

interface CategoryType {
  id: number;
  category: string;
}

export const MainPage = () => {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [isToggleOpen, setIsToggleOpen] = useState('none');
  const [categoryName, setCategoryName] = useState('전체보기');
  const [categoryId, setCategoryId] = useState(0);
  const [countIdx, setCountIdx] = useState(0);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const isLogin = useAppSelector(state => state.login.isLogin);

  useEffect(() => {
    axios.get(`${BACK_URL}:${BACK_PORT}/categories`).then(result => {
      setCategoryList([{ id: 0, category: '전체보기' }, ...result.data]);
    });
  }, [BACK_URL, BACK_PORT]);

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

  const categoryModalClass = () => {
    if (isToggleOpen === 'open') {
      return 'slide-modal-open';
    }

    if (isToggleOpen === 'close') {
      return 'slide-modal-close';
    }

    return 'slide-modal-default';
  };

  return (
    <div className="w-full h-full pt-12 relative bg-bg-gray">
      <MobileMenu />
      <div className="flex justify-between w-4/5 py-0 px-8 my-0 mx-auto mt-4">
        <div className="flex gap-4">
          <div
            className="flex justify-between items-center p-1 cursor-pointer"
            onClick={toggleDown}
          >
            {categoryName}
            <img
              className={`w-4 h-4 ml-2 ${
                isToggleOpen === 'open' && '-rotate-90'
              } duration-500`}
              src={ToggleImg}
              alt="토글버튼"
            />
          </div>
          <ul
            className={`${
              isToggleOpen === 'open' ? 'visible' : 'invisible'
            } absolute mt-12 p-4 bg-white border border-buttongray animate-${categoryModalClass()} z-50`}
          >
            {categoryList.map((category: CategoryType, idx: number) => {
              return idx !== countIdx ? (
                <li
                  className="p-2 cursor-pointer hover:font-bold"
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
                </li>
              ) : (
                <li
                  className="p-2 text-white bg-mainsky rounded-lg"
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
                </li>
              );
            })}
          </ul>
          {isLogin && (
            <Link
              to="/writefeed"
              state={{ feedId: 0, isModify: false, isTemp: true }}
            >
              <button className="border rounded-md border-mainblue px-3 py-2 bg-white cursor-pointer">
                리뷰쓰기
              </button>
            </Link>
          )}
        </div>
      </div>
      <CardList categoryId={categoryId} setIsNotEmpty={setIsNotEmpty} />
      {!isNotEmpty && (
        <div className="w-full h-80 flex flex-col items-center justify-center">
          <div className="w-20 h-20 mb-4 bg-[url('./assets/images/first.png')] bg-no-repeat bg-cover animate-move" />
          <div>리뷰가 없습니다! 첫 리뷰를 작성해주세요😎</div>
        </div>
      )}
    </div>
  );
};
