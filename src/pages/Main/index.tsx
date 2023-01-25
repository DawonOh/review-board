import React, { Fragment, useState } from 'react';

import { Button, Login } from 'Components';

export const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <Fragment>
      <Button
        content="로그인"
        backgroundColor="#676FA3"
        color="#fff"
        size="0.8rem 1.5rem"
        onClick={handleModalOpen}
      />
      <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
