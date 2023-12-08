import { combineReducers, configureStore } from '@reduxjs/toolkit';
import alertReducer from '../slice/alert-slice';
import loginReducer from '../slice/login-slice';
import userReducer from '../slice/user-slice';
import mobileMenuReducer from '../slice/mobileMenu-slice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/es/storage/session';

const rootReducers = combineReducers({
  alert: alertReducer,
  login: loginReducer,
  user: userReducer,
  mobileMenu: mobileMenuReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['login', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: defaultMiddleware =>
    defaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
