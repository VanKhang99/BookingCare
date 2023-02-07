import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  isModalAddUserOpen: false,
  isModalEditUserOpen: false,
  dataUserEdit: null,
  currentKeyMenu: "",
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    getAllUserRedux: (state, { payload }) => {
      state.users = payload;
    },
    handleDisplayModal: (state, { payload }) => {
      if (!payload.isModalEdit) {
        state.isModalAddUserOpen = !state.isModalAddUserOpen;
      } else {
        state.isModalEditUserOpen = !state.isModalEditUserOpen;
        state.dataUserEdit = payload.dataEdit;
      }
    },
    handleCurrentKey: (state, { payload }) => {
      state.currentKeyMenu = payload;
    },
  },
});

export const { getAllUserRedux, handleDisplayModal, handleCurrentKey } =
  systemSlice.actions;

export default systemSlice.reducer;
