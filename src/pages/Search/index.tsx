import { CardList, MobileMenu } from 'Components';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const SearchPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [queryValue, setQueryValue] = useState<string>('');
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let query = params.get('query');
  useEffect(() => {
    if (query) setQueryValue(query);
  }, [query]);

  const navigate = useNavigate();

  const searchClick = () => {
    if (searchValue.trim() !== '') {
      let url = `/search?query=${searchValue}`;
      navigate(url);
      window.location.reload();
    } else {
      return;
    }
  };

  const search = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if ((e as React.KeyboardEvent).key === 'Enter') {
      searchClick();
    }
  };

  return (
    <div className="w-full h-full reletive">
      <MobileMenu />
      <div className="flex items-center w-4/5 h-full p-4 mx-auto my-0 gap-2">
        <div className="md:block hidden w-5 h-5 bg-[url('./assets/images/search.png')] bg-no-repeat bg-cover" />
        <input
          className="md:w-80 w-68 p-2 border-none rounded-lg outline-none"
          type="search"
          placeholder="검색어를 입력해주세요."
          defaultValue={queryValue ? queryValue : ''}
          onKeyUp={search}
          onChange={e => setSearchValue(e.target.value)}
        />
        <button
          className="py-2 px-4 bg-buttongray rounded-lg cursor-pointer"
          onClick={() => searchClick()}
        >
          검색
        </button>
      </div>
      <CardList categoryId={0} isSearch={true} />
    </div>
  );
};
