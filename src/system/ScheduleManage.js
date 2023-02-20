import React, { useState, useEffect, useCallback, memo } from "react";
import dayjs from "dayjs";
import Select from "react-select";
import _ from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import { DatePicker, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSchedules } from "../slices/scheduleSlice";
import { getAllCode } from "../slices/allcodeSlice";
import { getSchedules } from "../slices/scheduleSlice";
import { DATE_FORMAT } from "../utils/constants";
import { IoReload } from "react-icons/io5";
import Button from "react-bootstrap/Button";
import "./styles/ScheduleManage.scss";

const initialState = {
  sizeDatePicker: "medium",
  selectedDoctor: "",
  selectedPackage: "",
  date: "",
  hoursList: [],
  initHoursList: [],
};

const ScheduleManage = ({ doctors, packages, scheduleOf, isDoctorAccount }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleHoursList = async () => {
    const res = await dispatch(getAllCode("TIME"));
    if (res && res.payload && res.payload.allCode.length > 0) {
      setState({ ...state, hoursList: res.payload.allCode, initHoursList: res.payload.allCode });
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

  const handleSelectedDate = async (date, dateString) => {
    try {
      if (!isDoctorAccount) {
        if (_.isEmpty(state.selectedPackage) && scheduleOf === "package") {
          return toast.error("Package not yet chosen!");
        } else if (_.isEmpty(state.selectedDoctor) && scheduleOf === "doctor") {
          return toast.error("Doctor not yet chosen!");
        }
      }

      const timeStampToRequestData = moment(dateString, "DD/MM/YYYY").valueOf();

      const res = await dispatch(
        getSchedules({
          id: state.selectedDoctor.value,
          timeStamp: `${timeStampToRequestData}`,
          keyMap: "doctorId",
          timesFetch: "not-initial-fetch",
        })
      );

      if (res.payload.schedules.length > 0) {
        const listTimeFrameCreated = res.payload.schedules.map((schedule) => schedule.timeType);
        const newHourList = state.hoursList.map((hour) => {
          if (!listTimeFrameCreated.includes(hour.keyMap)) return hour;
          return { ...hour, isSelected: true };
        });

        return setState({ ...state, date: dateString, hoursList: newHourList });
      }

      console.log(res);

      // setState({ ...state, date: dateString });
    } catch (error) {
      console.error(error);
    }
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
    if (!isDoctorAccount) {
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
      if (isDoctorAccount) {
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
    <div className="schedule-manage container">
      <div className="u-main-title mt-3">{t("schedule-manage.title")}</div>

      <div className="schedule-manage-content mt-3">
        <div className="select-doctor col-6 mt-5">
          {!isDoctorAccount && (
            <h4 className="u-input-label">
              {doctors ? t("schedule-manage.choose-doctor") : t("schedule-manage.choose-package")}
            </h4>
          )}

          {isDoctorAccount && (
            <h4 className="u-input-label">
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
          )}

          {doctors?.length > 0 && !isDoctorAccount && (
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

        <div className="select-date col-6 mt-5">
          <h4 className="u-input-label">{t("schedule-manage.choose-date")}</h4>

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

        <div className="select-hours mt-5 col-6">
          <h4 className="u-input-label mb-3 d-flex justify-content-between">
            {t("schedule-manage.time-frame")}
            <button
              className="u-system-button--refresh-data"
              onClick={() => setState({ ...initialState, hoursList: state.initHoursList })}
            >
              <IoReload />
            </button>
          </h4>

          <ul className="hours-list">
            {state.hoursList &&
              state.hoursList.length > 0 &&
              state.hoursList.map((time) => {
                return (
                  <li key={time.id} className="hours-list__item">
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

        <div className="u-system-button my-4 d-flex justify-content-end gap-3 col-6">
          <Button variant="danger">{t("button.delete")}</Button>
          <Button variant="primary" onClick={handleSaveSchedule}>
            {t("schedule-manage.button-schedule")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(ScheduleManage);
