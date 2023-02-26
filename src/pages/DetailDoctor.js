import React, { useState } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getDetailDoctor } from "../slices/doctorSlice";
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
  hourBooked: {},
  schedules: [],

  action: "",
};

const DetailDoctor = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  // const dispatch = useDispatch();
  const { id } = useParams();
  // const { language } = useSelector((store) => store.app);
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
      <div className="outstanding-doctor-content">
        <Header />

        <div>
          <Introduce id={id ? id : ""} remote={remote} />

          <div className="schedule u-wrapper">
            <DateOptions inSpecialty id={id ? id : ""} onUpdateSchedules={handleUpdateSchedules} />

            <div className="hours-address-price row">
              <BookingHours
                schedules={state.schedules.length > 0 ? state.schedules : []}
                onToggleModal={handleModal}
              />
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
