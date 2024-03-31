import { QueryClient } from '@tanstack/react-query';
import instance from 'api';
import axios from 'axios';
import { json } from 'react-router-dom';

export const queryClient = new QueryClient();

export interface DataType {
  result: {
    category: { id: number; category: string };
    content: string;
    created_at: string;
    estimation: { estimation: string; id: number };
    id: number;
    posted_at: string;
    status: {
      id: number;
      is_status: string;
    };
    title: string;
    updated_at: string;
    uploadFiles: [
      {
        id: number;
        is_img: boolean;
        file_link: string;
        file_name: string;
        file_size: string;
      }
    ];
    length: number;
    user: {
      id: number;
      nickname: string;
    };
    viewCnt: number;
  };
}

const BACK_URL = process.env.REACT_APP_BACK_URL;

// 피드 상세 정보 불러오기
export const feedDetailData = async ({
  feedId,
  signal,
}: {
  feedId: string | undefined;
  signal: AbortSignal;
}): Promise<DataType['result'] | undefined> => {
  try {
    const response = await axios.get<DataType>(`${BACK_URL}/feeds/${feedId}`, {
      timeout: 5000,
      signal,
    });
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw json(
          {
            message: '페이지를 찾을 수 없습니다.',
          },
          { status: 404 }
        );
      }
    }
    throw json(
      { message: '정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
};

interface SymbolType {
  message: string;
  result: [{ count: number; feedId: number; symbol: string; symbolId: number }];
}

export interface LikeType {
  count: number;
  feedId: number;
  symbol: string;
  symbolId: number;
}

// 피드 좋아요 정보 불러오기
export const getFeedLike = async ({
  feedId,
  signal,
}: {
  feedId: string | undefined;
  signal: AbortSignal;
}) => {
  try {
    const response = await axios.get<LikeType[]>(
      `${BACK_URL}/symbols/${feedId}`,
      {
        timeout: 5000,
        signal,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 피드 좋아요 요청
export const sendLike = async ({ feedId }: { feedId: string | undefined }) => {
  try {
    const response = await instance.post<SymbolType>(`/symbols/${feedId}`, {
      symbolId: 1,
    });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

// 피드 좋아요 삭제
export const deleteLike = async ({
  feedId,
}: {
  feedId: string | undefined;
}) => {
  try {
    const response = await instance.delete<SymbolType>(`/symbols/${feedId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 피드 전체 댓글 불러오기
export const feedComments = async ({
  feedId,
  token,
  signal,
}: {
  feedId: string | undefined;
  token: string | null | undefined;
  signal: AbortSignal;
}) => {
  try {
    if (token === null || token === undefined) {
      const response = await axios.get(`${BACK_URL}/comments/${feedId}`, {
        timeout: 5000,
        signal,
      });
      return response.data;
    }
    const response = await instance.get(`/comments/${feedId}`);
    return response.data;
  } catch (error) {
    throw json(
      { message: '정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
};

// 피드 댓글, 대댓글 작성
export const sendComment = async ({
  feed,
  mainCommentText,
  isPrivate,
  parentId,
  isChildren,
}: {
  feed: number;
  mainCommentText: string | undefined;
  isPrivate: boolean;
  parentId?: number | undefined;
  isChildren: boolean;
}) => {
  try {
    let bodyObj = {
      feed,
      comment: mainCommentText,
      is_private: isPrivate,
      ...(isChildren && { parent: parentId }),
    };
    const response = await instance.post('/comments', bodyObj);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글, 대댓글 수정
export const modifyComment = async ({
  commentId,
  mainCommentText,
  isPrivate,
}: {
  commentId: number | undefined;
  mainCommentText: string | undefined;
  isPrivate: boolean;
}) => {
  try {
    const response = await instance.patch('/comments', {
      commentId,
      comment: mainCommentText,
      is_private: isPrivate,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글, 대댓글 삭제
export const deleteComment = async ({
  commentId,
}: {
  commentId: number | undefined;
}) => {
  try {
    const response = await instance.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
