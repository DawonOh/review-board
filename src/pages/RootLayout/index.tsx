import { Header } from 'Components';
import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
