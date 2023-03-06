import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdLocationOn } from "react-icons/md";
import { Introduce, DateOptions, BookingHours, ClinicInfo } from "../index";
import "../../styles/DoctorOrPackage.scss";

const initialState = {
  schedules: [],
};

const Package = ({ packageId, packageData, onToggleModal, needAddress, packageClinicSpecialty }) => {
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
            id={+packageId}
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
            id={packageId}
            small
            onUpdateSchedules={handleUpdateSchedules}
            keyMapFetchPackage="packageId"
          />
          <BookingHours
            packageId={packageId}
            schedules={state.schedules ? state.schedules : []}
            onToggleModal={onToggleModal}
            small
          />
          <ClinicInfo
            small
            // id={packageId}
            packageData={packageData}
            needAddress={needAddress}
            packageClinicSpecialty={packageClinicSpecialty}
          />
        </div>
      </li>
    </>
  );
};

export default Package;
