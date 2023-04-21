import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingPackage: false,
  packageArr: [],
};

export const getAllPackages = createAsyncThunk(
  "package/getAllPackages",
  async (_, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/packages`, { signal });
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

export const getPackage = createAsyncThunk("package/getPackage", async (packageId, thunkAPI) => {
  try {
    const url = `/api/packages/${packageId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const saveInfoPackage = createAsyncThunk("package/createPackage", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/packages", data);
    return res;
  } catch (error) {
    toast.error("Save info package failed. Please check your data and try again!");
    return error.response.data;
  }
});

export const deletePackage = createAsyncThunk("package/deletePackage", async (packageId, thunkAPI) => {
  try {
    const url = `/api/packages/${packageId}`;
    const res = await axios.delete(url);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET ALL PACKAGES
      .addCase(getAllPackages.pending, (state) => {
        state.isLoadingPackage = true;
      })
      .addCase(getAllPackages.fulfilled, (state, { payload }) => {
        state.isLoadingPackage = false;
        state.packageArr = payload.data;
      })
      .addCase(getAllPackages.rejected, (state) => {
        state.isLoadingPackage = false;
      });
  },
});

export const {} = packageSlice.actions;

export default packageSlice.reducer;
