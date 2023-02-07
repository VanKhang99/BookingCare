import React, { useState } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getDetailDoctor } from "../slices/doctorSlice";
import { getSchedules } from "../slices/scheduleSlice";
import {
  Header,
  Footer,
  DateOptions,
  BookingHours,
  MedicalAddress,
  ModalBooking,
  Introduce,
} from "../components";
import "../styles/DetailDoctor.scss";

const initialState = {
  isOpenModalBooking: false,
  hourBooked: {},
  schedules: [],
};

const DetailDoctor = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { id } = useParams();
  // const { schedules } = useSelector((store) => store.doctor);
  const doctor = useFetchDataBaseId(id, "doctor", getDetailDoctor);
  console.log(remote);

  const handleModal = (hourClicked) => {
    return setState({
      ...state,
      isOpenModalBooking: !state.isOpenModalBooking,
      hourClicked: { ...hourClicked },
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
              <MedicalAddress id={id} needAddress={true} remote={remote} />
            </div>
          </div>

          <div className="more-info-container">
            <div className="more-info  u-wrapper">
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
          onHide={() => handleModal()}
          doctor={doctor}
          hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
        />
      </div>
    </div>
  );
};

export default DetailDoctor;
