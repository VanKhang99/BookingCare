import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../axios";

const initialState = {
  isLoadingGender: false,
  isLoadingPosition: false,
  isLoadingRole: false,
  isLoadingPayment: false,
  isLoadingProvince: false,
  isLoadingTime: false,

  genderArr: [],
  positionArr: [],
  roleArr: [],
  paymentArr: [],
  provinceArr: [],
  timeArr: [],
};

export const getAllCodes = createAsyncThunk(
  "allcode/getAllCodes",
  async (type, { signal, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/allcodes/${type}`, {
        signal,
      });
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

export const getOneAllCode = createAsyncThunk("allcode/getOneAllCode", async (keyMap, thunkAPI) => {
  try {
    const res = await axios.get(`/api/allcodes/get-one/${keyMap}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const createAllCode = createAsyncThunk("allcode/createAllCode", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`/api/allcodes`, data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const deleteAllCode = createAsyncThunk("allcode/deleteAllCode", async (keyMap, thunkAPI) => {
  try {
    const res = await axios.delete(`/api/allcodes/delete/${keyMap}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const allcodeSlice = createSlice({
  name: "allcode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET ALL CODE
      .addCase(getAllCodes.pending, (state, action) => {
        if (action.meta.arg === "GENDER") state.isLoadingGender = true;
        if (action.meta.arg === "POSITION") state.isLoadingPosition = true;
        if (action.meta.arg === "ROLE") state.isLoadingRole = true;
        if (action.meta.arg === "PAYMENT") state.isLoadingPayment = true;
        if (action.meta.arg === "PROVINCE") state.isLoadingProvince = true;
        if (action.meta.arg === "TIME") state.isLoadingTime = true;
      })
      .addCase(getAllCodes.fulfilled, (state, { payload }) => {
        if (payload.allCode.length > 0) {
          if (payload.allCode[0].type === "GENDER") {
            state.isLoadingGender = false;
            state.genderArr = payload.allCode;
          }

          if (payload.allCode[0].type === "POSITION") {
            state.isLoadingPosition = false;
            state.positionArr = payload.allCode;
          }

          if (payload.allCode[0].type === "ROLE") {
            state.isLoadingRole = false;
            state.roleArr = payload.allCode;
          }

          if (payload.allCode[0].type === "PAYMENT") {
            state.isLoadingPayment = false;
            state.paymentArr = payload.allCode;
          }

          if (payload.allCode[0].type === "PROVINCE") {
            state.isLoadingProvince = false;
            state.provinceArr = payload.allCode;
          }

          if (payload.allCode[0].type === "TIME") {
            state.isLoadingTime = false;
            state.timeArr = payload.allCode;
          }
        }
      })
      .addCase(getAllCodes.rejected, (state, action) => {
        if (action.meta.arg === "GENDER") state.isLoadingGender = false;
        if (action.meta.arg === "POSITION") state.isLoadingPosition = false;
        if (action.meta.arg === "ROLE") state.isLoadingRole = false;
        if (action.meta.arg === "PAYMENT") state.isLoadingPayment = false;
        if (action.meta.arg === "PROVINCE") state.isLoadingProvince = false;
        if (action.meta.arg === "TIME") state.isLoadingTime = false;
      });
  },
});

export const {} = allcodeSlice.actions;

export default allcodeSlice.reducer;
