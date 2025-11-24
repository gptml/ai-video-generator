import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: 'users',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase('fsdfd', () => {

    })
  }
})

export default slice.reducer;
