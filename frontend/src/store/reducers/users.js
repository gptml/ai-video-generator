import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Api";

export const slice = createSlice({
  name: 'users',
  initialState: {
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUserRequest.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      state.token = token;
      state.user = user;
    })
    builder.addCase(loginRequest.fulfilled, (state, action) => {
      const { token, user } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      state.token = token;
      state.user = user;
    })
    builder.addCase(getProfileRequest.fulfilled, (state, action) => {
      const { user } = action.payload;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    })
  }
})


export const loginRequest = createAsyncThunk('app/loginRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.login(arg)
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }

})

export const registerUserRequest = createAsyncThunk('users/registerUserRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.registerUser(arg)
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data);
  }
})

export const getProfileRequest = createAsyncThunk('users/getProfileRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.getProfile()
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data);
  }
})

export default slice.reducer;
