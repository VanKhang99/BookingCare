import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingSpecialty: false,
  specialty: {},
};

export const getSpecialtyOfClinic = createAsyncThunk(
  "clinic-specialty/getSpecialtyOfClinic",
  async (data, thunkAPI) => {
    try {
      const res = await axios.get(`/api/clinic/specialties/${data.clinicId}/${data.specialtyId}`);
      return res.data;
    } catch (error) {
      // toast.error("Update data specialty of clinic failed. Please check your data and try again!");
      return error.response.data;
    }
  }
);

export const getAllSpecialtiesByClinicId = createAsyncThunk(
  "clinic-specialty/getAllSpecialtiesByClinicId",
  async (clinicId, thunkAPI) => {
    try {
      const res = await axios.get(`/api/clinic/specialties/${clinicId}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const addSpecialtyForClinic = createAsyncThunk(
  "clinic-specialty/addSpecialtyForClinic",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post("/api/clinic/specialties", { data });
      return res;
    } catch (error) {
      toast.error("Add specialty for clinic failed. Please check your data and try again!");
      return error.response.data;
    }
  }
);

export const deleteSpecialtyForClinic = createAsyncThunk(
  "clinic-specialty/deleteSpecialtyForClinic",
  async (data, thunkAPI) => {
    try {
      const res = await axios.delete(`/api/clinic/specialties/${data.clinicId}/${data.specialtyId}`);
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

const clinicSpecialtySlice = createSlice({
  name: "clinicSpecialty",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSpecialtyOfClinic.pending, (state) => {
        state.isLoadingSpecialty = true;
      })
      .addCase(getSpecialtyOfClinic.fulfilled, (state, { payload }) => {
        state.isLoadingSpecialty = false;
        state.specialty = payload.data;
      })
      .addCase(getSpecialtyOfClinic.rejected, (state) => {
        state.isLoadingSpecialty = false;
        state.specialty = {};
      });
  },
});

// export const {} = clinicSpecialtySlice.actions;

export default clinicSpecialtySlice.reducer;
