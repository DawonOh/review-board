import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import instance from '../../api';

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

export const getUserInfo = createAsyncThunk('loginSlice/user', async () => {
  const response = await instance.get<UserInfoType>('/users/userinfo');
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    changeInfo: (state, action) => {
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
    },
  },
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
