import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './user-slice';
import { PURGE } from 'redux-persist';
import axios from 'axios';

interface LoginType {
  isLogin: boolean | null;
  isCheck: boolean | null;
  isPass: boolean | null;
  isLoading: boolean;
}

interface LoginResultType {
  message: string;
  result?: {
    token: string;
  };
}

const initialLoginState: LoginType = {
  isLogin: null,
  isCheck: null,
  isPass: null,
  isLoading: false,
};

const BACK_URL = process.env.REACT_APP_BACK_URL;

export const login = createAsyncThunk(
  'loginSlice/login',
  async (
    user: {
      email: string;
      password: string;
      isCheck: boolean;
    },
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
        if (!user.isCheck) window.location.href = '/';
      }
      return { data: response.data, isCheck: user.isCheck };
    } catch (error) {
      throw error;
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: initialLoginState,
  reducers: {
    setIsPass: (state, action) => {
      state.isPass = action.payload;
    },
    setIsCheck: (state, action) => {
      state.isCheck = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLogin = true;
      state.isPass = action.payload.isCheck ? true : null;
    });
    builder.addCase(login.rejected, state => {
      state.isLoading = false;
      state.isLogin = state.isCheck ? true : false;
      state.isPass = false;
    });
    builder.addCase(PURGE, () => initialLoginState);
  },
});

export const loginActions = loginSlice.actions;

export default loginSlice.reducer;
