import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { MenuSystem } from "../system";
import { Header, Footer } from "../components";

const SharedLayout = ({ clientInterface }) => {
  const { userInfo } = useSelector((store) => store.user);

  return (
    <>
      {!clientInterface ? (
        <>
          <MenuSystem roleId={userInfo?.roleId ? userInfo.roleId : ""} />
          <Outlet />
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          <Outlet />
          <Footer />
        </div>
      )}
    </>
  );
};

export default SharedLayout;
