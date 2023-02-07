import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingClinicData: false,
  clinicData: {},
};

export const getAllClinicsPopular = createAsyncThunk("clinic/getAllClinicsPopular", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/clinics/popular");
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getInfoClinic = createAsyncThunk("clinic/getInfoClinic", async (clinicId, thunkAPI) => {
  try {
    const res = await axios.get(`/api/clinics/${clinicId}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const saveInfoClinic = createAsyncThunk("clinic/saveInfoClinic", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/clinics", { data });
    return res;
  } catch (error) {
    toast.error("Save info clinic failed. Please check your data and try again!");
    return error.response.data;
  }
});

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInfoClinic.pending, (state) => {
        state.isLoadingClinicData = true;
      })
      .addCase(getInfoClinic.fulfilled, (state, { payload }) => {
        state.isLoadingClinicData = false;
        state.clinicData = payload.data;
      })
      .addCase(getInfoClinic.rejected, (state) => {
        state.isLoadingClinicData = false;
        state.clinicData = {};
      });
  },
});

export const {} = clinicSlice.actions;

export default clinicSlice.reducer;
