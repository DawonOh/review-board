import axios from 'axios';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

interface SearchListType {
  id: number;
  postedAt: string;
  titleSnippet: string;
  contentSnippet: string;
}

export const SearchModal = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchList, setSearchList] = useState<SearchListType[]>([]);
  const [loading, setLoading] = useState(true);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const location = useLocation();
  const pathname = location.pathname;

  const SearchDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeClickOutside = (e: any) => {
      if (
        SearchDivRef.current &&
        !SearchDivRef.current.contains(e.target as Node)
      ) {
        setSearchValue('');
      }
    };
    document.addEventListener('click', closeClickOutside);
    return () => {
      document.removeEventListener('click', closeClickOutside);
    };
  }, [SearchDivRef]);

  useEffect(() => {
    if (searchValue.trim() !== '') {
      const timer = setTimeout(() => {
        axios
          .get<SearchListType[]>(
            `${BACK_URL}:${BACK_PORT}/search?query=${searchValue}`,
            { timeout: 5000 }
          )
          .then(response => {
            setSearchList(response.data);
            setLoading(false);
          });
      }, 500);
      return () => clearTimeout(timer);
    }
    if (searchValue.trim() === '') {
      setSearchList([]);
      setLoading(true);
    }
  }, [searchValue]);

  const showResult = (searchList: SearchListType[]) => {
    if (!loading && searchList.length !== 0) {
      return searchList.map(result => {
        return (
          <Link key={result.id} to={'/feed/' + result.id}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="w-32 font-bold">
                  {result.titleSnippet ? result.titleSnippet : '-'}
                </div>
                <div className="w-24 text-sm text-buttongray">
                  {result.postedAt && result.postedAt.slice(0, -8)}
                </div>
              </div>
              <div className="w-48 min-h-[2.5rem]">
                {result.contentSnippet ? result.contentSnippet : '-'}
              </div>
            </div>
          </Link>
        );
      });
    }
    if (!loading && searchList.length === 0) {
      return <div className="text-center">검색 결과가 없습니다😥</div>;
    }
  };

  const getSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const navigate = useNavigate();

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchValue.trim() !== '' && e.key === 'Enter') {
      let url = `/search?query=${searchValue}`;
      navigate(url);
    }
  };

  return (
    <Fragment>
      {searchValue.trim() !== '' && (
        <div className="fixed w-full h-screen bg-black/[.1] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 overflow-hidden z-50" />
      )}
      {pathname !== '/search' && (
        <div ref={SearchDivRef}>
          <input
            className="w-80 mr-4 p-2.5 border border-buttongray rounded-md focus:outline-none z-50"
            type="search"
            placeholder="검색어를 입력해주세요"
            onChange={e => getSearchValue(e)}
            onKeyUp={search}
          />
          {searchValue && (
            <div className="absolute w-80 p-4 bg-white border border-buttongray rounded-md z-50">
              <div className="flex flex-col w-full max-h-96 p-4 gap-4 bg-white overflow-y-auto z-50">
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  showResult(searchList)
                )}
              </div>
              <Link to={'/search?query=' + searchValue}>
                <div className="w-full h-4 mt-1.5 text-center cursor-pointer">
                  더보기
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};
