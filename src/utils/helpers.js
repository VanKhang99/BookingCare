import axios from "axios";
import _ from "lodash";
import { toast } from "react-toastify";
import { API_APP_BACKEND_URL } from "./constants";

export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const isValidPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password);
};

export const isValidPhone = (number) => {
  return /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(number);
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getToday = () => {
  const language = localStorage.getItem("language");
  let currentMonth = new Date().getMonth() + 1;
  let currentDay = new Date().getDate();
  currentMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  currentDay = currentDay < 10 ? `0${currentDay}` : currentDay;

  if (language === "vi") {
    return {
      value: `Hôm nay - ${currentDay}/${currentMonth}`,
      date: `${currentDay}/${currentMonth}`,
    };
  } else {
    return {
      value: `Today - ${currentMonth}/${currentDay}`,
      date: `${currentMonth}/${currentDay}`,
    };
  }
};

export const formatDate = (date, language) => {
  const optionsDate = {
    weekday: "long",
    month: "2-digit",
    day: "2-digit",
  };

  const dateString = date.toLocaleDateString(`${language === "vi" ? "vi-VN" : "en-US"}`, optionsDate);

  const [dayOfWeek, formattedDate] = dateString.split(", ");

  const finalDateString = `${dayOfWeek} - ${formattedDate}`;

  return finalDateString;
};

export const formatterPrice = (language) => {
  const formatter = new Intl.NumberFormat(`${language === "vi" ? "vi-VN" : "en-US"}`, {
    style: "currency",
    currency: `${language === "vi" ? "VND" : "USD"}`,
  });

  return formatter;
};

export const checkData = (data, propsArrInfo) => {
  let isValid = true;

  if (_.isEmpty(data)) return (isValid = false);
  if (!data) return (isValid = false);

  for (const property of propsArrInfo) {
    if (property === "popular" || property === "haveSpecialtyPage" || property === "remote") {
      continue;
    }

    if (!data[property]) {
      isValid = false;
      break;
    }
  }

  return isValid;
};

export const covertDateToTimestamp = (dateString) => {
  const dateParts = dateString.split("/");
  let day;
  let month;
  let year;

  if (dateParts[0] > 12) {
    // "DD/MM/YYYY" format
    day = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10);
    year = parseInt(dateParts[2], 10);
  } else {
    // "MM/DD/YYYY" format
    day = parseInt(dateParts[1], 10);
    month = parseInt(dateParts[0], 10);
    year = parseInt(dateParts[2], 10);
  }

  const date = new Date(year, month - 1, day);
  const timestamp = date.getTime();
  return timestamp;
};

export const helperFilterSearch = (input, targetName) => {
  targetName = targetName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/\s/g, "");
  input = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/\s/g, "");

  return { targetName, input };
};

export const postImageToS3 = async (fileImage) => {
  try {
    const formData = new FormData();
    formData.append("uploaded_file", fileImage);

    const res = await axios.post(`${API_APP_BACKEND_URL}/api/awsS3/post-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status !== 201) return toast.error("Something went wrong when post image to S3 bucket!");
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const deleteImageOnS3 = async (imageName) => {
  try {
    const deleteImageFromS3 = await axios.delete(
      `${API_APP_BACKEND_URL}/api/awsS3/delete-image/${imageName}`
    );

    if (deleteImageFromS3.status !== 204) {
      return toast.error("Delete image in s3 bucket failed. Please check and try again!");
    }

    return;
  } catch (error) {
    console.log(error);
  }
};
