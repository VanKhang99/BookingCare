import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../axios";

const initialState = {
  isLoadingSpecialties: false,
  specialties: [],
  specialtiesPopular: [],
  specialtiesRemote: [],
  specialtiesMentalHealth: [],

  filterSpecialtiesPopular: [],
  filterSpecialtiesRemote: [],
};

export const getAllSpecialties = createAsyncThunk(
  "specialty/getAllSpecialties",
  async (type, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/specialties/type=${type}`);
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

export const getAllSpecialtiesMentalHealth = createAsyncThunk(
  "specialty/getAllSpecialtiesMentalHealth",
  async (_, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/specialties/mental-health`);
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

export const getInfoSpecialty = createAsyncThunk(
  "specialty/getInfoSpecialty",
  async (specialtyId, thunkAPI) => {
    try {
      // console.log(specialtyId);
      const res = await axios.get(`/api/specialties/${specialtyId}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getSpecialtyByIdAndRemote = createAsyncThunk(
  "specialty/getSpecialtyByIdAndRemote",
  async (data, thunkAPI) => {
    try {
      const res = await axios.get(`/api/specialties/${data.specialtyId}/remote=${data.remote}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const saveInfoSpecialty = createAsyncThunk("specialty/saveInfoSpecialty", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/specialties", { ...data });
    return res;
  } catch (error) {
    toast.error("Save info specialty failed. Please check your data and try again!");
    return error.response.data;
  }
});

export const deleteInfoSpecialty = createAsyncThunk(
  "specialty/deleteInfoSpecialty",
  async (specialtyId, thunkAPI) => {
    try {
      const res = await axios.delete(`api/specialties/${specialtyId}`);
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const specialtySlice = createSlice({
  name: "specialty",
  initialState,
  reducers: {
    specialtiesSearched: (state, { payload }) => {
      console.log(payload);
      if (payload.remote) {
        state.filterSpecialtiesRemote = payload.newSpecialties;
      } else {
        state.filterSpecialtiesPopular = payload.newSpecialties;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecialties.pending, (state) => {
        state.isLoadingSpecialties = true;
      })
      .addCase(getAllSpecialties.fulfilled, (state, { payload }) => {
        state.isLoadingSpecialties = false;
        if (payload.type === "popular") {
          state.specialtiesPopular = payload.data.specialties;
          state.filterSpecialtiesPopular = payload.data.specialties;
        } else if (payload.type === "all") {
          state.specialties = payload.data.specialties;
        } else {
          state.specialtiesRemote = payload.data.specialties;
          state.filterSpecialtiesRemote = payload.data.specialties;
        }
      })
      .addCase(getAllSpecialties.rejected, (state) => {
        state.isLoadingSpecialties = false;
        state.specialties = [];
      })
      // SPECIALTIES MENTAL HEALTH
      .addCase(getAllSpecialtiesMentalHealth.pending, (state) => {
        state.isLoadingSpecialties = true;
      })
      .addCase(getAllSpecialtiesMentalHealth.fulfilled, (state, { payload }) => {
        state.isLoadingSpecialties = false;
        state.specialtiesMentalHealth = payload.data.specialties;
      })
      .addCase(getAllSpecialtiesMentalHealth.rejected, (state) => {
        state.isLoadingSpecialties = false;
        state.specialtiesMentalHealth = [];
      });
  },
});

export const { specialtiesSearched } = specialtySlice.actions;

export default specialtySlice.reducer;
