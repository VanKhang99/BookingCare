import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

const initialState = {
  isLoadingAppointmentHistory: false,
  medicalAppointmentHistory: [],

  isDeletingAppointmentHistory: false,
  isCreateBooking: false,
};

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (data, { dispatch, getState }) => {
    try {
      const res = await axios.post("/api/bookings", data);
      if (res.status === "success") {
        dispatch(getAllHistoryBookedById(getState().user.userInfo.id));
      }
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const confirmBooking = createAsyncThunk(
  "booking/confirmBooking",
  async (data, { dispatch, getState }) => {
    try {
      const res = data.doctorId
        ? await axios.patch(
            `/api/bookings/confirm-booking/${data.token}&${
              data.doctorId
            }&${"confirm-booking--private-doctor"}`
          )
        : await axios.patch(
            `/api/bookings/confirm-booking/${data.token}&${data.packageId}&${"confirm-booking-package"}`
          );
      if (res.status === "success") {
        dispatch(getAllHistoryBookedById(getState().user.userInfo.id));
      }
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

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

export const getAllHistoryBookedById = createAsyncThunk(
  "booking/getAllHistoryBookedById",
  async (patientId, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/bookings/history-booked/${patientId}`, { signal });
      return res.data;
    } catch (error) {
      if (error.name === "CanceledError") {
        // Request was cancelled
        return error.response.data;
      } else {
        // Request failed for some other reason
        return rejectWithValue("Request failed");
      }
    }
  }
);

export const deleteBooking = createAsyncThunk("booking/deleteBooking", async (bookingId, { dispatch }) => {
  try {
    await axios.delete(`/api/bookings/${bookingId}`);
    return bookingId;
  } catch (error) {
    return error.response.data;
  }
});

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetMedicalAppointmentHistory(state) {
      state.medicalAppointmentHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //CREATE BOOKING
      .addCase(createBooking.pending, (state) => {
        state.isCreateBooking = true;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.isCreateBooking = false;
      })
      .addCase(createBooking.rejected, (state) => {
        state.isCreateBooking = false;
      })
      //GET ALL HISTORY MEDICAL APPOINTMENT
      .addCase(getAllHistoryBookedById.pending, (state) => {
        state.isLoadingAppointmentHistory = true;
      })
      .addCase(getAllHistoryBookedById.fulfilled, (state, { payload }) => {
        state.isLoadingAppointmentHistory = false;
        state.medicalAppointmentHistory = payload.list;
      })
      .addCase(getAllHistoryBookedById.rejected, (state) => {
        state.isLoadingAppointmentHistory = false;
        state.medicalAppointmentHistory = [];
      })
      //DELETE BOOKING
      .addCase(deleteBooking.pending, (state) => {
        state.isDeletingAppointmentHistory = true;
      })
      .addCase(deleteBooking.fulfilled, (state, { payload }) => {
        state.isDeletingAppointmentHistory = false;
        state.medicalAppointmentHistory = state.medicalAppointmentHistory.filter(
          (appointment) => +appointment.id !== +payload
        );
      })
      .addCase(deleteBooking.rejected, (state) => {
        state.isDeletingAppointmentHistory = false;
      });
  },
});

export const { resetMedicalAppointmentHistory } = bookingSlice.actions;

export default bookingSlice.reducer;
