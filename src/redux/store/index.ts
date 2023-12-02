import { configureStore } from '@reduxjs/toolkit';
import alertReducer from '../slice/alert-slice';
import loginReducer from '../slice/login-slice';

const store = configureStore({
  reducer: { alert: alertReducer, login: loginReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
