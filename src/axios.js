import axios from "axios";
import _ from "lodash";
import { API_APP_BACKEND_URL } from "./utils/constants";

const instance = axios.create({
  baseURL: API_APP_BACKEND_URL,
  timeout: 10000,
  // withCredentials: true
});

instance.interceptors.response.use((response) => {
  const { data } = response;
  return response.data;
});

export default instance;
