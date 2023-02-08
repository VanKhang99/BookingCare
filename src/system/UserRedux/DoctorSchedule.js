import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctors } from "../../slices/doctorSlice";
import { ScheduleManage } from "../index";

const DoctorSchedule = ({ isDoctorManage }) => {
  const dispatch = useDispatch();
  const { doctors } = useSelector((store) => store.doctor);

  useEffect(() => {
    dispatch(getAllDoctors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ScheduleManage doctors={doctors} scheduleOf="doctor" isDoctorManage={isDoctorManage} />;
};

export default DoctorSchedule;
