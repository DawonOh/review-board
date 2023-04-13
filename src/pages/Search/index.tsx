import { CardList, Header, MobileMenu } from 'Components';
import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import SearchIcon from '../../assets/images/search.png';
import SearchFailIcon from '../../assets/images/searchFail.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonLayout } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';

const MainContainer = Styled.div`
  width: 100%;
  height: 100%;
  position: relate;
`;

const SearchContainer = Styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  height: 100%;
  padding: 2em;
  margin: 0 auto;
  @media all and (max-width: 1023px) {
    width: 80%;
  }
`;

const SearchInput = Styled.input`
  width: 20em;
  padding: 0.5em;
  border: 1px solid #e2e2e2;
  border-radius: 0.3em;
  outline: none;
`;

const SearchImg = Styled.div`
  width: 1.3em;
  height: 1.3em;
  margin-right: 1em;
  background: url(${SearchIcon});
  background-repeat: no-repeat;
	background-size: cover;
`;

const SearchButton = Styled.button`
  ${ButtonLayout}
  padding: 0.4em;
  margin-left: 1em;
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

const SearchFail = Styled.div`
  width: 5em;
  height: 5em;
  margin-bottom: 1em;
  background: url(${SearchFailIcon});
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

export const SearchPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [queryValue, setQueryValue] = useState<string>('');
  const [isNotEmpty, setIsNotEmpty] = useState(false);
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
    <MainContainer>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <SearchContainer>
        <SearchImg />
        <SearchInput
          type="search"
          placeholder="검색어를 입력해주세요."
          defaultValue={queryValue ? queryValue : ''}
          onKeyUp={search}
          onChange={e => setSearchValue(e.target.value)}
        />
        <SearchButton onClick={() => searchClick()}>검색</SearchButton>
      </SearchContainer>
      <CardList setIsNotEmpty={setIsNotEmpty} />
      {!isNotEmpty && (
        <NoResults>
          <SearchFail />
          <div>검색 결과가 없습니다.</div>
        </NoResults>
      )}
    </MainContainer>
  );
};