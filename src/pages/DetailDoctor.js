import React, { useState } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getDetailDoctor } from "../slices/doctorSlice";
import { DateOptions, BookingHours, ClinicInfo, ModalBooking, Introduce, Loading } from "../components";
import "../styles/DetailDoctor.scss";

const initialState = {
  isOpenModalBooking: false,
  hourBooked: {},
  schedules: [],

  action: "",
};

const DetailDoctor = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  const { id } = useParams();
  const doctor = useFetchDataBaseId(id, "doctor", getDetailDoctor);

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

  const handleUpdateSchedules = (schedulesArr) => {
    return setState({ ...state, schedules: schedulesArr });
  };

  return (
    <div className="outstanding-doctor-container">
      {!_.isEmpty(doctor) ? (
        <>
          <Introduce id={id ? id : ""} remote={remote} doctorData={doctor} />
          <div className="schedule u-wrapper">
            <DateOptions inSpecialty id={id ? id : ""} onUpdateSchedules={handleUpdateSchedules} />

            <div className="hours-address-price row">
              <BookingHours
                schedules={state.schedules.length > 0 ? state.schedules : []}
                onToggleModal={handleModal}
              />
              <ClinicInfo id={id} needAddress={true} remote={remote} assurance={true} doctorData={doctor} />
            </div>
          </div>

          <div className="outstanding-doctor">
            <div className="outstanding-doctor__background  u-wrapper">
              {doctor.moreData.aboutHTML && HtmlReactParser(doctor.moreData.aboutHTML)}
            </div>
          </div>
          <div className="outstanding-doctor-feedback u-wrapper">Feedback</div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={handleModal}
              doctorData={!_.isEmpty(doctor) && doctor}
              action={state.action}
              hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DetailDoctor;
