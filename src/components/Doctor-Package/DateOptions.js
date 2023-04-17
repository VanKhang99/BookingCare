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

  const handleScheduleFuture = (schedulesArr) => {
    if (!schedulesArr.length) return [];

    const curDate = new Date();
    curDate.setMinutes(curDate.getMinutes() + 30);
    curDate.setHours(curDate.getHours() + 7);
    // console.log("curDate", curDate);
    // console.log(curDate.getTime());

    const newSchedules = schedulesArr
      .reduce((acc, schedule) => {
        const hour = schedule.timeTypeData.valueVi.split(" - ")[0];
        // console.log(hour);

        const dateConvertToCompare = new Date();
        dateConvertToCompare.setHours(+hour.split(":")[0] + 7);
        dateConvertToCompare.setMinutes(hour.split(":")[1]);
        dateConvertToCompare.setSeconds(0);

        // console.log(typeof dateConvertToCompare.getTime());
        // console.log("dateConvertToCompare", dateConvertToCompare);
        // console.log(dateConvertToCompare > curDate);

        if (+dateConvertToCompare.getTime() > +curDate.getTime()) acc.push(schedule);
        return acc;
      }, [])
      .sort((a, b) => +a.frameTimestamp - +b.frameTimestamp);

    return newSchedules;
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
        })
      );

      if (initFetch) {
        const schedulesRealtime = handleScheduleFuture(res.payload.schedules);
        if (!schedulesRealtime.length) {
          const { dateSelected, schedules } = await handleGetScheduleNextDay();
          if (schedules.length) {
            onUpdateSchedules(schedules);
            return setState({
              ...state,
              dateSelected,
              initialFetch: false,
            });
          }
          return onUpdateSchedules([]);
        }

        return onUpdateSchedules(schedulesRealtime);
      }

      return onUpdateSchedules(res.payload.schedules);
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
    console.log(optionDateSelected);

    optionDateSelected === initDateSelected
      ? handleGetSchedules(optionDateSelected, true)
      : handleGetSchedules(optionDateSelected, false);

    return setState({
      ...state,
      dateSelected: optionDateSelected,
    });
  };

  useEffect(() => {
    if (!state.optionsDate.length) return;
    handleGetSchedules(initDateSelected, state.initialFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.optionsDate.length]);

  useEffect(() => {
    createOptionsDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, state.initialFetch]);

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
