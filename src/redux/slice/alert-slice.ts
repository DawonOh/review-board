import { createSlice } from '@reduxjs/toolkit';

interface AlertType {
  isModalOpen: boolean;
  contents: string;
  isQuestion: boolean;
  alertPath: string;
  isClickOk: boolean;
}

const initialAlertState: AlertType = {
  isModalOpen: false,
  contents: '',
  isQuestion: false,
  alertPath: '',
  isClickOk: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState: initialAlertState,
  reducers: {
    setModal: (state, action) => {
      state.isModalOpen = true;
      state.contents = action.payload.contents;
      state.isQuestion = action.payload.isQuestion;
      state.alertPath = action.payload.alertPath;
      state.isClickOk = false;
    },
    setIsClickOk: state => {
      state.isClickOk = true;
    },
    closeModal: state => {
      state.isModalOpen = false;
    },
  },
});

export const alertActions = alertSlice.actions;

export default alertSlice.reducer;
