import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
});

instance.interceptors.request.use(function (config) {
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  return config;
});

instance.interceptors.response.use((response) => {
  return response.data;
});

export default instance;
