import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdLocationOn } from "react-icons/md";
import { getSchedules } from "../../slices/scheduleSlice";
import { Introduce, DateOptions, BookingHours, MedicalAddress } from "../index";
import "../../styles/DoctorOrPackage.scss";

const initialState = {
  schedules: [],
};

const Doctor = ({ doctorId, doctorData, onToggleModal, needAddress, assurance, remote }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

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
    <>
      <li className="doctor">
        <div className="doctor-left">
          <Introduce id={+doctorId} small buttonSeeMore remote={remote} />

          <div className="doctor-location">
            <MdLocationOn />
            <span>
              {language === "vi" ? doctorData.provinceData?.valueVi : doctorData.provinceData?.valueEn}
            </span>
          </div>
        </div>

        <div className="doctor-right">
          <DateOptions id={doctorId} small onGetSchedules={handleGetSchedules} />
          <BookingHours
            doctorId={doctorId}
            schedules={state.schedules ? state.schedules : []}
            onToggleModal={onToggleModal}
            small
            remote={remote}
          />
          <MedicalAddress
            id={doctorId}
            small
            needAddress={needAddress}
            assurance={assurance}
            remote={remote}
          />
        </div>
      </li>
    </>
  );
};

export default Doctor;
