import { useAppDispatch, useAppSelector } from 'hooks';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { searchModalActions } from 'redux/slice/searchModal-slice';

export const SearchModal = () => {
  const dispatch = useAppDispatch();
  const handleModal = searchModalActions.handleModal;
  const isSearchModalOpen = useAppSelector(state => state.search.isModalOpen);
  return (
    <Fragment>
      {isSearchModalOpen && (
        <>
          <div className="fixed w-full h-screen bg-black/[.1] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 overflow-hidden z-50" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 z-50 w-2/5 h-1/2 bg-white flexCenterAlign flex-col rounded-md p-8">
            <div className="flexCenterAlign w-full mt-4">
              <div className="w-4 h-4 mr-2 bg-[url('./assets/images/search.png')] bg-no-repeat bg-cover" />
              <input
                className="w-4/5 mr-4 p-2.5 border-b focus:outline-none z-50"
                type="search"
                placeholder="검색어를 입력해주세요"
              />
            </div>
            <div
              className=" absolute w-4 h-4 mr-2 bg-[url('./assets/images/close.png')] bg-no-repeat bg-cover cursor-pointer top-8 right-8"
              onClick={() => {
                dispatch(handleModal());
              }}
            />
            <div className="w-full h-full p-4 bg-white">
              <div className="flex flex-col w-full max-h-96 p-4 gap-4 bg-white overflow-y-auto z-50" />
              <Link
                className="flexCenterAlign absolute bottom-8 right-8  text-center cursor-pointer"
                to={"/search?query=''"}
              >
                <span>더보기</span>
                <div className="w-4 h-4 ml-2 bg-[url('./assets/images/toggleDown.png')] rotate-180 bg-no-repeat bg-cover" />
              </Link>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};
