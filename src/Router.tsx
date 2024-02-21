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
  Login,
  RootLayout,
  ErrorPage,
  feedLoader,
  feedWriteLoader,
  mainLoader,
  tempListLoader,
} from 'pages';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'util/feedDetail-http';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { feedFormAction } from 'Components/FeedCRUD/FeedForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage />, loader: mainLoader },
      {
        path: '/writefeed',
        element: <WriteFeed />,
        loader: feedWriteLoader,
        action: feedFormAction,
      },
      { path: '/temp/list', element: <TempList />, loader: tempListLoader },
      { path: '/search', element: <SearchPage /> },
      { path: '/quit', element: <Quit /> },
      { path: '/channel/:id', element: <MyPage /> },
      { path: '/changepw', element: <ModifyPw /> },
      { path: '/changeinfo', element: <ModifyInfoPage /> },
      { path: '/likes', element: <LikeList /> },
      { path: '/feed/:id', element: <Feed />, loader: feedLoader },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/join', element: <Join /> },
  { path: '/findpw', element: <FindPw /> },
]);

const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};

export default Router;
