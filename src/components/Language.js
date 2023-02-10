import React from "react";
import { useDispatch } from "react-redux";
import { Select } from "antd";
import { handleChangeLanguage } from "../slices/appSlice";
import { languages } from "../utils/constants";

const Language = () => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(handleChangeLanguage(value));
  };

  return (
    <div className="language">
      <Select
        defaultValue={localStorage.getItem("language") === "vi" ? "VI" : "EN"}
        onChange={handleChange}
        options={[
          {
            value: `${languages.VI}`,
            label: "VI",
          },
          {
            value: `${languages.EN}`,
            label: "EN",
          },
        ]}
      />
    </div>
  );
};

export default Language;
