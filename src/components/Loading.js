import React from "react";
import { RotatingLines } from "react-loader-spinner";
import "../styles/Loading.scss";

const Loading = ({ notAllScreen, smallLoading }) => {
  return (
    <>
      {notAllScreen ? (
        <div className="spinner--not-all-screen">
          <RotatingLines
            strokeColor={smallLoading ? "#fff" : "#1a5296"}
            strokeWidth="5"
            animationDuration="0.75"
            width={smallLoading ? "24" : "80"}
            visible={true}
          />
        </div>
      ) : (
        <div className="spinner">
          <RotatingLines
            strokeColor="#1a5296"
            strokeWidth="5"
            animationDuration="0.75"
            width="80"
            visible={true}
          />
        </div>
      )}
    </>
  );
};

export default Loading;
