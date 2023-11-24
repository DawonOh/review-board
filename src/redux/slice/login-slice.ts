import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface LoginType {
  user: {
    email: string;
    password: string;
  };
  isLogin: boolean | null;
}

interface LoginResultType {
  message: string;
  result?: {
    token: string;
  };
}

const initialLoginState: LoginType = {
  user: {
    email: '',
    password: '',
  },
  isLogin: null,
};

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

export const login = createAsyncThunk(
  'loginSlice/login',
  async (user: { email: string; password: string }) => {
    const response = axios.post<LoginResultType>(
      `${BACK_URL}:${BACK_PORT}/users/signin`,
      { email: user.email, password: user.password }
    );

    return (await response).data;
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    getLoginInfo: (state, action) => {
      state.user.email = action.payload.email;
      state.user.password = action.payload.password;
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLogin = true;
      action.payload.result &&
        localStorage.setItem('token', action.payload.result.token);
      window.location.href = '/';
    });
    builder.addCase(login.rejected, state => {
      state.isLogin = false;
    });
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice.reducer;
