import instance from 'api';
import axios from 'axios';

export const getChannelUserInfo = async ({
  userId,
}: {
  userId: string | undefined;
}) => {
  try {
    const response = await instance.get(`/users/userinfo/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface UserFeedType {
  category: string;
  categoryId: number;
  commentCnt: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  filesCnt: string;
  id: number;
  imgCnt: string;
  imgUrl: string;
  likeCnt: string;
  postedAt: string;
  statusId: number;
  title: string;
  updatedAt: string;
  userId: number;
  userNickname: string;
  viewCnt: number;
}

interface UserFeedInfoType {
  feedCntByUserId: number;
  feedListByUserId: UserFeedType[];
  totalPage: number;
}

// 채널 유저 정보 불러오기
export const getChannelFeedInfo = async ({
  userId,
  currPage,
}: {
  userId: string | undefined;
  currPage: number;
}) => {
  try {
    const response = await instance.get<UserFeedInfoType>(
      `/users/userinfo/${userId}/feeds?page=${currPage}&limit=5`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 채널 - 댓글 삭제
interface DeleteChannelCommentPropsType {
  commentId: number;
}
export const deleteChannelComment = async ({
  commentId,
}: DeleteChannelCommentPropsType) => {
  try {
    const response = await instance.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 채널 - 댓글 목록(무한스크롤)
interface UserCommentType {
  commentCntByUserId: number;
  commentListByUserId: UserCommentInfoType[];
  totalScrollCnt: number;
}

interface UserCommentInfoType {
  comment: string;
  created_at: string;
  deleted_at: null | string;
  feed: {
    id: number;
    user: {
      id: number;
    };
  };
  id: number;
  is_private: boolean;
  parent: { id: 65; user: { id: number } };
  updated_at: string;
  user: { id: number };
}
interface GetUserCommentListPropsType {
  isLogin: boolean | null;
  pageParam: number;
  userId: string | undefined;
  signal: AbortSignal;
}
const BACK_URL = process.env.REACT_APP_BACK_URL;
export const getUserCommentList = async ({
  isLogin,
  pageParam,
  userId,
  signal,
}: GetUserCommentListPropsType) => {
  try {
    const response = isLogin
      ? await instance.get<UserCommentType>(
          `/users/userinfo/${userId}/comments?index=${pageParam}&limit=10`
        )
      : await axios.get<UserCommentType>(
          `${BACK_URL}/users/userinfo/${userId}/comments?index=${pageParam}&limit=10`,
          { signal }
        );
    return response.data;
  } catch (error) {
    throw error;
  }
};
