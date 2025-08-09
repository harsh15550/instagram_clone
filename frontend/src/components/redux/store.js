import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authslice from "./authslice";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'
import postSlice from "./postSlice.js";
import socketslice from "./socketslice.js";
import chatslice from './chatslice.js';
import storySlice from './socketslice.js';
import notificationSlice from './notificationSlice';
  
  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }

  const rootReducer = combineReducers({
    auth:authslice,
    story:storySlice,
    post:postSlice,
    socket:socketslice,
    chat:chatslice,
    notification:notificationSlice
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

export default store;