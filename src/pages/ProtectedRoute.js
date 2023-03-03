import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { path } from "../utils/constants";
// import { checkHasJWT } from "../utils/helpers";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const checkHasJWT = () => {
    let flag = false;
    //check user has JWT token
    localStorage.getItem("token") ? (flag = true) : (flag = false);
    return flag;
  };

  useEffect(() => {
    if (!checkHasJWT()) {
      navigate("/");
    }
  }, []);

  return children;
};

export default ProtectedRoute;
