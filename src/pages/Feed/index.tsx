import { Fragment, useEffect, useState } from 'react';
import { MobileMenu, FeedDetail, CommentContainer } from 'Components';
import axios from 'axios';
import { LoaderFunctionArgs, useLoaderData, useParams } from 'react-router-dom';
import { DataType, feedDetailData, queryClient } from 'util/feed-http';
import { useQuery } from '@tanstack/react-query';

export const Feed = () => {
  //로그인 한 유저 Id
  const [loginUserId, setLoginUserId] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = sessionStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
          timeout: 5000,
          headers: { Accept: 'application/json', Authorization: token },
        })
        .then(response => {
          setLoginUserId(response.data.id);
        });
    }
  }, [BACK_PORT, BACK_URL, token]);

  return (
    <Fragment>
      <MobileMenu />
      <div className="w-full h-screen relate my-0 mx-auto pt-8 bg-bg-gray">
        <FeedDetail />
        <CommentContainer loginUserId={loginUserId} />
      </div>
    </Fragment>
  );
};
