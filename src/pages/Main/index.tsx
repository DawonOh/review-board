import { useState } from 'react';
import { MobileMenu, CardList } from 'Components';
import ToggleImg from '../../assets/images/toggleDown.png';
import { Link, useLoaderData } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { CategoryType, getCategory } from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';

export const getCategoryQuery = () => ({
  queryKey: ['category'],
  queryFn: ({ signal }: { signal: AbortSignal }) => getCategory({ signal }),
  staleTime: Infinity,
});

export const MainPage = () => {
  const [isToggleOpen, setIsToggleOpen] = useState<boolean | null>(null);
  const [categoryName, setCategoryName] = useState('전체보기');
  const [categoryId, setCategoryId] = useState(0);

  const isLogin = useAppSelector(state => state.login.isLogin);
  const categoryList = useLoaderData() as CategoryType[];

  const handleToggle = () => {
    if (isToggleOpen === false || isToggleOpen === null) {
      setIsToggleOpen(true);
    } else if (isToggleOpen === true) {
      setIsToggleOpen(false);
    }
  };

  const categoryModalClass = () => {
    if (isToggleOpen === null) {
      return 'invisible animate-category-default';
    }
    if (isToggleOpen) {
      return 'visible animate-category-open';
    }
    if (isToggleOpen === false) {
      return 'invisible animate-category-close';
    }
  };

  return (
    <div className="w-full h-full pt-12 relative bg-bg-gray">
      <MobileMenu />
      <div className="flex justify-between w-4/5 py-0 px-8 my-0 mx-auto mt-4">
        <div className="flex gap-4">
          <div
            className="flex justify-between items-center p-1 cursor-pointer"
            onClick={handleToggle}
          >
            {categoryName}
            <img
              className={`w-4 h-4 ml-2 ${
                isToggleOpen && '-rotate-90'
              } duration-500`}
              src={ToggleImg}
              alt="토글버튼"
            />
          </div>
          <ul
            className={`${categoryModalClass()} absolute mt-12 p-4 bg-white border border-buttongray z-50`}
          >
            {categoryList.map((category: CategoryType, idx: number) => {
              return idx !== categoryId ? (
                <li
                  className="p-2 cursor-pointer hover:font-bold"
                  key={category.id}
                  value={category.id}
                  onClick={() => {
                    setCategoryName(category.category);
                    setIsToggleOpen(false);
                    setCategoryId(category.id);
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
                    setIsToggleOpen(true);
                    setCategoryId(category.id);
                  }}
                >
                  {category.category}
                </li>
              );
            })}
          </ul>
          {isLogin && (
            <Link
              to="/writefeed?mode=write"
              state={{ feedId: 0, isModify: false, isTemp: true }}
            >
              <button className="border rounded-md border-mainblue px-3 py-2 bg-white cursor-pointer">
                리뷰쓰기
              </button>
            </Link>
          )}
        </div>
      </div>
      <CardList categoryId={categoryId} />
    </div>
  );
};

export const mainLoader = async () => {
  return queryClient.fetchQuery(getCategoryQuery());
};
