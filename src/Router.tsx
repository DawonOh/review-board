import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Join,
  MainPage,
  Feed,
  WriteFeed,
  TempList,
  SearchPage,
  MyPage,
  ModifyInfoPage,
  Quit,
} from 'pages';
import GlobalStyles from 'Styles/GlobalStyle';

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/feed/:id" element={<Feed />} />
        <Route path="/writefeed" element={<WriteFeed />} />
        <Route path="/temp/list" element={<TempList />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/channel/:id" element={<MyPage />} />
        <Route path="/changeinfo" element={<ModifyInfoPage />} />
        <Route path="/quit" element={<Quit />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
