import React, { useState, useEffect, useCallback, memo } from "react";
import dayjs from "dayjs";
import Select from "react-select";
import _ from "lodash";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { DatePicker, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSchedules } from "../slices/scheduleSlice";
import { getAllCodes } from "../slices/allcodeSlice";
import { getSchedules, deleteSchedules } from "../slices/scheduleSlice";
import { IoReload } from "react-icons/io5";
import { DATE_FORMAT } from "../utils/constants";
import "./styles/ScheduleManage.scss";

const initialState = {
  sizeDatePicker: "medium",

  selectedDoctor: "",
  selectedPackage: "",
  dateString: "",

  hoursList: [],
  initHoursList: [],
};

const ScheduleManage = ({ doctors, packages, scheduleOf, isDoctorAccount }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const disabledDate = useCallback((current) => {
    // Can not select days before today and today
    return current < dayjs().startOf("day");
  }, []);

  const handleHoursList = async () => {
    try {
      const res = await dispatch(getAllCodes("TIME"));
      if (res?.payload?.allCode?.length > 0) {
        setState({ ...state, hoursList: res.payload.allCode, initHoursList: res.payload.allCode });
      }
    } catch (error) {
      console.log(error);
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
        const {
          moreData: { firstName, lastName },
        } = doctor;
        const fullName = language === "vi" ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;

        return { value: doctor.doctorId, label: fullName };
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

  const handleCheckInput = () => {
    if (!state.selectedDoctor && scheduleOf === "doctor") return false;
    if (!state.selectedPackage && scheduleOf === "package") return false;
    if (!state.dateString) return false;

    return true;
  };

  const dataToRequestServer = (dateString) => {
    let id, typeId;
    if (!isDoctorAccount) {
      id = scheduleOf === "doctor" ? state.selectedDoctor.value : state.selectedPackage.value;
      typeId = scheduleOf === "doctor" ? "doctorId" : "packageId";
    } else {
      id = JSON.parse(localStorage.getItem("userInfo")).id;
      typeId = "doctorId";
    }

    const timeStampOfDateSelected = moment(dateString, "DD/MM/YYYY").valueOf();
    return { id, typeId, timeStampOfDateSelected };
  };

  const handleSelectedDate = async (date, dateString) => {
    try {
      if (!isDoctorAccount) {
        if (_.isEmpty(state.selectedPackage) && scheduleOf === "package")
          return toast.error("Package not yet chosen!");
        if (_.isEmpty(state.selectedDoctor) && scheduleOf === "doctor")
          return toast.error("Doctor not yet chosen!");
      }

      const { id, typeId, timeStampOfDateSelected } = dataToRequestServer(dateString);

      const res = await dispatch(
        getSchedules({
          id,
          timeStamp: `${timeStampOfDateSelected}`,
          keyMap: typeId,
          timesFetch: "not-initial-fetch",
        })
      );

      if (res.payload.schedules?.length > 0) {
        const timeFrameCreated = res.payload.schedules.map((schedule) => schedule.timeType);
        const newHourList = state.hoursList.map((hour) => {
          if (!timeFrameCreated.includes(hour.keyMap)) return { ...hour, isSelected: false };
          return { ...hour, isSelected: true };
        });

        return setState({ ...state, dateString, hoursList: newHourList });
      }

      return setState({ ...state, dateString, hoursList: state.initHoursList });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedHour = (hour) => {
    if (!isDoctorAccount) {
      if (!handleCheckInput())
        return toast.error(
          language === "vi"
            ? `Xin vui lòng chọn đầy đủ các thông tin cần thiết!!!`
            : `Please select full required information!!!`
        );
    } else {
      if (!state.dateString) return toast.error("Date is not selected!");
    }

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
    if (!isDoctorAccount) {
      if (!handleCheckInput())
        return toast.error(
          language === "vi"
            ? `Xin vui lòng chọn đầy đủ các thông tin cần thiết!!!`
            : `Please select full required information!!!`
        );
    } else {
      if (!state.dateString) return toast.error("Date is not selected!");
    }

    try {
      console.log(state);
      let result = [];
      let timeSelected = state.hoursList.filter((hour) => hour.isSelected === true);
      if (!timeSelected.length) {
        return toast.error(
          `${language === "vi"}`
            ? "Vui lòng chọc các khung giờ khám bệnh phù hợp!!!"
            : `Time frame for medical examination hasn't been selected!`
        );
      }

      timeSelected = timeSelected.forEach((time) => {
        // console.log(time);
        const objectTime = {};
        if (isDoctorAccount) {
          objectTime.doctorId = JSON.parse(localStorage.getItem("userInfo")).id;
        } else {
          scheduleOf === "doctor"
            ? (objectTime.doctorId = state.selectedDoctor.value)
            : (objectTime.packageId = state.selectedPackage.value);
        }

        objectTime.date = moment(state.dateString, "DD/MM/YYYY").valueOf();
        objectTime.timeType = time.keyMap;
        objectTime.maxNumber = 5;

        const frameTimestamp = new Date();
        const hourStartToExam = time.valueVi.split(" - ")[0];
        frameTimestamp.setHours(hourStartToExam.split(":")[0]);
        frameTimestamp.setMinutes(hourStartToExam.split(":")[1]);
        objectTime.frameTimestamp = frameTimestamp.getTime();

        result.push(objectTime);
      });

      if (result?.length > 0) {
        const res = await dispatch(
          createSchedules({
            dataSchedule: result,
            keyMap: `${scheduleOf === "doctor" || isDoctorAccount ? "doctorId" : "packageId"}`,
          })
        );
        if (res?.payload?.status === "success") {
          toast.success(res.payload.message);
          return setState({
            ...initialState,
            hoursList: state.initHoursList,
            initHoursList: state.initHoursList,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!isDoctorAccount) {
      if (!handleCheckInput())
        return toast.error(
          language === "vi"
            ? `Xin vui lòng chọn đầy đủ các thông tin cần thiết!!!`
            : `Please select full required information!!!`
        );
    } else {
      if (!state.dateString) return toast.error("Date is not selected!");
    }

    try {
      alert("Are you sure you want to delete?");

      const schedulesDelete = state.hoursList.filter((hour) => hour.isSelected);
      const { id, typeId, timeStampOfDateSelected } = dataToRequestServer(state.dateString);

      const res = await dispatch(
        deleteSchedules({
          typeId,
          id,
          date: timeStampOfDateSelected,
          schedules: schedulesDelete,
        })
      );

      // console.log(res);

      toast.success("Schedule is deleted successfully!");
      return setState({
        ...initialState,
        hoursList: state.initHoursList,
        initHoursList: state.initHoursList,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetState = () => {
    return setState({
      ...initialState,
      hoursList: state.initHoursList,
      initHoursList: state.initHoursList,
    });
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
              {scheduleOf === "doctor"
                ? t("schedule-manage.choose-doctor")
                : t("schedule-manage.choose-package")}
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

          {doctors?.length > 0 && !isDoctorAccount && scheduleOf === "doctor" && (
            <div className="mt-3">
              <Select
                value={state.selectedDoctor}
                onChange={(option) => handleChangeSelect(option, "selectedDoctor")}
                options={handleOptionsSelect("doctor")}
              />
            </div>
          )}

          {packages?.length > 0 && scheduleOf === "package" && (
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
                defaultValue={null}
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
            <button className="u-system-button--refresh-data" onClick={handleResetState}>
              <IoReload />
            </button>
          </h4>

          <ul className="hours-list">
            {state.hoursList?.length > 0 &&
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
          <Button variant="danger" onClick={handleDeleteSchedule}>
            {t("button.delete")}
          </Button>
          <Button variant="primary" onClick={handleSaveSchedule}>
            {t("schedule-manage.button-schedule")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(ScheduleManage);
