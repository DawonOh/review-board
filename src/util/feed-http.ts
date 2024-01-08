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
const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

// 피드 상세 정보 불러오기
export const feedDetailData = async ({
  feedId,
  signal,
}: {
  feedId: string | undefined;
  signal: AbortSignal;
}): Promise<DataType['result'] | undefined> => {
  try {
    const response = await axios.get<DataType>(
      `${BACK_URL}:${BACK_PORT}/feeds/${feedId}`,
      {
        timeout: 5000,
        signal,
      }
    );
    return response.data.result;
  } catch (error) {
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
