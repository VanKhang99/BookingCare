import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getToday, formatDate } from "../../utils/helpers";
import { getSchedules } from "../../slices/scheduleSlice";
import "../../styles/DateOptions.scss";

const initialState = {
  dateSelected: "",
  optionsDate: [],

  initialFetch: true,
};

const DateOptions = ({ small, id, onUpdateSchedules, keyMapFetchPackage }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const initDateSelected = useMemo(() => {
    return getToday().value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  console.log(id);

  const handleGetScheduleNextDay = async () => {
    try {
      let newDateSelected = new Date();
      newDateSelected.setDate(newDateSelected.getDate() + 1);
      newDateSelected = formatDate(newDateSelected, language);

      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setMonth(currentDate.getMonth() + 1);

      const nextDay =
        language === "vi"
          ? `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`
          : `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      const timeStampToRequestData = moment(
        nextDay,
        `${language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"}`
      ).valueOf();

      const resultHoursNextDay = await dispatch(
        getSchedules({
          id: +id,
          timeStamp: `${timeStampToRequestData}`,
          keyMap: keyMapFetchPackage ? "packageId" : "doctorId",
          timesFetch: "not-initial-fetch",
        })
      );

      return {
        dateSelected: newDateSelected,
        schedules: resultHoursNextDay.payload.schedules,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetSchedules = async (data, initFetch) => {
    if (!data) return;

    let timeStampToRequestData;
    const currentYear = new Date().getFullYear();
    const dateFormat = `${data.split(" - ")[1]}/${currentYear}`;
    timeStampToRequestData = moment(
      dateFormat,
      `${language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"}`
    ).valueOf();

    try {
      const res = await dispatch(
        getSchedules({
          id: +id,
          timeStamp: `${timeStampToRequestData}`,
          keyMap: keyMapFetchPackage ? "packageId" : "doctorId",
          timesFetch: initFetch ? "initial-fetch" : "not-initial-fetch",
        })
      );

      console.log(res);

      if (!res?.payload?.schedules.length) {
        if (initFetch) {
          const { dateSelected, schedules } = await handleGetScheduleNextDay();
          if (schedules.length > 0) {
            onUpdateSchedules(schedules);
            return setState({
              ...state,
              dateSelected,
              initialFetch: false,
            });
          }
          onUpdateSchedules(state.schedules);
        }
        onUpdateSchedules([]);
      }
      onUpdateSchedules(res.payload.schedules);
    } catch (error) {
      console.error(error);
    }
  };

  const createOptionsDate = () => {
    let dates = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(state.initialFetch ? date.getDate() + i : date.getDate() + i + 1);

      const finalDateString = formatDate(date, language);
      dates.push(finalDateString);
    }

    let currentDate = getToday().date;
    if (currentDate === dates[0].split(" - ")[1]) {
      dates[0] = `${language === "vi" ? "Hôm nay" : "Today"} - ${currentDate}`;
    }

    //When change language prevent dateSelected come back fistDay of the list
    let findDateSelected;
    if (state.dateSelected) {
      const dateSelectedSplit = state.dateSelected.split(" - ")[1];
      const dateSelectedSplitReverse = state.dateSelected.split(" - ")[1].split("/").reverse().join("/");

      findDateSelected = dates.find(
        (date) => date.includes(dateSelectedSplit) || date.includes(dateSelectedSplitReverse)
      );
    }

    return setState({
      ...state,
      optionsDate: [...dates],
      dateSelected: findDateSelected || initDateSelected,
    });
  };

  const handleDateChange = (e) => {
    const optionDateSelected = state.optionsDate.find((date) => date.includes(e.target.value));

    optionDateSelected === initDateSelected
      ? handleGetSchedules(optionDateSelected, true)
      : handleGetSchedules(optionDateSelected, false);

    return setState({
      ...state,
      dateSelected: optionDateSelected,
    });
  };

  useEffect(() => {
    handleGetSchedules(initDateSelected, state.initialFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    createOptionsDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, state.optionsDate.length]);

  return (
    <>
      <div className={`date-options ${small ? "small" : ""}`}>
        <select value={state.dateSelected} onChange={handleDateChange}>
          {state.optionsDate?.map((date, index) => {
            return (
              <option key={index} value={date}>
                {date}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default DateOptions;
