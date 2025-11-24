import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Api";

export const slice = createSlice({
  name: 'generateVideo',
  initialState: {
    taskId: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(generateVideoRequest.fulfilled, (state, action) => {
      console.log(action.payload);
    })
  }
})

export const generateVideoRequest = createAsyncThunk('generateVideo/generateVideoRequest', async (arg, thunkAPI) => {
  try {
    const { model, ...restData } = arg;
    const { data } = await Api.generateVideo(model.replace('/', '_'), restData)
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }
})


export const checkStatusRequest = createAsyncThunk('generateVideo/checkStatusRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.checkStatus(arg)
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }

})

export default slice.reducer;
