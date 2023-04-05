import axios from "axios";
import { API_APP_BACKEND_URL } from "./utils/constants";

const instance = axios.create({
  baseURL: API_APP_BACKEND_URL,
  timeout: 10000,
  // withCredentials: true
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

instance.interceptors.response.use((response) => {
  const { data } = response;
  return response.data;
});

export default instance;
