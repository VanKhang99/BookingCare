import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingSpecialtiesClinic: false,
  specialtiesForClinic: [],
  filterSpecialtiesForClinic: [],

  isLoadingSpecialty: false,
  specialty: {},
};

export const getAllSpecialtiesByClinicId = createAsyncThunk(
  "clinic-specialty/getAllSpecialtiesByClinicId",
  async (clinicId, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/clinic/specialties/${clinicId}`, { signal });
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
  reducers: {
    specialtiesClinicSearched: (state, { payload }) => {
      state.filterSpecialtiesForClinic = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecialtiesByClinicId.pending, (state) => {
        state.isLoadingSpecialtiesClinic = true;
      })
      .addCase(getAllSpecialtiesByClinicId.fulfilled, (state, { payload }) => {
        state.isLoadingSpecialtiesClinic = false;
        state.specialtiesForClinic = payload.data;
        state.filterSpecialtiesForClinic = payload.data;
      })
      .addCase(getAllSpecialtiesByClinicId.rejected, (state) => {
        state.isLoadingSpecialtiesClinic = false;
        state.specialtiesForClinic = [];
      })

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

export const { specialtiesClinicSearched } = clinicSpecialtySlice.actions;

export default clinicSpecialtySlice.reducer;
