import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../axios";

const initialState = {
  isLoadingGender: false,
  isLoadingPosition: false,
  isLoadingRole: false,
  isLoadingPrice: false,
  isLoadingPayment: false,
  isLoadingProvince: false,
  isLoadingSpecialty: false,
  isLoadingClinic: false,

  genderArr: [],
  positionArr: [],
  roleArr: [],
  priceArr: [],
  paymentArr: [],
  provinceArr: [],
  specialtyArr: [],
  clinicArr: [],
};

export const getAllCode = createAsyncThunk("allcode/getAllCode", async (type, thunkAPI) => {
  try {
    const res = await axios.get(`/api/allcodes/${type}`);
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

export const allcodeSlice = createSlice({
  name: "allcode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET ALL CODE
      .addCase(getAllCode.pending, (state, action) => {
        if (action.meta.arg === "GENDER") state.isLoadingGender = true;
        if (action.meta.arg === "POSITION") state.isLoadingPosition = true;
        if (action.meta.arg === "ROLE") state.isLoadingRole = true;
        if (action.meta.arg === "PRICE") state.isLoadingPrice = true;
        if (action.meta.arg === "PAYMENT") state.isLoadingPayment = true;
        if (action.meta.arg === "PROVINCE") state.isLoadingProvince = true;
        if (action.meta.arg === "SPECIALTY") state.isLoadingSpecialty = true;
        if (action.meta.arg === "CLINIC") state.isLoadingClinic = true;
      })
      .addCase(getAllCode.fulfilled, (state, { payload }) => {
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

          if (payload.allCode[0].type === "PRICE") {
            state.isLoadingPrice = false;
            state.priceArr = payload.allCode;
          }

          if (payload.allCode[0].type === "PAYMENT") {
            state.isLoadingPayment = false;
            state.paymentArr = payload.allCode;
          }

          if (payload.allCode[0].type === "PROVINCE") {
            state.isLoadingProvince = false;
            state.provinceArr = payload.allCode;
          }

          if (payload.allCode[0].type === "SPECIALTY") {
            state.isLoadingSpecialty = false;
            state.specialtyArr = payload.allCode;
          }

          if (payload.allCode[0].type === "CLINIC") {
            state.isLoadingClinic = false;
            state.clinicArr = payload.allCode;
          }
        }
      })
      .addCase(getAllCode.rejected, (state, action) => {
        if (action.meta.arg === "GENDER") state.isLoadingGender = false;
        if (action.meta.arg === "POSITION") state.isLoadingPosition = false;
        if (action.meta.arg === "ROLE") state.isLoadingRole = false;
        if (action.meta.arg === "PRICE") state.isLoadingPrice = false;
        if (action.meta.arg === "PAYMENT") state.isLoadingPayment = false;
        if (action.meta.arg === "PROVINCE") state.isLoadingProvince = false;
        if (action.meta.arg === "SPECIALTY") state.isLoadingSpecialty = false;
        if (action.meta.arg === "CLINIC") state.isLoadingClinic = false;
      });
  },
});

export const {} = allcodeSlice.actions;

export default allcodeSlice.reducer;
