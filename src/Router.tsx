import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Join, MainPage, Feed } from 'pages';
import GlobalStyles from 'Styles/GlobalStyle';

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/feed/:id" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
