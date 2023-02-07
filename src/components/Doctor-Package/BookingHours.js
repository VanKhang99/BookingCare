import React from "react";
import HtmlReactParser from "html-react-parser";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BiError } from "react-icons/bi";
import { FaCalendarAlt, FaVideo } from "react-icons/fa";
import { FaRegHandPointRight } from "react-icons/fa";
import "../../styles/BookingHours.scss";

const BookingHours = ({ schedules, doctorId, packageId, onToggleModal, small, remote }) => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleClick = (hourClicked, doctorId = undefined, packageId = undefined) => {
    if (doctorId) {
      onToggleModal(hourClicked, doctorId);
    } else {
      onToggleModal(hourClicked, doctorId, packageId);
    }
  };

  return (
    <div className={`${small ? "small" : "col-8"} booking-schedule`}>
      <div className="col-12 title">
        {remote ? <FaVideo /> : <FaCalendarAlt />}
        <span>{remote ? t("detail-doctor.exam-schedule-video") : t("detail-doctor.exam-schedule")}</span>
      </div>
      <div className="booking-schedule-list">
        {schedules?.length > 0 ? (
          schedules.map((schedule, index) => {
            return (
              <button
                className="button booking-schedule-button"
                key={index}
                onClick={() => handleClick(schedule, doctorId, packageId)}
              >
                {language === "vi" ? schedule.timeTypeData.valueVi : schedule.timeTypeData.valueEn}
              </button>
            );
          })
        ) : (
          <span>
            <BiError /> {t("detail-doctor.no-schedule")}
          </span>
        )}
      </div>

      <p className="booking-schedule-fee">
        <FaRegHandPointRight />
        <span>{HtmlReactParser(t("detail-doctor.fee"))}</span>
      </p>
    </div>
  );
};

export default BookingHours;
