import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { MenuSystem } from "../system";
import { getUser } from "../slices/systemReduxSlice";

const SharedLayout = () => {
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleGetUser = async () => {
    if (userInfo && userInfo.id) {
      const res = await dispatch(getUser(userInfo.id));
      return setUserData({ ...res.payload.user });
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <>
      <MenuSystem roleId={userData && userData.roleId ? userData.roleId : ""} />
      <Outlet />
    </>
  );
};

export default SharedLayout;
