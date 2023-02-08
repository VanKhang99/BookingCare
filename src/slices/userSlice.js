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

    thunkAPI.dispatch(handleChangePathSystem("/system"));
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
