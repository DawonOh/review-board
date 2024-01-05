import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';

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
    throw error;
  }
};
