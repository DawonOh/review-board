import { useState } from 'react';
import { CategoryType } from 'util/feed-http';
import ToggleImg from '../../../assets/images/toggleDown.png';

interface CategoryPropsType {
  categoryList: CategoryType[] | undefined;
  handleSelectChange: (arg: number) => void;
  categoryId: number | undefined;
}

const Category = ({
  categoryList,
  handleSelectChange,
  categoryId,
}: CategoryPropsType) => {
  // 카테고리 오픈 여부
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  // 카테고리 이름
  const [categoryName, setCategoryName] = useState('카테고리 선택');

  // 카테고리 토글 열고 닫기
  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  return (
    <>
      <div
        className="flex justify-between items-center w-48 p-2 bg-white rounded-lg cursor-pointer"
        onClick={handleToggle}
      >
        {categoryName}
        <img
          className={`w-4 h-4 ml-2 ${isToggleOpen && '-rotate-90'}`}
          src={ToggleImg}
          alt="토글버튼"
        />
      </div>
      <ul
        className={`${
          isToggleOpen ? 'block' : 'hidden'
        } w-48 absolute md:top-16 top-12 bg-white border border-bg-gray rounded-md p-8`}
      >
        {categoryList?.map((category: CategoryType, idx: number) => {
          return idx !== categoryId ? (
            <li
              className="p-2 cursor-pointer hover:text-mainblue"
              key={category.id}
              value={category.id}
              onClick={() => {
                setCategoryName(category.category);
                setIsToggleOpen(false);
                handleSelectChange(category.id);
              }}
            >
              {category.category}
            </li>
          ) : (
            <li
              className="p-2 font-bold"
              key={category.id}
              value={category.id}
              onClick={e => {
                setCategoryName(category.category);
                setIsToggleOpen(true);
                handleSelectChange(category.id);
              }}
              // ref={selectRef}
            >
              {category.category}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Category;
