import React from "react";
import { Navigate } from "react-router-dom";
import { path } from "../utils/constants";
// import { checkHasJWT } from "../utils/helpers";

const ProtectedRoute = ({ children }) => {
  const checkHasJWT = () => {
    let flag = false;

    //check user has JWT token
    localStorage.getItem("token") ? (flag = true) : (flag = false);

    return flag;
  };

  if (!checkHasJWT()) {
    return <Navigate to={path.HOME} />;
  }

  return children;
};

export default ProtectedRoute;
