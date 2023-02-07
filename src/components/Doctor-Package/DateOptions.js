import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getSchedules } from "../../slices/scheduleSlice";
import { getToday, formatDate } from "../../utils/helpers";
import "../../styles/DateOptions.scss";

const initialState = {
  dateArr: [],
  dateSelected: getToday().value,
};

const DateOptions = ({ id, small, onGetSchedules }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const previousLanguage = useRef(localStorage.getItem("language"));

  const handleGetSchedules = (data) => {
    if (!data) return;

    let currentDate;
    let timeStamp;
    const currentYear = new Date().getFullYear();

    if (language === "vi") {
      currentDate = `${data?.split(" - ")[1]}/${currentYear}`;
    } else if (language === "en") {
      currentDate = `${data?.split(" - ")[1].split("/").reverse().join("/")}/${currentYear}`;
    }

    if (previousLanguage.current === "vi") {
      timeStamp = moment(currentDate, `${language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"}`).valueOf();
    } else {
      timeStamp = moment(currentDate, `${language === "vi" ? "MM/DD/YYYY" : "DD/MM/YYYY"}`).valueOf();
    }

    if (timeStamp || id) {
      dispatch(getSchedules({ id: +id, timeStamp: `${timeStamp}`, keyMap: "doctorId" }));
      onGetSchedules(+id, timeStamp);
    }
  };

  const getNext7Days = () => {
    let dates = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);

      const finalDateString = formatDate(date, language);
      dates.push(finalDateString);
    }

    let currentDate = getToday().date;

    if (currentDate === dates[0]?.split(" - ")[1]) {
      dates[0] = `${language === "vi" ? "Hôm nay" : "Today"} - ${currentDate}`;
    }

    //When change language prevent dateSelected come back fistDay of the list
    let dateSelectedCopy = state.dateSelected;
    dateSelectedCopy = dateSelectedCopy
      ?.split(" - ")[1] // DD/MM or MM/DD
      .split("/") // [DD, MM] or [MM, DD]
      .reverse() // [MM, DD] or [DD, MM]
      .join("/"); // MM/DD or DD/MM

    dateSelectedCopy = dates.find((date) => date.includes(dateSelectedCopy?.split(" - ")[0]));

    setState({
      ...state,
      dateArr: dates,
      dateSelected: dateSelectedCopy ? dateSelectedCopy : state.dateSelected,
    });
  };

  const handleDateSelected = (e) => {
    const dateSelectedCopy = state.dateArr.find((date) => date.includes(e.target.value?.split(" - ")[0]));

    setState({
      ...state,
      dateSelected: dateSelectedCopy ? dateSelectedCopy : state.dateSelected,
    });

    handleGetSchedules(dateSelectedCopy);
  };

  useEffect(() => {
    getNext7Days();
    handleGetSchedules(state.dateSelected);
    previousLanguage.current = language;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <>
      <div className={`date-options ${small ? "small" : ""}`}>
        {state.dateArr && state.dateArr.length > 0 && (
          <select value={state.dateSelected} onChange={handleDateSelected}>
            {state.dateArr.map((date, index) => {
              return (
                <option key={index} value={date}>
                  {date}
                </option>
              );
            })}
          </select>
        )}
      </div>
    </>
  );
};

export default DateOptions;
