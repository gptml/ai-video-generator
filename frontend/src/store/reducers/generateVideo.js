import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Api";

export const slice = createSlice({
  name: 'generateVideo',
  initialState: {
    taskId: '',
    allModels: [],
    generationHistory: [],
    totalPages: 0,
    singleModel: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(generateVideoRequest.fulfilled, (state, action) => {
      console.log(action.payload);
    })
      .addCase(getAllModelsRequest.fulfilled, (state, action) => {
        state.allModels = action.payload.models
      })
      .addCase(getSingleModelRequest.fulfilled, (state, action) => {
        state.singleModel = action.payload.model
      })
      .addCase(getGenerationHistoryRequest.fulfilled, (state, action) => {
        state.generationHistory = action.payload.history;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(changeTokenCount, (state, action) => {
        state.allModels = [...state.allModels].map(m => {
          if (m.id === action.payload.id) {
            m.token = action.payload.token;
          }
          return m;
        })
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

export const getAllModelsRequest = createAsyncThunk('generateVideo/getAllModelsRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.getAllModels()
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }

})

export const getGenerationHistoryRequest = createAsyncThunk('generateVideo/getGenerationHistoryRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.getGenerationHistory(arg)
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }

})

export const getSingleModelRequest = createAsyncThunk('generateVideo/getSingleModelRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.getSingleModel(arg)
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }

})

export const changeTokenCountRequest = createAsyncThunk('generateVideo/changeTokenCountRequest', async (arg, thunkAPI) => {
  try {
    const { data } = await Api.changeTokenCount({ models: arg })
    return data
  } catch (e) {
    console.log(e)
    return thunkAPI.rejectWithValue(e.response?.data);
  }

})

export const changeTokenCount = createAction('generateVideo/changeTokenCount')

export default slice.reducer;
