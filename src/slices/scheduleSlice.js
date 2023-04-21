import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  // isLoadingSchedules: false,
  // schedules: [],
};

export const getSchedules = createAsyncThunk("schedule/getSchedules", async (data, thunkAPI) => {
  try {
    const res = await axios.get(`/api/schedules/${data.keyMap}=${+data.id}&${data.timeStamp}`);
    return res.data;
  } catch (error) {
    return error.response;
  }
});

export const createSchedules = createAsyncThunk("schedule/createSchedules", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/schedules", data);
    return res;
  } catch (error) {
    toast.error("Create schedules doctor failed!");
    return error.response.data;
  }
});

export const deleteSchedules = createAsyncThunk("schedule/deleteSchedules", async (data, thunkAPI) => {
  try {
    const res = await axios.patch(`/api/schedules/${data.typeId}/${data.id}/${data.date}`, data.schedules);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder
    //   .addCase(getSchedules.pending, (state) => {
    //     state.isLoadingSchedules = true;
    //   })
    //   .addCase(getSchedules.fulfilled, (state, { payload }) => {
    //     state.isLoadingSchedules = false;
    //     state.schedules = payload.schedules;
    //   })
    //   .addCase(getSchedules.rejected, (state) => {
    //     state.isLoadingSchedules = false;
    //   });
  },
});

export const {} = scheduleSlice.actions;

export default scheduleSlice.reducer;
