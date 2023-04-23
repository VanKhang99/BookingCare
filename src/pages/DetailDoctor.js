import React, { useState, useEffect } from "react";
import HtmlReactParser from "html-react-parser";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getDoctor } from "../slices/doctorSlice";
import { dataModalBooking, helperDisplayNameDoctor } from "../utils/helpers";
import {
  DateOptions,
  BookingHours,
  ClinicInfo,
  ModalBooking,
  Introduce,
  Loading,
  PluginsFacebook,
} from "../components";
import "../styles/DetailDoctor.scss";

const initialState = {
  isOpenModalBooking: false,
  hourClicked: "",
  schedules: [],

  action: "",
};

const DetailDoctor = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  const { id } = useParams();
  const { doctorId } = useParams();
  const { language } = useSelector((store) => store.app);
  const doctor = useFetchDataBaseId(id || doctorId, "doctor", getDoctor);

  const handleModal = (hourClicked, doctorId = null, packageId = null) => {
    return setState({
      ...state,
      isOpenModalBooking: !state.isOpenModalBooking,
      hourClicked: { ...hourClicked },
    });
  };

  const handleUpdateSchedules = (schedulesArr) => {
    setState({ ...state, schedules: schedulesArr });
  };

  useEffect(() => {
    if (!_.isEmpty(doctor)) {
      document.title = helperDisplayNameDoctor(doctor, language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_.isEmpty(doctor), language]);

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
              {doctor?.aboutHTML && HtmlReactParser(doctor?.aboutHTML)}
            </div>
          </div>
          <div className="outstanding-doctor-feedback u-wrapper">
            <PluginsFacebook />
          </div>

          <div className="modal-booking">
            <ModalBooking
              show={state.isOpenModalBooking}
              onHide={handleModal}
              doctorId={doctorId}
              doctorData={dataModalBooking(language, doctor, "doctor")}
              hourClicked={!_.isEmpty(state.hourClicked) && state.hourClicked}
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
