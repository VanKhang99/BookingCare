import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
// import { toast } from "react-toastify";

const initialState = {
  isLoadingDoctors: false,
  isFetchDoctor: false,
  outstandingDoctors: [],
  doctors: [],
};

export const getOutstandingDoctors = createAsyncThunk(
  "doctor/getOutstandingDoctors",
  async (limit, thunkAPI) => {
    try {
      const res = await axios.get(`/api/doctor/outstanding-doctor`);
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getAllDoctors = createAsyncThunk("doctor/getAllDoctors", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/doctor/all-doctors");
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const postInfoDoctor = createAsyncThunk("doctor/postInfoDoctor", async (data, thunkAPI) => {
  try {
    console.log(data);
    const res = await axios.post("/api/doctor/save-info-doctors", data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getDetailDoctor = createAsyncThunk("doctor/getDetailDoctor", async (doctorId, thunkAPI) => {
  try {
    const res = await axios.get(`/api/doctor/detail/${doctorId}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getInfoAddressPriceClinic = createAsyncThunk(
  "doctor/getInfoAddressPriceClinic",
  async (doctorId, thunkAPI) => {
    try {
      const res = await axios.get(`/api/doctor/address-price-assurance/${doctorId}`);
      return res.data;
    } catch (error) {
      return error.response;
    }
  }
);

export const getDoctorsBaseKeyMap = createAsyncThunk(
  "doctor/getDoctorsBaseKeyMap",
  async (data, thunkAPI) => {
    try {
      const res = await axios.get(`/api/doctor/${data.keyMapId}&${data.remote}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const deleteDoctor = createAsyncThunk("doctor/deleteDoctor", async (doctorId, thunkAPI) => {
  try {
    const res = await axios.delete(`api/doctor/${doctorId}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const doctorSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET OUTSTANDING DOCTORS
      .addCase(getOutstandingDoctors.pending, (state) => {
        state.isLoadingDoctors = true;
      })
      .addCase(getOutstandingDoctors.fulfilled, (state, { payload }) => {
        state.isLoadingDoctors = false;
        state.outstandingDoctors = payload.data.doctors;
      })
      .addCase(getOutstandingDoctors.rejected, (state) => {
        state.isLoadingDoctors = false;
      })
      //GET ALL DOCTORS
      .addCase(getAllDoctors.pending, (state) => {
        state.isLoadingDoctors = true;
      })
      .addCase(getAllDoctors.fulfilled, (state, { payload }) => {
        state.isLoadingDoctors = false;
        state.doctors = payload.doctors;
      })
      .addCase(getAllDoctors.rejected, (state) => {
        state.isLoadingDoctors = false;
      });
  },
});

export const {} = doctorSlice.actions;

export default doctorSlice.reducer;
