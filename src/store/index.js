// store.js
import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers"; // Can be combined reducers or slice reducers
import thunk from "redux-thunk";
import logger from "redux-logger";

const store = configureStore({
  reducer: reducers, // object of slices or combined reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false, // optional: disable warnings
    }).concat(logger), // add custom middleware like logger
  devTools: process.env.NODE_ENV !== "production", // enables Redux DevTools
});

export default store;
