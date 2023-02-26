import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

import { handleChangePathSystem } from "./appSlice";
import { setAuthToken } from "../utils/helpers";

const initialState = {
  isLoggedIn: false,
  email: "",
  password: "",
  userInfo: null,
};

export const login = createAsyncThunk("user/login", async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/login", { email, password });
    const token = res.token;
    localStorage.setItem("token", token);
    setAuthToken(token);

    // thunkAPI.dispatch(handleChangePathSystem("/system"));
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
    return thunkAPI.rejectWithValue("Something went very wrong. Please check your API!");
  }
});

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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    inputChange: (state, { payload }) => {
      state.email = payload.email;
      state.password = payload.password ? payload.password : "";
    },

    userLogin: (state) => {
      state.isLoggedIn = true;
    },

    userLogout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.email = "";
      state.password = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { user } = payload.data;
        const userInRedux = { ...user };
        delete userInRedux.image;
        state.isLoggedIn = true;
        state.userInfo = userInRedux;

        const userInLocalStorage = { ...user };
        for (const prop of Object.keys(userInLocalStorage)) {
          if (
            prop === "address" ||
            prop === "email" ||
            prop === "roleId" ||
            prop === "phoneNumber" ||
            prop === "image"
          ) {
            delete userInLocalStorage[prop];
          }
        }

        localStorage.setItem("userInfo", JSON.stringify(userInLocalStorage));
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

export const { inputChange, userLogout } = userSlice.actions;

export default userSlice.reducer;
