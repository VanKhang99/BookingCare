import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

const initialState = {};

export const getAllUsers = createAsyncThunk("systemRedux/getAllUsers", async (data, thunkAPI) => {
  try {
    const res = await axios.get(`/api/users?page=${data.page}&limit=${data.limit}&role=${data.role}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Something went very wrong. Please check your API!");
  }
});

export const getUser = createAsyncThunk("systemRedux/getUser", async (id, thunkAPI) => {
  try {
    const user = await axios.get(`/api/users/${id}`);
    return user.data;
  } catch (error) {
    return error.response.data;
  }
});

export const createUser = createAsyncThunk("systemRedux/createUser", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users", { ...data });
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const updateDataUser = createAsyncThunk("systemRedux/updateDataUser", async (data, thunkAPI) => {
  try {
    const res = await axios.patch(`/api/users/${data.id}`, { ...data.user });
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const deleteUser = createAsyncThunk("systemRedux/deleteUser", async (id, thunkAPI) => {
  try {
    const res = await axios.delete(`/api/users/${id}`);
    return res;
  } catch (error) {
    return thunkAPI.rejectWithValue("Something went very wrong. Please check your API!");
  }
});

export const getAllUsersByRole = createAsyncThunk("systemRedux/getAllUsersByRole", async (role, thunkAPI) => {
  try {
    const res = await axios.get(`/api/users/filter/${role}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const systemReduxSlice = createSlice({
  name: "systemRedux",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

// export const {} = systemReduxSlice.actions;

export default systemReduxSlice.reducer;
