import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Join, MainPage, Feed, WriteFeed, TempList } from 'pages';
import GlobalStyles from 'Styles/GlobalStyle';

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/feed/:id" element={<Feed />} />
        <Route path="/writeFeed" element={<WriteFeed />} />
        <Route path="/temp/list" element={<TempList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
