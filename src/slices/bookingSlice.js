import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

const initialState = {};

export const createBooking = createAsyncThunk("booking/createBooking", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/bookings", data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const verifyBooking = createAsyncThunk("booking/verifyBooking", async (data, thunkAPI) => {
  try {
    const res = data.doctorId
      ? await axios.patch(
          `/api/bookings/verify-booking/${data.token}&${data.doctorId}&${"confirm-booking--private-doctor"}`
        )
      : await axios.patch(
          `/api/bookings/verify-booking/${data.token}&${data.packageId}&${"confirm-booking-package"}`
        );
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getAllPatientsForDoctor = createAsyncThunk(
  "booking/getAllPatientsForDoctor",
  async (data, thunkAPI) => {
    try {
      const res = await axios.get(`/api/bookings/all-patients/${data.doctorId}/${data.dateBooked}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const confirmExaminationComplete = createAsyncThunk(
  "booking/confirmExaminationComplete",
  async (data, thunkAPI) => {
    console.log(data);
    try {
      const res = await axios.patch(
        `/api/bookings/confirm-exam-complete/${data.token}&${data.patientId}`,
        data
      );
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = bookingSlice.actions;

export default bookingSlice.reducer;
