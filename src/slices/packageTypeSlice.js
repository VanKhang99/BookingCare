import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingPackageType: false,
  packagesType: [],
};

export const getAllPackagesType = createAsyncThunk("packageType/getAllPackagesType", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/packages-type");
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getPackageType = createAsyncThunk(
  "packageType/getPackageType",
  async (packageTypeId, thunkAPI) => {
    try {
      const res = await axios.get(`/api/packages-type/${packageTypeId}`);
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const saveInfoPackageType = createAsyncThunk("package/createPackage", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/packages-type", data);
    return res;
  } catch (error) {
    toast.error("Save info package-type failed. Please check your data and try again!");
    return error.response.data;
  }
});

export const deletePackageType = createAsyncThunk(
  "packageType/deletePackageType",
  async (packageTypeId, thunkAPI) => {
    try {
      const res = await axios.delete(`/api/packages-type/${packageTypeId}`);
      return res;
    } catch (error) {
      return error.response.data;
    }
  }
);

const packageTypeSlice = createSlice({
  name: "packageType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET ALL PACKAGES
      .addCase(getAllPackagesType.pending, (state) => {
        state.isLoadingPackageType = true;
      })
      .addCase(getAllPackagesType.fulfilled, (state, { payload }) => {
        state.isLoadingPackageType = false;
        console.log(payload);
        state.packagesType = payload.data.packages;
      })
      .addCase(getAllPackagesType.rejected, (state) => {
        state.isLoadingPackageType = false;
      });
  },
});

export const {} = packageTypeSlice.actions;

export default packageTypeSlice.reducer;
