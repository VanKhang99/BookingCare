import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingClinics: false,
  isLoadingClinicData: false,
  isDeletingClinic: false,
  clinicData: {},

  clinicsLength: "",
  clinics: [],
  clinicsPopular: [],
};

export const getAllClinics = createAsyncThunk(
  "clinic/getAllClinics",
  async (type, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get("/api/clinics", { signal });
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

export const getClinic = createAsyncThunk("clinic/getClinic", async (clinicId, thunkAPI) => {
  try {
    const res = await axios.get(`/api/clinics/${clinicId}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const saveDataClinic = createAsyncThunk(
  "clinic/saveDataClinic",
  async (data, { dispatch, getState }) => {
    try {
      const res = await axios.post("/api/clinics", { data });
      return res;
    } catch (error) {
      toast.error("Save data clinic failed. Please check your data and try again!");
      return error.response.data;
    }
  }
);

export const deleteClinic = createAsyncThunk("clinic/deleteClinic", async (clinicId, thunkAPI) => {
  try {
    const res = await axios.delete(`/api/clinics/${clinicId}`);
    return res;
  } catch (error) {
    toast.error("Delete clinic failed. Please check your clinicId again!");
    return error.response.data;
  }
});

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClinics.pending, (state) => {
        state.isLoadingClinics = true;
      })
      .addCase(getAllClinics.fulfilled, (state, { payload }) => {
        state.isLoadingClinics = false;
        state.clinicsPopular = payload.clinics.filter((clinic) => clinic.popular);
        state.clinics = payload.clinics;
        state.clinicsLength = payload.clinics.length;
      })
      .addCase(getAllClinics.rejected, (state) => {
        state.isLoadingClinics = false;
        state.clinics = [];
      })

      .addCase(getClinic.pending, (state) => {
        state.isLoadingClinicData = true;
      })
      .addCase(getClinic.fulfilled, (state, { payload }) => {
        state.isLoadingClinicData = false;
        state.clinicData = payload.data;
      })
      .addCase(getClinic.rejected, (state) => {
        state.isLoadingClinicData = false;
        state.clinicData = {};
      });
  },
});

export const {} = clinicSlice.actions;

export default clinicSlice.reducer;
