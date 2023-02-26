import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

// export const postImageToS3 = createAsyncThunk("awsS3/postImageToS3", async (formData, thunkAPI) => {
//   try {
//     const res = await axios.post(`/api/awsS3/post-image`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return res;
//   } catch (error) {
//     return error.response.data;
//   }
// });

// export const deleteImageOnS3 = async (imageName) => {
//   try {
//     const deleteImageFromS3 = await axios.delete(`/api/awsS3/delete-image/${imageName}`);

//     if (deleteImageFromS3.status !== 204) {
//       throw new Error("Delete image in s3 bucket failed. Please check and try again!");
//     }

//     return;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
