// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/app/redux/reducer';

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer
  });
};
