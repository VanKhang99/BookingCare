import React, { useState, useEffect, useCallback, memo } from "react";
import dayjs from "dayjs";
import Select from "react-select";
import _ from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSchedules } from "../slices/scheduleSlice";
import { getAllCode } from "../slices/allcodeSlice";
import { DatePicker, Space } from "antd";
import { DATE_FORMAT } from "../utils/constants";
import Button from "react-bootstrap/Button";
import "./styles/ScheduleManage.scss";

const initialState = {
  sizeDatePicker: "medium",
  selectedDoctor: "",
  selectedPackage: "",
  date: "",
  hoursList: [],
};

const ScheduleManage = ({ doctors, packages, scheduleOf, isDoctorManage }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleHoursList = async () => {
    const res = await dispatch(getAllCode("TIME"));
    if (res && res.payload && res.payload.allCode.length > 0) {
      setState({ ...state, hoursList: res.payload.allCode });
    }
  };

  const handleChangeSelect = (selectedOption, type) => {
    const stateCopy = { ...state };
    stateCopy[type] = selectedOption;
    return setState({
      ...stateCopy,
    });
  };

  const handleOptionsSelect = (type) => {
    let objectOptions;
    if (type === "doctor" && doctors.length > 0) {
      objectOptions = doctors.map((doctor) => {
        const fullName =
          language === "vi"
            ? `${doctor.lastName} ${doctor.firstName}`
            : `${doctor.firstName} ${doctor.lastName}`;

        return { value: doctor.id, label: fullName };
      });

      return objectOptions;
    } else if (type === "package" && packages.length > 0) {
      objectOptions = packages.map((pk) => {
        const packageName = language === "vi" ? `${pk.nameVi}` : `${pk.nameEn}`;

        return { value: pk.id, label: packageName };
      });

      return objectOptions;
    }
  };

  const disabledDate = useCallback((current) => {
    // Can not select days before today and today
    return current < dayjs().startOf("day");
  }, []);

  const handleSelectedDate = (date, dateString) => {
    setState({ ...state, date: dateString });
  };

  const handleSelectedHour = (hour) => {
    const hourCopy = { ...hour };
    hourCopy.isSelected = !hourCopy.isSelected;

    const newHoursList = [...state.hoursList].map((time) => {
      if (time.id === hourCopy.id) {
        time = { ...hourCopy };
      }

      return time;
    });

    setState({
      ...state,
      hoursList: newHoursList,
    });
  };

  const handleSaveSchedule = async () => {
    let result = [];
    if (!isDoctorManage) {
      if (_.isEmpty(state.selectedPackage) && scheduleOf === "package") {
        return toast.error("Package not yet chosen!");
      } else if (_.isEmpty(state.selectedDoctor) && scheduleOf === "doctor") {
        return toast.error("Doctor not yet chosen!");
      }
    }

    if (!state.date) {
      return toast.error("Date not yet chosen!");
    }

    let timeSelected = state.hoursList.filter((hour) => hour.isSelected === true);
    if (!timeSelected.length) {
      return toast.error("Time frame for medical examination hasn't been selected!");
    }

    timeSelected = timeSelected.forEach((time) => {
      // console.log(time);
      const objectTime = {};
      if (isDoctorManage) {
        objectTime.doctorId = JSON.parse(localStorage.getItem("userInfo")).id;
      } else {
        doctors
          ? (objectTime.doctorId = state.selectedDoctor.value)
          : (objectTime.packageId = state.selectedPackage.value);
      }

      objectTime.date = moment(state.date, "DD/MM/YYYY").valueOf();
      objectTime.timeType = time.keyMap;
      objectTime.maxNumber = 5;

      const frameTimestamp = new Date();
      const hourStartToExam = time.valueVi.split(" - ")[0];
      frameTimestamp.setHours(hourStartToExam.split(":")[0]);
      frameTimestamp.setMinutes(hourStartToExam.split(":")[1]);
      objectTime.frameTimestamp = frameTimestamp.getTime();

      result.push(objectTime);
    });

    console.log(result);

    if (result?.length > 0) {
      const res = await dispatch(
        createSchedules({ dataSchedule: result, keyMap: `${doctors ? "doctorId" : "packageId"}` })
      );
      if (res?.payload?.status === "success") {
        return toast.success(res.payload.message);
      }
    }

    // return toast.error("Please select a suitable time frame for medical consultation!");
  };

  useEffect(() => {
    handleHoursList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (doctors) {
      handleOptionsSelect("doctor");
    } else {
      handleOptionsSelect("package");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="schedule container">
      <div className="schedule-content">
        <div className="schedule-content__title mt-3">{t("schedule-manage.title")}</div>

        <div className="schedule-select mt-5">
          <div className="schedule-select-doctor col-6 mt-5">
            {!isDoctorManage && (
              <div className="title">
                <h4>{doctors ? t("schedule-manage.choose-doctor") : t("schedule-manage.choose-package")}</h4>
              </div>
            )}

            {isDoctorManage && (
              <div className="doctor-name">
                <h4>
                  {language === "vi" ? "Bác sĩ" : "Doctor"}:{" "}
                  <span>
                    {language === "vi"
                      ? `${JSON.parse(localStorage.getItem("userInfo")).lastName} ${
                          JSON.parse(localStorage.getItem("userInfo")).firstName
                        }`
                      : `${JSON.parse(localStorage.getItem("userInfo")).firstName} ${
                          JSON.parse(localStorage.getItem("userInfo")).lastName
                        }`}
                  </span>
                </h4>
              </div>
            )}

            {doctors?.length > 0 && !isDoctorManage && (
              <div className="mt-3">
                <Select
                  value={state.selectedDoctor}
                  onChange={(option) => handleChangeSelect(option, "selectedDoctor")}
                  options={handleOptionsSelect("doctor")}
                />
              </div>
            )}

            {packages?.length > 0 && (
              <div className="mt-3">
                <Select
                  value={state.selectedPackage}
                  onChange={(option) => handleChangeSelect(option, "selectedPackage")}
                  options={handleOptionsSelect("package")}
                />
              </div>
            )}
          </div>

          <div className="schedule-select-date col-6 mt-5">
            <div className="title">
              <h4>{t("schedule-manage.choose-date")}</h4>
            </div>

            <div className="mt-3">
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <DatePicker
                  size={state.sizeDatePicker}
                  format={DATE_FORMAT}
                  disabledDate={disabledDate}
                  onChange={handleSelectedDate}
                  style={{
                    width: "100%",
                    padding: "7px 11px",
                    borderRadius: "4px",
                  }}
                />
              </Space>
            </div>
          </div>
        </div>

        <div className="schedule-hours mt-5">
          <div className="title mb-3">
            <h4>{t("schedule-manage.time-frame")}</h4>
          </div>

          <ul className="hours-list">
            {state.hoursList &&
              state.hoursList.length > 0 &&
              state.hoursList.map((time) => {
                return (
                  <li key={time.id} className="hours-item">
                    <button
                      className={`${time.isSelected ? "button selected" : "button"}`}
                      onClick={() => handleSelectedHour(time)}
                    >
                      {language === "vi" ? time.valueVi : time.valueEn}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>

        <div className="row">
          <div className="schedule-button mt-4">
            <Button variant="primary" onClick={handleSaveSchedule}>
              {t("schedule-manage.button-schedule")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(ScheduleManage);
