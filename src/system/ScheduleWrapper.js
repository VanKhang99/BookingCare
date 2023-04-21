import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctors } from "../slices/doctorSlice";
import { getAllPackages } from "../slices/packageSlice";
import { ScheduleManage } from "./index";

const ScheduleWrapper = ({ isDoctorAccount, scheduleOf, profilePage }) => {
  const [packageToRender, setPackageToRender] = useState([]);
  const dispatch = useDispatch();
  const { doctors } = useSelector((store) => store.doctor);
  const { packageArr } = useSelector((store) => store.package);

  useEffect(() => {
    if (scheduleOf === "doctor") {
      if (!doctors.length) {
        dispatch(getAllDoctors("all"));
      }
      return;
    }

    if (!packageArr.length) {
      dispatch(getAllPackages());
    }

    const packagesFilterById = packageArr.filter((pk) => pk.specialtyId === null);

    setPackageToRender(packagesFilterById);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleOf, doctors.length, packageArr.length]);

  return (
    <ScheduleManage
      doctors={doctors}
      packages={packageToRender}
      scheduleOf={scheduleOf}
      isDoctorAccount={isDoctorAccount}
      profilePage={profilePage}
    />
  );
};

export default ScheduleWrapper;
