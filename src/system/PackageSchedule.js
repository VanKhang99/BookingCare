import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPackages } from "./../slices/packageSlice";
import { ScheduleManage } from "./index";

const PackageSchedule = () => {
  const dispatch = useDispatch();
  const { packageArr } = useSelector((store) => store.package);

  useEffect(() => {
    dispatch(getAllPackages({ clinicId: null, specialId: null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ScheduleManage packages={packageArr} scheduleOf="package" />;
};

export default PackageSchedule;
