import instance from 'api';

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
