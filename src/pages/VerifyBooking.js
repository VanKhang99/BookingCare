import React, { useState, useEffect } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { verifyBooking } from "../slices/bookingSlice";
import "../styles/VerifyBooking.scss";
import { languages } from "../utils/constants";

const initialState = {
  isVerified: false,
  message: "",
};

const VerifyBooking = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { token, doctorId, packageId } = useParams();
  const { language } = useSelector((store) => store.app);

  const handleVerifyBooking = async () => {
    if (token) {
      const res = await dispatch(verifyBooking({ token, doctorId, packageId }));
      console.log(res);

      if (res?.payload?.status === "error") {
        return setState({
          ...state,
          isVerified: true,
          message: `${t("verify-booking.confirm-booking-existed")}`,
        });
      }

      if (res?.payload?.status === "success") {
        return setState({ ...state, isVerified: true, message: `${t("verify-booking.confirm-success")}` });
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
              <h1>{t("verify-booking.confirm-title")}</h1>
              <button className="button button-confirm" onClick={() => handleVerifyBooking()}>
                {t("button.confirm-booking")}
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
