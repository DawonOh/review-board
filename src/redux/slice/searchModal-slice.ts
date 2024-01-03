import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface searchResultType {
  id: number;
  postedAt: string;
  titleSnippet: string;
  contentSnippet: string;
}

interface initialSearchType {
  isModalOpen: boolean;
  searchWord: string;
  searchResult: searchResultType[] | undefined;
}

const initialSearchState: initialSearchType = {
  isModalOpen: false,
  searchWord: '',
  searchResult: [{ id: 0, postedAt: '', titleSnippet: '', contentSnippet: '' }],
};

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

export const search = createAsyncThunk(
  'searchModalSlice/search',
  async (searchWord: string) => {
    try {
      const response = await axios.get<searchResultType[]>(
        `${BACK_URL}:${BACK_PORT}/search?query=${searchWord}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {}
  }
);

const searchModalSlice = createSlice({
  name: 'searchModalSlice',
  initialState: initialSearchState,
  reducers: {
    handleModal: state => {
      state.isModalOpen = !state.isModalOpen;
    },
    getSearchWord: (state, action: PayloadAction<string>) => {
      state.searchWord = action.payload;
    },
    resetSearchModal: state => {
      state.searchResult = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(search.fulfilled, (state, action) => {
      state.searchResult = action.payload;
    });
  },
});

export const searchModalActions = searchModalSlice.actions;

export default searchModalSlice.reducer;
