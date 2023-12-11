import { useAppDispatch, useAppSelector } from 'hooks';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { search, searchModalActions } from 'redux/slice/searchModal-slice';

export const SearchModal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  const handleModal = searchModalActions.handleModal;
  const isSearchModalOpen = useAppSelector(state => state.search.isModalOpen);
  const setSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searchModalActions.getSearchWord(e.target.value));
  };
  const searchData = useAppSelector(state => state.search);

  useEffect(() => {
    if (searchData.searchWord.trim() !== '') {
      try {
        setLoading(true);
        const timer = setTimeout(() => {
          dispatch(search(searchData.searchWord));
          setLoading(false);
        }, 500);
        return () => {
          setLoading(false);
          clearTimeout(timer);
        };
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }
  }, [searchData.searchWord, dispatch]);

  useEffect(() => {
    if (searchData.searchWord.trim() === '' || isSearchModalOpen === false) {
      dispatch(searchModalActions.resetSearchModal());
      dispatch(searchModalActions.getSearchWord(''));
    }
  }, [searchData.searchWord, isSearchModalOpen, dispatch]);

  const searchResult = () => {
    if (searchData.searchResult?.length === 0 && !loading) {
      return <div>검색 결과가 없습니다😥</div>;
    }

    if (error) {
      return <div>잠시 후 다시 시도해주세요.</div>;
    }
  };

  return (
    <Fragment>
      {isSearchModalOpen && (
        <div className="hidden md:block">
          <div className="fixed w-full h-screen bg-black/[.1] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 overflow-hidden z-50" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 z-50 w-2/5 h-1/2 bg-white flex flex-col rounded-md p-8">
            <div className="flexCenterAlign w-full mt-4">
              <div className="w-4 h-4 mr-2 bg-[url('./assets/images/search.png')] bg-no-repeat bg-cover" />
              <input
                className="w-4/5 mr-4 p-2.5 border-b focus:outline-none z-50"
                type="search"
                placeholder="검색어를 입력해주세요"
                onChange={e => setSearchWord(e)}
              />
            </div>
            <div
              className=" absolute w-4 h-4 mr-2 bg-[url('./assets/images/close.png')] bg-no-repeat bg-cover cursor-pointer top-8 right-8"
              onClick={() => {
                dispatch(handleModal());
              }}
            />
            <div className="w-full h-80 bg-white">
              <div className="flexCenterAlign flex-col w-full h-full p-4 gap-4 bg-white overflow-y-auto z-50">
                {loading && (
                  <div className="w-8 h-8 bg-[url('./assets/images/loader.png')] bg-no-repeat bg-cover animate-spin" />
                )}
                {searchData.searchResult?.map(item => (
                  <div key={item.id}>
                    <span>{item.titleSnippet}</span>
                    <span>{item.postedAt}</span>
                    <span>{item.contentSnippet}</span>
                  </div>
                ))}
                {searchResult()}
              </div>
              {searchData.searchResult?.length !== 0 && (
                <Link
                  className="flexCenterAlign absolute bottom-8 right-8 text-center cursor-pointer"
                  to={`/search?query=${searchData.searchWord}`}
                >
                  <span>더보기</span>
                  <div className="w-4 h-4 ml-2 bg-[url('./assets/images/toggleDown.png')] rotate-180 bg-no-repeat bg-cover" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
