// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/app/redux/reducer';

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false, // Matikan ImmutableStateInvariantMiddleware
        serializableCheck: false // Opsional: Matikan pengecekan serializable
      })
  });
};
