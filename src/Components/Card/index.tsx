import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';

import HeartIconImg from '../../assets/images/heart.png';
import LikeIconImg from '../../assets/images/like.png';
import CommentIconImg from '../../assets/images/comment.png';
import Clip from '../../assets/images/clip.png';
import { Link } from 'react-router-dom';

const CardContainer = Styled.div`
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
  width: 1.5em;
`;

const Counts = Styled.span`
  margin: 0 1em 0 0.3em;
`;
const UnderBar = Styled.div`
  display: flex;
  justify-content: space-between;
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
  isLike: boolean;
  likeCount: string;
  commentCount: string;
  nickName?: string;
  createdAt: string;
}

export const Card = ({
  id,
  title,
  category,
  file,
  img,
  content,
  isLike,
  likeCount,
  commentCount,
  nickName,
  createdAt,
}: Props) => {
  const [isHaveThumbnail, setIsHaveThumbnail] = useState(false);
  useEffect(() => {
    if (img) {
      setIsHaveThumbnail(true);
    } else {
      setIsHaveThumbnail(false);
    }
  }, [img]);

  const createAtDate = createdAt.slice(0, -6);
  return (
    <Link to={'/feed/' + id}>
      <CardContainer>
        <Category>{category}</Category>
        <Title>
          <TitleText>{title}</TitleText>
          {file !== '0' && <Icon src={Clip} alt="첨부파일" />}
        </Title>
        {img && <Thumbnail src={img} alt={title} />}
        <Content isHaveThumbnail={isHaveThumbnail}>{content}</Content>
        <UnderBar>
          <Icons>
            <Icon src={isLike ? LikeIconImg : HeartIconImg} alt="좋아요" />
            <Counts>{likeCount}</Counts>
            <Icon src={CommentIconImg} alt="댓글" />
            <Counts>{commentCount}</Counts>
          </Icons>
          <Icons>
            <Date>{createAtDate}</Date>
            {nickName && <NickName>{nickName}</NickName>}
          </Icons>
        </UnderBar>
      </CardContainer>
    </Link>
  );
};
