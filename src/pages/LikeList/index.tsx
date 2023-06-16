import React, { Fragment, useEffect, useState } from 'react';
import Styled from 'styled-components';
import { Header, MobileMenu } from 'Components';
import axios from 'axios';
import { flexCenterAlign } from 'Styles/CommonStyle';
import { Link } from 'react-router-dom';
import { Pagination } from '@mui/material';

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

const ListItem = Styled.div`
  width: 100%;
  padding: 1em;
  border-bottom: 1px solid #DBDBDB;
  cursor: pointer;
`;

const FeedTitleDiv = Styled.div`
  font-size: 1.2em;
  font-weight: 700;
  &:hover {
    color: #676FA3;
  }
`;

const ButtonDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
`;

const CreatedAtDiv = Styled.div`
  font-size: 0.9em;
  color: #BDBDBD;
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

interface UserInfoType {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  nickname: string;
  updated_at: string;
}

interface UserLikeFeedsType {
  symbolCntByUserId: number;
  symbolListByUserId: symbolListType[];
  totalPage: number;
}

interface symbolListType {
  created_at: string;
  feed: {
    id: number;
    user: { id: number; nickname: string };
    title: string;
  };
  symbol: { id: number; symbol: string };
  updated_at: string;
}

export const LikeList = () => {
  const [isMenuOn, setIsMenuOn] = useState(false);
  const [loginUserId, setLoginUserId] = useState(0);
  const [likeFeedList, setLikeFeedList] = useState<symbolListType[]>();
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  let token = localStorage.getItem('token');
  useEffect(() => {
    axios
      .get<UserInfoType>(`${BACK_URL}:${BACK_PORT}/users/userinfo`, {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      })
      .then(response => {
        setLoginUserId(response.data.id);
      });
  }, []);

  useEffect(() => {
    if (loginUserId !== 0) {
      axios
        .get<UserLikeFeedsType>(
          `${BACK_URL}:${BACK_PORT}/users/userinfo/${loginUserId}/symbols?page=${currPage}&limit=8`,
          {
            timeout: 5000,
            headers: { Accept: 'application/json', Authorization: token },
          }
        )
        .then(response => {
          setLikeFeedList(response.data.symbolListByUserId);
          setTotalPage(response.data.totalPage);
        });
    }
  }, [loginUserId, currPage]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrPage(value);
  };

  return (
    <Fragment>
      <Header isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      <MobileMenu
        isMenuOn={isMenuOn}
        setIsMenuOn={setIsMenuOn}
        loginUserId={loginUserId}
      />
      <ListContainer>
        <Container>
          <Title>좋아요 목록</Title>
          <ListItemContainer>
            {likeFeedList?.length !== 0 ? (
              likeFeedList?.map(feed => {
                return (
                  <ListItem key={feed.feed.id}>
                    <Link to={`/feed/${feed.feed.id}`}>
                      <FeedTitleDiv>{feed.feed.title}</FeedTitleDiv>
                    </Link>
                    <ButtonDiv>
                      <CreatedAtDiv>
                        {feed.created_at.slice(0, 10)}
                      </CreatedAtDiv>
                    </ButtonDiv>
                  </ListItem>
                );
              })
            ) : (
              <NoDataMessage>좋아요를 누른 리뷰가 없습니다.</NoDataMessage>
            )}
          </ListItemContainer>
        </Container>
      </ListContainer>
      {likeFeedList?.length !== 0 && (
        <PaginationContainer>
          <Pagination
            count={totalPage}
            page={currPage}
            onChange={handleChange}
            size="small"
          />
        </PaginationContainer>
      )}
    </Fragment>
  );
};
