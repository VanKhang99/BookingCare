import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../axios";
import i18next from "i18next";
// import { toast } from "react-toastify";

const initialState = {
  language: "vi" && localStorage.getItem("language"),
  pathSystem: window.location.pathname,
  currentKeyMenu: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    handleChangeLanguage: (state, { payload }) => {
      state.language = payload;
      state.isLanguageChanged = true;
      localStorage.setItem("language", payload);
      i18next.changeLanguage(payload);
    },

    handleChangePathSystem: (state, { payload }) => {
      state.pathSystem = payload;
    },
    handleCurrentKey: (state, { payload }) => {
      state.currentKeyMenu = payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { handleChangeLanguage, handleChangePathSystem, handleCurrentKey } = appSlice.actions;

export default appSlice.reducer;
