import { combineReducers, configureStore } from '@reduxjs/toolkit';
import alertReducer from '../slice/alert-slice';
import loginReducer from '../slice/login-slice';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/es/storage/session';

const rootReducers = combineReducers({
  alert: alertReducer,
  login: loginReducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['login'],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: defaultMiddleware =>
    defaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
