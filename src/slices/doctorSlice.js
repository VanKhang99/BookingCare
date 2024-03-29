import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
// import { toast } from "react-toastify";

const initialState = {
  isLoadingDoctors: false,
  doctors: [],
  doctorsById: [],

  filterDoctors: [],
};

export const getAllDoctors = createAsyncThunk(
  "doctor/getAllDoctors",
  async (type, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/doctors/${type}`, {
        signal,
      });

      return res;
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

export const getAllDoctorsById = createAsyncThunk("doctor/getAllDoctorsById", async (data, thunkAPI) => {
  try {
    const res = await axios.get(`/api/doctors/${data.nameColumnMap}/${data.id}/remote=${data.typeRemote}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const postInfoDoctor = createAsyncThunk("doctor/postInfoDoctor", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/doctors", data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getDoctor = createAsyncThunk("doctor/getDoctor", async (doctorId, thunkAPI) => {
  try {
    const res = await axios.get(`/api/doctors/detail/${doctorId}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getDoctorsBaseKeyMap = createAsyncThunk(
  "doctor/getDoctorsBaseKeyMap",
  async (data, thunkAPI) => {
    try {
      const res = await axios.get(`/api/doctors/${data.keyMapId}&${data.remote}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const deleteDoctor = createAsyncThunk("doctor/deleteDoctor", async (doctorId, thunkAPI) => {
  try {
    const res = await axios.delete(`api/doctors/${doctorId}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const doctorSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    doctorSearched: (state, { payload }) => {
      state.filterDoctors = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //GET ALL DOCTORS
      .addCase(getAllDoctors.pending, (state) => {
        state.isLoadingDoctors = true;
      })
      .addCase(getAllDoctors.fulfilled, (state, { payload }) => {
        state.isLoadingDoctors = false;
        state.doctors = payload.data.doctors;
        state.filterDoctors = payload.data.doctors;
      })
      .addCase(getAllDoctors.rejected, (state) => {
        state.isLoadingDoctors = false;
      })

      //GET ALL DOCTORS BY ID
      .addCase(getAllDoctorsById.pending, (state) => {
        state.isLoadingDoctors = true;
      })
      .addCase(getAllDoctorsById.fulfilled, (state, { payload }) => {
        state.isLoadingDoctors = false;
        state.doctorsById = payload?.data?.doctors;
      })
      .addCase(getAllDoctorsById.rejected, (state) => {
        state.isLoadingDoctors = false;
      });
  },
});

export const { doctorSearched } = doctorSlice.actions;

export default doctorSlice.reducer;
