import axios from "../axios";

export const getAllUsers = async () => {
  try {
    const res = await axios.get("/api/users");
    return res;
  } catch (error) {
    console.log(error.response);
  }
};

export const createUser = async (data) => {
  try {
    const res = await axios.post("/api/users", { ...data });
    return res;
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
};

export const editUser = async (userId, data) => {
  try {
    const res = await axios.patch(`/api/users/${userId}`, { ...data });
    return res;
  } catch (error) {
    console.log(error.response);
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await axios.delete(`/api/users/${userId}`);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error.response);
  }
};

export const getAllCode = async (type) => {
  try {
    const res = await axios.get(`/api/allcodes/${type}`);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error.response);
  }
};
