import React, { useState, useEffect } from "react";
import { Header, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { confirmBooking } from "../slices/bookingSlice";
import "../styles/ConfirmBooking.scss";

const initialState = {
  isVerified: false,
  message: "",
};

const ConfirmBooking = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { token, doctorId, packageId } = useParams();
  const { language } = useSelector((store) => store.app);

  console.log(token, doctorId, packageId);

  const handleVerifyBooking = async () => {
    if (token) {
      const res = await dispatch(confirmBooking({ token, doctorId, packageId }));

      if (res?.payload?.status === "error") {
        return setState({
          ...state,
          isVerified: true,
          message: `${t("confirm-booking.confirm-booking-existed")}`,
        });
      }

      if (res?.payload?.status === "success") {
        return setState({ ...state, isVerified: true, message: `${t("confirm-booking.confirm-success")}` });
      }
    }
  };

  useEffect(() => {
    document.title = language === "vi" ? "Xác nhận lịch khám bệnh" : "Confirm medical appointment";
  }, [language]);

  return (
    <>
      <div className="confirm-booking-container">
        <div className="confirm-booking-content">
          {!state.isVerified ? (
            <>
              <h1>{t("confirm-booking.confirm-title")}</h1>
              <button className="button button-confirm" onClick={() => handleVerifyBooking()}>
                {t("button.confirm-booking")}
              </button>
            </>
          ) : (
            <h1>{state.message}</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmBooking;
