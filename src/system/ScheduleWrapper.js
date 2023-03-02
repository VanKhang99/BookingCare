import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctors } from "../slices/doctorSlice";
import { ScheduleManage } from "./index";

const ScheduleWrapper = ({ isDoctorAccount }) => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((store) => store.doctor);
  console.log(doctors);

  useEffect(() => {
    dispatch(getAllDoctors("all"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ScheduleManage doctors={doctors} scheduleOf="doctor" isDoctorAccount={isDoctorAccount} />;
};

export default ScheduleWrapper;
