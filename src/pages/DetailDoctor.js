import React, { useState, useEffect, useRef } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getDetailDoctor } from "../slices/doctorSlice";
import { getSchedules } from "../slices/scheduleSlice";
import { getToday, formatDate } from "../utils/helpers";
import {
  Header,
  Footer,
  DateOptions,
  BookingHours,
  ClinicInfo,
  ModalBooking,
  Introduce,
} from "../components";
import "../styles/DetailDoctor.scss";

const initialState = {
  isOpenModalBooking: false,
  dateSelected: getToday().value,
  optionsDate: [],
  hourBooked: {},
  schedules: [],

  action: "",
};

const DetailDoctor = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { id } = useParams();
  const { language } = useSelector((store) => store.app);
  const doctor = useFetchDataBaseId(id, "doctor", getDetailDoctor);
  const previousLanguage = useRef(localStorage.getItem("language"));

  const handleModal = (hourClicked, action = "") => {
    if (action === "full-booking") {
      return setState({
        ...state,
        isOpenModalBooking: !state.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    }
    return setState({
      ...state,
      isOpenModalBooking: !state.isOpenModalBooking,
      hourClicked: { ...hourClicked },
      action,
    });
  };

  const handleGetSchedules = async (data) => {
    if (!data) return;

    let currentDate;
    let timeStampToRequestData;
    const currentYear = new Date().getFullYear();

    if (language === "vi") {
      currentDate = `${data?.split(" - ")[1]}/${currentYear}`;
    } else if (language === "en") {
      currentDate = `${data?.split(" - ")[1].split("/").reverse().join("/")}/${currentYear}`;
    }

    // console.log(currentDate);

    if (previousLanguage.current === "vi") {
      timeStampToRequestData = moment(
        currentDate,
        `${language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"}`
      ).valueOf();
    } else {
      timeStampToRequestData = moment(
        currentDate,
        `${language === "vi" ? "MM/DD/YYYY" : "DD/MM/YYYY"}`
      ).valueOf();
    }

    try {
      const res = await dispatch(
        getSchedules({ id: +id, timeStamp: `${timeStampToRequestData}`, keyMap: "doctorId" })
      );
      // console.log(res);

      if (res?.payload?.schedules.length) {
        return setState({ ...state, schedules: res.payload.schedules });
      } else {
        return setState({ ...state, schedules: [] });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (e) => {
    const optionDateSelected = state.optionsDate.find((date) =>
      date.includes(e.target.value?.split(" - ")[0])
    );

    setState({
      ...state,
      dateSelected: optionDateSelected ? optionDateSelected : state.dateSelected,
    });

    handleGetSchedules(optionDateSelected);
  };

  const createOptionsDate = () => {
    let dates = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);

      const finalDateString = formatDate(date, language);
      dates.push(finalDateString);
    }

    let currentDate = getToday().date;
    if (currentDate === dates[0].split(" - ")[1]) {
      dates[0] = `${language === "vi" ? "Hôm nay" : "Today"} - ${currentDate}`;
    }

    console.log(state.dateSelected);

    //When change language prevent dateSelected come back fistDay of the list
    let dateSelectedCopy = state.dateSelected;
    // dateSelectedCopy = dateSelectedCopy?.split(" - ")[1]; // DD/MM or MM/DD
    // .split("/") // [DD, MM] or [MM, DD]
    // .join("/"); // MM/DD or DD/MM
    // .reverse() // [MM, DD] or [DD, MM]
    if (language === "vi") {
      dateSelectedCopy = dateSelectedCopy?.split(" - ")[1];
    } else {
      dateSelectedCopy = dateSelectedCopy?.split(" - ")[1].split("/").reverse().join("/");
    }

    console.log(dateSelectedCopy);
    console.log(dates);

    dateSelectedCopy = dates.find((date) => date.includes(dateSelectedCopy));
    console.log(dateSelectedCopy);

    // console.log(dates);

    return setState({
      ...state,
      optionsDate: [...dates],
      dateSelected: dateSelectedCopy ? dateSelectedCopy : state.dateSelected,
    });
  };

  useEffect(() => {
    createOptionsDate();
    previousLanguage.current = language;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, state.optionsDate.length]);

  useEffect(() => {
    handleGetSchedules(state.dateSelected);
    // previousLanguage.current = language;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // console.log(state.dateSelected);

  return (
    <div className="outstanding-doctor-container">
      <div className="outstanding-doctor-content">
        <Header />

        <div>
          <Introduce id={id ? id : ""} remote={remote} />

          <div className="schedule u-wrapper">
            {state.optionsDate.length > 0 && (
              <DateOptions
                id={id ? id : ""}
                inSpecialty
                // onGetSchedules={handleGetSchedules}
                dateSelected={state.dateSelected}
                onDateChange={handleDateChange}
                optionsDate={state.optionsDate}
              />
            )}

            <div className="hours-address-price row">
              <BookingHours schedules={state.schedules ? state.schedules : []} onToggleModal={handleModal} />
              <ClinicInfo id={id} needAddress={true} remote={remote} assurance={true} />
            </div>
          </div>

          <div className="outstanding-doctor">
            <div className="outstanding-doctor__background  u-wrapper">
              {doctor?.anotherInfo?.aboutHTML && HtmlReactParser(doctor.anotherInfo.aboutHTML)}
            </div>
          </div>
          <div className="outstanding-doctor-feedback u-wrapper">Feedback</div>
        </div>

        <Footer />
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={state.isOpenModalBooking}
          onHide={handleModal}
          doctor={doctor}
          action={state.action}
          hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
        />
      </div>
    </div>
  );
};

export default DetailDoctor;
