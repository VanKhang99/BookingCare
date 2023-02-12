import React, { useState } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getDetailDoctor } from "../slices/doctorSlice";
import { getSchedules } from "../slices/scheduleSlice";
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
  const dispatch = useDispatch();
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

  const handleGetSchedules = async (id, timeStamp) => {
    try {
      const res = await dispatch(getSchedules({ id: +id, timeStamp: `${timeStamp}`, keyMap: "doctorId" }));
      if (res?.payload?.schedules) {
        return setState({ ...state, schedules: res.payload.schedules });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="outstanding-doctor-container">
      <div className="outstanding-doctor-content">
        <Header />

        <div>
          <Introduce id={id ? id : ""} remote={remote} />

          <div className="schedule u-wrapper">
            <DateOptions id={id ? id : ""} inSpecialty onGetSchedules={handleGetSchedules} />

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
