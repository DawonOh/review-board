import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { PURGE } from 'redux-persist';

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

interface UserInfoType {
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  nickname: string;
  updated_at: string;
}

const initialUserState: UserInfoType = {
  created_at: '',
  deleted_at: '',
  email: '',
  id: 0,
  nickname: '',
  updated_at: '',
};

export const getUserInfo = createAsyncThunk(
  'loginSlice/user',
  async (token: string | undefined) => {
    const response = axios.get<UserInfoType>(
      `${BACK_URL}:${BACK_PORT}/users/userinfo`,
      {
        timeout: 5000,
        headers: { Accept: 'application/json', Authorization: token },
      }
    );
    return (await response).data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.created_at = action.payload.created_at;
      state.deleted_at = action.payload.deleted_at;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
      state.updated_at = action.payload.updated_at;
    });
    builder.addCase(PURGE, () => initialUserState);
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
