import { createSlice } from '@reduxjs/toolkit';

interface initialMobileMenuType {
  isMenuOn: boolean;
}

const initialMobileMenuState: initialMobileMenuType = {
  isMenuOn: false,
};

const mobileMenuSlice = createSlice({
  name: 'mobileMenu',
  initialState: initialMobileMenuState,
  reducers: {
    handleMenuOn: state => {
      state.isMenuOn = !state.isMenuOn;
    },
  },
});

export const mobileMenuActions = mobileMenuSlice.actions;

export default mobileMenuSlice.reducer;
