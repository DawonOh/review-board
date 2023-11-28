import { configureStore } from '@reduxjs/toolkit';
import alertReducer from '../slice/alert-slice';

const store = configureStore({ reducer: { alert: alertReducer } });

export default store;
