// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Login } from "../pages";

const ProtectedRoute = ({ children }) => {
  // const navigate = useNavigate();
  const checkHasJWT = () => {
    let flag = false;
    //check user has JWT token
    localStorage.getItem("token") ? (flag = true) : (flag = false);
    return flag;
  };

  // useEffect(() => {
  //   if (!checkHasJWT()) {
  //     navigate("/login");
  //   }
  // }, []);

  return <>{checkHasJWT() ? children : <Login />}</>;
};

export default ProtectedRoute;
