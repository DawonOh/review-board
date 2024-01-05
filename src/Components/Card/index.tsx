import { useEffect, useState, forwardRef, ForwardedRef } from 'react';

import LikeIconImg from '../../assets/images/likeCountBlack.png';
import LikeClickIconImg from '../../assets/images/likeCountClick.png';
import CommentIconImg from '../../assets/images/comment.png';
import Clip from '../../assets/images/clip.png';
import ViewIconImg from '../../assets/images/view.png';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import instance from 'api';

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
  }: Props,
  ref: ForwardedRef<HTMLDivElement> | null
) => {
  const [isHaveThumbnail, setIsHaveThumbnail] = useState(false);
  const [isLike, setIsLike] = useState(false);
  useEffect(() => {
    if (img) {
      setIsHaveThumbnail(true);
    } else {
      setIsHaveThumbnail(false);
    }
  }, [img]);

  let isLogin = useAppSelector(state => state.login.isLogin);
  useEffect(() => {
    if (isLogin) {
      instance
        .get<LoginLikeType>(`/symbols/check/${id}`)
        .then(response => {
          setIsLike(response.data.checkValue);
        })
        .catch(() => {
          alert('잠시 후 다시 시도해주세요.');
        });
    }
  }, [id, isLogin]);

  const createAtDate = createdAt.slice(0, -8);
  return (
    <Link to={'/feed/' + id}>
      <div
        className="h-[25rem] p-4 cursor-pointer bg-white hover:-translate-y-0.5 hover:duration-300 [&:not(:hover)]:translate-y-0.5 [&:not(:hover)]:duration-300 rounded-md shadow-md shadow-buttongray"
        ref={ref}
      >
        <div className="inline-block py-1 px-4 bg-mainsky text-sm rounded-md">
          {category}
        </div>
        <div className="flex justify-between items-center w-full my-0 mx-auto py-2 gap-4">
          <h1 className="block text-xl font-bold overflow-hidden whitespace-nowrap text-ellipsis">
            {title}
          </h1>
          {file !== '0' && <img className="w-5" src={Clip} alt="첨부파일" />}
        </div>
        {img && (
          <img
            className="w-full h-32 my-0 mx-auto object-cover"
            src={img}
            alt={title}
          />
        )}
        <div
          className={`w-full my-0 mx-autoleading-6 break-words ${
            isHaveThumbnail ? 'line-clamp-4' : 'line-clamp-6'
          }`}
        >
          {content}
        </div>
        <div className="flex justify-start items-center">
          <div className="flex items-center h-10 mt-2 absolute bottom-8">
            <img
              className="w-5"
              src={isLike ? LikeClickIconImg : LikeIconImg}
              alt="좋아요 아이콘"
            />
            <span className="mx-0 ml-1 mr-4">{likeCount}</span>
            <img className="w-5" src={CommentIconImg} alt="댓글 아이콘" />
            <span className="mx-0 ml-1 mr-4">{commentCount}</span>
            <img className="w-5" src={ViewIconImg} alt="조회수 아이콘" />
            <span className="mx-0 ml-1 mr-4">{viewCnt}</span>
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center h-10 mt-2 absolute bottom-1">
          <span className="text-sm text-buttongray ">{createAtDate}</span>
          {nickName && <span className="text-sm font-bold">by {nickName}</span>}
        </div>
      </div>
    </Link>
  );
};

export default forwardRef(Card);
