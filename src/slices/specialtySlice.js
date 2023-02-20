import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../axios";

export const getAllSpecialties = createAsyncThunk("specialty/getAllSpecialties", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/specialties");
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getAllSpecialtiesRemote = createAsyncThunk(
  "specialty/getAllSpecialties",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/specialties/remote");
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getInfoSpecialty = createAsyncThunk(
  "specialty/getInfoSpecialty",
  async (specialtyId, thunkAPI) => {
    try {
      const res = await axios.get(`/api/specialties/${specialtyId}`);
      return res.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const saveInfoSpecialty = createAsyncThunk("specialty/saveInfoSpecialty", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/specialties", data);
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

// export const specialtySlice = createSlice({
//   name: "specialty",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {},
// });

// export const {} = specialtySlice.actions;

// export default specialtySlice.reducer;
