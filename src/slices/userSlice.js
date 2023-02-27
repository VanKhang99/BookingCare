import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

import { handleChangePathSystem } from "./appSlice";
import { setAuthToken } from "../utils/helpers";

const initialState = {
  isLoggedIn: false,
  userInfo: null,
};

export const login = createAsyncThunk("user/login", async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/login", { email, password });
    const token = res.token;
    localStorage.setItem("token", token);
    setAuthToken(token);
    return res;
  } catch (error) {
    throw error.response.data;
  }
});

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/users/logout");
    localStorage.removeItem("token");
    thunkAPI.dispatch(handleChangePathSystem("/"));

    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getAllUsers = createAsyncThunk("user/getAllUsers", async (data, thunkAPI) => {
  try {
    const res = await axios.get(`/api/users?page=${data.page}&limit=${data.limit}&role=${data.role}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const getUser = createAsyncThunk("user/getUser", async (id, thunkAPI) => {
  try {
    const user = await axios.get(`/api/users/${id}`);
    return user.data;
  } catch (error) {
    return error.response.data;
  }
});

export const createUser = createAsyncThunk("user/createUser", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users", { ...data });
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const updateDataUser = createAsyncThunk("user/updateDataUser", async (data, thunkAPI) => {
  try {
    const res = await axios.patch(`/api/users/${data.id}`, data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const deleteUser = createAsyncThunk("user/deleteUser", async (id, thunkAPI) => {
  try {
    const res = await axios.delete(`/api/users/${id}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getAllUsersByRole = createAsyncThunk("user/getAllUsersByRole", async (role, thunkAPI) => {
  try {
    const res = await axios.get(`/api/users/filter/${role}`);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { user } = payload.data;
        const userCopy = { ...user };
        for (const prop of Object.keys(userCopy)) {
          if (prop === "firstName" || prop === "lastName" || prop === "roleId" || prop === "id") {
            continue;
          } else {
            delete userCopy[prop];
          }
        }

        state.isLoggedIn = true;
        state.userInfo = userCopy;
        localStorage.setItem("userInfo", JSON.stringify(userCopy));
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.email = "";
        state.password = "";
      })
      .addCase(logout.pending, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        localStorage.removeItem("userInfo");
      })
      .addCase(logout.rejected, (state) => {
        state.isLoggedIn = true;
      });
  },
});

// export const {} = userSlice.actions;

export default userSlice.reducer;
