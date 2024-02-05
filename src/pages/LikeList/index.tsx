import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { LikeListItem, MobileMenu } from 'Components';
import axios from 'axios';
import { flexCenterAlign } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { useAppSelector } from 'hooks';
import instance from 'api';
import { useQuery } from '@tanstack/react-query';
import { UserLikeFeedsType, getLikeList } from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';

const ListContainer = Styled.div`
  ${flexCenterAlign}
  justify-content: center;
  width: 100%;
  padding: 2em;
`;

const Container = Styled.div`
  width: 80%;
`;

const Title = Styled.h1`
  font-size: 1.6em;
  font-weight: 700;
`;

const ListItemContainer = Styled.div`
  width: 100%;
  margin-top: 3em;
`;

const NoDataMessage = Styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`;

const PaginationContainer = Styled.div`
  display: flex;
  justify-content: center;
`;

export const LikeList = () => {
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  let token = sessionStorage.getItem('token');
  let loginUserId = useAppSelector(state => state.user.id);
  let isLogin = useAppSelector(state => state.login.isLogin);

  const { data } = useQuery<
    UserLikeFeedsType[],
    Error,
    UserLikeFeedsType[],
    string[]
  >({
    queryKey: ['userLikeList'],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      getLikeList({ signal, loginUserId, currPage }),
    enabled: isLogin ? true : false,
    staleTime: 1000 * 60 * 2,
  });

  // 응답 성공적으로 잘 받으면 setTotalPage(response.data.totalPage);

  const handleChange = (value: number) => {
    setCurrPage(value);
  };

  const loginLayout = () => {
    if (data?.length !== 0 && token) {
      return data?.map((feed, idx) => {
        return <LikeListItem key={idx} feedData={feed.symbolListByUserId} />;
      });
    }
    if (data?.length === 0 && token) {
      return <NoDataMessage>좋아요를 누른 리뷰가 없습니다.</NoDataMessage>;
    }

    if (!isLogin) {
      return <NoDataMessage>로그인 후 이용해주세요.</NoDataMessage>;
    }
  };

  return (
    <Fragment>
      <MobileMenu />
      <ListContainer>
        <Container>
          <Title>좋아요 목록</Title>
          <ListItemContainer>{loginLayout()}</ListItemContainer>
        </Container>
      </ListContainer>
      {data?.length !== 0 && isLogin && (
        <PaginationContainer>
          <Pagination
            count={totalPage}
            page={currPage}
            onChange={() => handleChange(currPage)}
            size="small"
          />
        </PaginationContainer>
      )}
    </Fragment>
  );
};
