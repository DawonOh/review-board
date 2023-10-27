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
  ModifyPw,
  FindPw,
  LikeList,
} from 'pages';

const Router = () => {
  return (
    <BrowserRouter>
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
        <Route path="/changepw" element={<ModifyPw />} />
        <Route path="/findpw" element={<FindPw />} />
        <Route path="/likes" element={<LikeList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
