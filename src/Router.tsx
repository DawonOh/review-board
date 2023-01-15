import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Join from 'pages/Join';
import GlobalStyles from 'Styles/GlobalStyle';

const Router = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        <Route path="/join" element={<Join />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
