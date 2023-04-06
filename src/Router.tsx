import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Join, MainPage, Feed, WriteFeed } from 'pages';
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
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
