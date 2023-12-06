import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserInfo } from './user-slice';
import { PURGE } from 'redux-persist';

interface LoginType {
  isLogin: boolean | null;
  token: string;
}

interface LoginResultType {
  message: string;
  result?: {
    token: string;
  };
}

const initialLoginState: LoginType = {
  isLogin: null,
  token: '',
};

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

export const login = createAsyncThunk(
  'loginSlice/login',
  async (
    user: { email: string; password: string; isLogin: boolean },
    { dispatch }
  ) => {
    try {
      const response = await axios.post<LoginResultType>(
        `${BACK_URL}:${BACK_PORT}/users/signin`,
        { email: user.email, password: user.password }
      );
      if (user.isLogin) {
        await dispatch(getUserInfo(response.data.result?.token));
      }
      if (response.status === 200) {
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
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLogin = true;
      if (action.payload.result?.token) {
        state.token = action.payload.result?.token;
      }
    });
    builder.addCase(login.rejected, state => {
      state.isLogin = false;
    });
    builder.addCase(PURGE, () => initialLoginState);
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice.reducer;
