import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { toast } from "react-toastify";

const initialState = {
  isLoadingCategory: false,
  categories: [],
};

export const getAllCategories = createAsyncThunk("category/getAllCategories", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/api/categories");
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const getCategory = createAsyncThunk("category/getCategory", async (categoryId, thunkAPI) => {
  try {
    const res = await axios.get(`/api/categories/${categoryId}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

export const saveInfoCategory = createAsyncThunk("category/saveInfoCategory", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/categories", data);
    return res;
  } catch (error) {
    toast.error("Save info category failed. Please check your data and try again!");
    return error.response.data;
  }
});

export const deleteCategory = createAsyncThunk("category/deleteCategory", async (categoryId, thunkAPI) => {
  try {
    const res = await axios.delete(`/api/categories/${categoryId}`);
    return res;
  } catch (error) {
    return error.response.data;
  }
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET ALL CATEGORIES
      .addCase(getAllCategories.pending, (state) => {
        state.isLoadingCategory = true;
      })
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        state.isLoadingCategory = false;
        state.categories = payload.data.categories;
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.isLoadingCategory = false;
      });
  },
});

export const {} = categorySlice.actions;

export default categorySlice.reducer;
