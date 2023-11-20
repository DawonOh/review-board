import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
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
  Join,
} from 'pages';

const router = createBrowserRouter([
  { path: '/join', element: <Join /> },
  { path: '/', element: <MainPage /> },
  { path: '/feed/:id', element: <Feed /> },
  { path: '/writefeed', element: <WriteFeed /> },
  { path: '/temp/list', element: <TempList /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/channel/:id', element: <MyPage /> },
  { path: '/changeinfo', element: <ModifyInfoPage /> },
  { path: '/quit', element: <Quit /> },
  { path: '/changepw', element: <ModifyPw /> },
  { path: '/findpw', element: <FindPw /> },
  { path: '/likes', element: <LikeList /> },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
