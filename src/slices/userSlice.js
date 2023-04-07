import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

import { handleChangePathSystem } from "./appSlice";
import { setAuthToken } from "../utils/helpers";

const initialState = {
  isLoggedIn: false,
  userInfo: null,

  urlNavigateBack: "",
};

export const login = createAsyncThunk("user/login", async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/login", { email, password });

    return res;
  } catch (error) {
    throw error.response.data;
  }
});

export const socialLogin = createAsyncThunk("user/socialLogin", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/social-login", data);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
});

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/users/logout");
    thunkAPI.dispatch(handleChangePathSystem("/"));

    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getConfirmCode = createAsyncThunk("user/getConfirmCode", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/send-code", data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const verifyCode = createAsyncThunk("user/verifyCode", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/verify-code", data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const signUp = createAsyncThunk("user/signUp", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/signup", data);
    // const token = res.payload.token;
    // localStorage.setItem("token", token);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const forgotPassword = createAsyncThunk("user/forgotPassword", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/forgot-password", data);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const resetPassword = createAsyncThunk("user/resetPassword", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/users/reset-password", data);
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

export const getProfile = createAsyncThunk("user/getProfile", async (data, thunkAPI) => {
  try {
    const user = await axios.get(`/api/users/profile`);
    return user.data;
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
  reducers: {
    autoLogin(state, { payload }) {
      state.isLoggedIn = true;
      state.userInfo = payload;
    },

    autoNavigateToLoginAndBack(state, { payload }) {
      state.urlNavigateBack = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        const { user } = payload.data;
        const userCopy = JSON.parse(JSON.stringify(user));
        for (const prop of Object.keys(userCopy)) {
          if (prop === "firstName" || prop === "lastName" || prop === "roleId" || prop === "imageUrl") {
            continue;
          } else {
            delete userCopy[prop];
          }
        }
        const userSaveToRedux = JSON.parse(JSON.stringify({ ...userCopy, id: user.id }));

        state.isLoggedIn = true;
        state.userInfo = userSaveToRedux;

        localStorage.setItem("token", payload.token);
        setAuthToken(payload.token);
        localStorage.setItem("userInfo", JSON.stringify(userCopy));
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
      })
      //LOG-OUT
      .addCase(logout.pending, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userInfo = null;
        state.urlNavigateBack = "";
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state) => {
        state.isLoggedIn = true;
      });
    //SOCIAL LOGIN
    // .addCase(socialLogin.pending, (state) => {
    //   state.isLoggedIn = false;
    // })
    // .addCase(socialLogin.fulfilled, (state, { payload }) => {
    //   console.log(payload);
    // })
    // .addCase(socialLogin.rejected, (state) => {
    //   state.isLoggedIn = false;
    //   state.userInfo = null;
    // });
  },
});

export const { autoLogin, autoNavigateToLoginAndBack } = userSlice.actions;

export default userSlice.reducer;
