import { configureStore } from '@reduxjs/toolkit';
import users from "./reducers/users";
import generateVideo from "./reducers/generateVideo";

const store = configureStore({
  reducer: {
    users,
    generateVideo
  },
})


export default store;
