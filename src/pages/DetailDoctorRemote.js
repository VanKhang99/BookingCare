import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Footer, IntroSpecialty } from "../components";
import "../styles/DetailDoctorRemote.scss";

const initialState = {
  specialtyData: {},
  isOpenFullIntro: false,
  isOpenModalBooking: false,
  hourBooked: {},
  doctors: [],
  doctorId: "",
  doctorData: {},
};

const DetailDoctorRemote = () => {
  const [state, setState] = useState({ ...initialState });

  const handleShowMoreDataIntro = () => {
    return setState({ ...state, isOpenFullIntro: !state.isOpenFullIntro });
  };

  return (
    <div className="doctor-remote-container">
      <Header />
      <div className="doctor-remote-content">
        <IntroSpecialty
          isOpenFullIntro={state.isOpenFullIntro}
          specialtyData={state.specialtyData}
          onShowMoreDataIntro={handleShowMoreDataIntro}
        />
      </div>
    </div>
  );
};

export default DetailDoctorRemote;
