import { CardList, Header, MobileMenu } from 'Components';
import React, { useState } from 'react';
import Styled from 'styled-components';
import SearchIcon from '../../assets/images/search.png';
import { useLocation } from 'react-router-dom';

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

export const SearchPage = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let query = params.get('query');
  return (
    <MainContainer>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <SearchContainer>
        <SearchImg />
        <SearchInput
          type="search"
          placeholder="검색어를 입력하세요"
          defaultValue={query ? query : ''}
        />
      </SearchContainer>
      <CardList query={query} />
    </MainContainer>
  );
};
