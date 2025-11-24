import { configureStore } from '@reduxjs/toolkit';
import app from "./reducers/app";
import users from "./reducers/users";

const store = configureStore({
  reducer: {
    app,
    users,
  },
})


export default store;
