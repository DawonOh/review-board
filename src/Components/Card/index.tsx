import React, { useEffect, useState, forwardRef, ForwardedRef } from 'react';
import Styled from 'styled-components';

import HeartIconImg from '../../assets/images/heart.png';
import LikeIconImg from '../../assets/images/like.png';
import CommentIconImg from '../../assets/images/comment.png';
import Clip from '../../assets/images/clip.png';
import ViewIconImg from '../../assets/images/view.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CardContainer = Styled.div<{ ref?: ForwardedRef<HTMLDivElement> | null }>`
  border: 1px solid #EBEBEB;
  border-radius: 4px;
  padding: 1em;
  cursor: pointer;
`;

const Thumbnail = Styled.img`
  width: 100%;
  height: 8em;
  margin: 0 auto;
  object-fit: cover;
`;

const Title = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 1em;
  gap: 1em;
`;

const TitleText = Styled.h1`
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
`;

const Category = Styled.div`
  display: inline-block;
  padding: 0.3em 1em;
  background-color: #CDDEFF;
  color: #fff;
  font-size: 0.85em;
  border-radius: 5px;
`;

const Content = Styled.div<{ isHaveThumbnail: boolean }>`
  display: -webkit-box;
  width: 100%;
  height: ${props => (props.isHaveThumbnail ? '7em' : '15em')};
  margin: 0 auto;
  padding: 1em;
  line-height: 1.55em;
  word-wrap: break-word;
  -webkit-line-clamp: ${props => (props.isHaveThumbnail ? '4' : '9')};
  -webkit-box-orient:vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Icons = Styled.div`
  display: flex;
  align-items: center;
  height: 2.5em;
  margin-top: 0.5em;
  padding: 1em;
`;

const Icon = Styled.img`
  width: 1.3em;
`;

const Counts = Styled.span`
  margin: 0 1em 0 0.1em;
`;
const UnderBar = Styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NickName = Styled.span`
  font-size: 0.9em;
  font-weight: 700;
`;

const Date = Styled.span`
  font-size: 0.8em;
  color: #D3D3D3;
  margin-top: 0.2em;
  margin-right: 0.3em;
`;
interface Props {
  id: number;
  title: string;
  category: string;
  file: string;
  img?: string;
  content: string;
  likeCount: string;
  commentCount: string;
  nickName?: string;
  createdAt: string;
  viewCnt: number;
  updatedAt?: string;
  postedAt?: string;
  deletedAt?: string | null;
  statusId?: number;
}

interface LoginLikeType {
  checkValue: boolean;
  result: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user: number;
    feed: number;
    symbol: number;
  };
}

const Card = (
  {
    id,
    title,
    category,
    file,
    img,
    content,
    likeCount,
    commentCount,
    nickName,
    createdAt,
    viewCnt,
    updatedAt,
    postedAt,
    deletedAt,
    statusId,
  }: Props,
  ref: ForwardedRef<HTMLDivElement> | null
) => {
  const [isHaveThumbnail, setIsHaveThumbnail] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;
  useEffect(() => {
    if (img) {
      setIsHaveThumbnail(true);
    } else {
      setIsHaveThumbnail(false);
    }
  }, [img]);

  let token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      axios
        .get<LoginLikeType>(`${BACK_URL}:${BACK_PORT}/symbols/check/${id}`, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          setIsLike(response.data.checkValue);
        })
        .catch(() => {
          alert('잠시 후 다시 시도해주세요.');
        });
    }
  }, []);

  const createAtDate = createdAt.slice(0, -8);
  return (
    <Link to={'/feed/' + id}>
      <CardContainer ref={ref}>
        <Category>{category}</Category>
        <Title>
          <TitleText>{title}</TitleText>
          {file !== '0' && <Icon src={Clip} alt="첨부파일" />}
        </Title>
        {img && <Thumbnail src={img} alt={title} />}
        <Content isHaveThumbnail={isHaveThumbnail}>{content}</Content>
        <UnderBar>
          <Icons>
            <Icon
              src={isLike ? LikeIconImg : HeartIconImg}
              alt="좋아요 아이콘"
            />
            <Counts>{likeCount}</Counts>
            <Icon src={CommentIconImg} alt="댓글 아이콘" />
            <Counts>{commentCount}</Counts>
            <Icon src={ViewIconImg} alt="조회수 아이콘" />
            <Counts>{viewCnt}</Counts>
          </Icons>
        </UnderBar>
        <Icons>
          <Date>{createAtDate}</Date>
          {nickName && <NickName>by {nickName}</NickName>}
        </Icons>
      </CardContainer>
    </Link>
  );
};

export default forwardRef(Card);
