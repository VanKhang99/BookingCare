import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { MenuSystem } from "../system";
import { getUser } from "../slices/userSlice";

const SharedLayout = () => {
  const { userInfo } = useSelector((store) => store.user);

  return (
    <>
      <MenuSystem roleId={userInfo?.roleId ? userInfo.roleId : ""} />
      <Outlet />
    </>
  );
};

export default SharedLayout;
