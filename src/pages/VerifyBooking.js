import React, { useState } from "react";
import { Header, Footer } from "../components";
// import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { verifyBooking } from "../slices/bookingSlice";
import "../styles/VerifyBooking.scss";

const initialState = {
  isVerified: false,
  message: "",
};

const VerifyBooking = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  // const { t } = useTranslation();
  const { token, doctorId, packageId } = useParams();

  const handleVerifyBooking = async () => {
    if (token) {
      const res = await dispatch(verifyBooking({ token, doctorId, packageId }));
      console.log(res);

      if (res?.payload?.status === "error") {
        return setState({
          ...state,
          isVerified: true,
          message: "Lịch khám bệnh đã được xác nhận hoặc không tồn tại!!!",
        });
      }

      if (res?.payload?.status === "success") {
        return setState({ ...state, isVerified: true, message: "Xác nhận đặt lịch khám bệnh thành công" });
      }
    }
  };

  return (
    <>
      <div className="verify-booking-container">
        <Header />

        <div className="verify-booking-content">
          {!state.isVerified ? (
            <>
              <h1>Xác nhận đặt lịch khám bệnh</h1>
              <button className="button button-confirm" onClick={() => handleVerifyBooking()}>
                Click here
              </button>
            </>
          ) : (
            <h1>{state.message}</h1>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default VerifyBooking;
