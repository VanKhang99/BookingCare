import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
// import { toast } from "react-toastify";

const initialState = {
  isLoadingDoctors: false,
  doctors: [],
};

export const getAllDoctors = createAsyncThunk("doctor/getAllDoctors", async (type, thunkAPI) => {
  try {
    const res = await axios.get(`/api/doctors/${type}`);
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

export const getDetailDoctor = createAsyncThunk("doctor/getDetailDoctor", async (doctorId, thunkAPI) => {
  try {
    const res = await axios.get(`/api/doctors/detail/${doctorId}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

// export const getInfoAddressPriceClinic = createAsyncThunk(
//   "doctor/getInfoAddressPriceClinic",
//   async (doctorId, thunkAPI) => {
//     try {
//       const res = await axios.get(`/api/doctors/address-price-assurance/${doctorId}`);
//       return res.data;
//     } catch (error) {
//       return error.response;
//     }
//   }
// );

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET ALL DOCTORS
      .addCase(getAllDoctors.pending, (state) => {
        state.isLoadingDoctors = true;
      })
      .addCase(getAllDoctors.fulfilled, (state, { payload }) => {
        state.isLoadingDoctors = false;
        state.doctors = payload.data.doctors;
      })
      .addCase(getAllDoctors.rejected, (state) => {
        state.isLoadingDoctors = false;
      });
  },
});

export const {} = doctorSlice.actions;

export default doctorSlice.reducer;
