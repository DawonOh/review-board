import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './user-slice';
import { PURGE } from 'redux-persist';
import axios from 'axios';

interface LoginType {
  isLogin: boolean | null;
}

interface LoginResultType {
  message: string;
  result?: {
    token: string;
  };
}

const initialLoginState: LoginType = {
  isLogin: null,
};

const BACK_URL = process.env.REACT_APP_BACK_URL;

export const login = createAsyncThunk(
  'loginSlice/login',
  async (
    user: { email: string; password: string; isLogin: boolean },
    { dispatch }
  ) => {
    try {
      const response = await axios.post<LoginResultType>(
        `${BACK_URL}/users/signin`,
        { email: user.email, password: user.password }
      );
      if (response.status === 200 && response.data.result) {
        sessionStorage.setItem('token', response.data.result?.token);
        await dispatch(getUserInfo());
        window.location.href = '/';
      }
      return response.data;
    } catch (error) {
      throw new Error('로그인 오류 발생');
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.fulfilled, state => {
      state.isLogin = true;
    });
    builder.addCase(login.rejected, state => {
      state.isLogin = false;
    });
    builder.addCase(PURGE, () => initialLoginState);
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice.reducer;
