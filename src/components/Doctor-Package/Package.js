import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdLocationOn } from "react-icons/md";
import { getSchedules } from "../../slices/scheduleSlice";
import { Introduce, DateOptions, BookingHours, ClinicInfo } from "../index";
import "../../styles/DoctorOrPackage.scss";

const initialState = {
  schedules: [],
};

const Package = ({ id, packageData, onToggleModal, packageClinicSpecialty }) => {
  const [state, setState] = useState({ ...initialState });
  const { language } = useSelector((store) => store.app);

  const handleUpdateSchedules = (schedulesArr) => {
    return setState({ ...state, schedules: schedulesArr });
  };

  return (
    <>
      <li className="package">
        <div className="package-left">
          <Introduce
            id={+id}
            small
            buttonSeeMore
            packageData={packageData}
            packageClinicSpecialty={packageClinicSpecialty}
          />

          <div className="package-location">
            <MdLocationOn />
            <span>
              {language === "vi"
                ? packageData.provincePackage?.valueVi
                : packageData.provincePackage?.valueEn}
            </span>
          </div>
        </div>

        <div className="package-right">
          <DateOptions
            id={id}
            small
            onUpdateSchedules={handleUpdateSchedules}
            keyMapFetchPackage="packageId"
          />
          <BookingHours
            packageId={id}
            schedules={state.schedules ? state.schedules : []}
            onToggleModal={onToggleModal}
            small
          />
          <ClinicInfo id={id} small packageData={packageData} />
        </div>
      </li>
    </>
  );
};

export default Package;
