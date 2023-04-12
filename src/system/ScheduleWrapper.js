import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctors } from "../slices/doctorSlice";
import { getAllPackages } from "../slices/packageSlice";
import { ScheduleManage } from "./index";

const ScheduleWrapper = ({ isDoctorAccount, scheduleOf, profilePage }) => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((store) => store.doctor);
  const { packageArr } = useSelector((store) => store.package);

  useEffect(() => {
    if (scheduleOf === "doctor") {
      dispatch(getAllDoctors("all"));
    } else {
      dispatch(getAllPackages({ clinicId: null, specialId: null, getAll: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleOf]);

  return (
    <ScheduleManage
      doctors={doctors}
      packages={packageArr}
      scheduleOf={scheduleOf}
      isDoctorAccount={isDoctorAccount}
      profilePage={profilePage}
    />
  );
};

export default ScheduleWrapper;
