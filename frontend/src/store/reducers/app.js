import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Api";

export const slice = createSlice({
  name: 'app',
  initialState: {
    token: localStorage.getItem('token') || ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginRequest.fulfilled, (state, action) => {
      const { token } = action.payload;
      localStorage.setItem('token', token);
      state.token = token;
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

export default slice.reducer;
