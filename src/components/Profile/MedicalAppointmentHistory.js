import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowSmRight } from "react-icons/hi";
import { getAllHistoryBookedById } from "../../slices/bookingSlice";
import "../../styles/MedicalAppointmentHistory.scss";

const MedicalAppointmentHistory = () => {
  const [historyBooked, setHistoryBooked] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { userInfo } = useSelector((store) => store.user);

  const handleGetHistoryBooked = async () => {
    try {
      const res = await dispatch(getAllHistoryBookedById(userInfo.id));
      setHistoryBooked(res.payload.status === "error" ? [] : res.payload.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisplayStatus = (status) => {
    if (status === "S1") {
      return language === "vi"
        ? "Đã gửi thông tin qua email và chưa xác nhận!"
        : "Sent information via email and not confirmed yet!";
    } else if (status === "S2") {
      return language === "vi"
        ? "Đã gửi thông tin qua email và đã xác nhận!"
        : "Sent information via email and confirmed!";
    } else {
      return language === "vi" ? "Đã hoàn tất quá trình khám bệnh" : "Completed medical examination";
    }
  };

  useEffect(() => {
    handleGetHistoryBooked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="medical-appointment-history">
      <h2 className="profile-heading">{t("profile.medical-appointment-history")}</h2>

      <div className="appointment-history-list">
        {historyBooked.length > 0 &&
          historyBooked.map((book) => {
            const { id, doctorData, packageData, timeFrameData } = book;
            return (
              <div key={id} className="appointment-history-item">
                <h3 className="appointment-history-item__title">{t("med-appoint-history.booked-title")}</h3>

                <ol className="appointment-info-list">
                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.appointment-email")}
                    </span>
                    <span className="appointment-info-item__data">: {userInfo?.email}</span>
                  </li>

                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.booking-for")}
                    </span>
                    <span className="appointment-info-item__data">: {book.bookingFor}</span>
                  </li>

                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.time-frame")}
                    </span>
                    <span className="appointment-info-item__data">
                      : {language === "vi" ? timeFrameData.valueVi : timeFrameData.valueEn}
                    </span>
                  </li>

                  {book.doctorId && (
                    <>
                      <li className="appointment-info-item">
                        <span className="appointment-info-item__label">
                          <HiArrowSmRight />
                          {t("med-appoint-history.doctor")}
                        </span>
                        <span className="appointment-info-item__data">
                          :{" "}
                          {language === "vi"
                            ? `${doctorData.moreData.lastName} ${doctorData.moreData.firstName}`
                            : `${doctorData.moreData.firstName} ${doctorData.moreData.lastName}`}
                        </span>
                      </li>

                      <li className="appointment-info-item">
                        <span className="appointment-info-item__label">
                          <HiArrowSmRight />
                          {t("med-appoint-history.clinic")}
                        </span>
                        <span className="appointment-info-item__data">
                          :{" "}
                          {language === "vi" ? `${doctorData.clinic.nameVi}` : `${doctorData.clinic.nameEn}`}
                        </span>
                      </li>
                    </>
                  )}

                  {book.packageId && (
                    <>
                      <li className="appointment-info-item">
                        <span className="appointment-info-item__label">
                          <HiArrowSmRight />
                          {t("med-appoint-history.package")}
                        </span>
                        <span className="appointment-info-item__data">
                          : {language === "vi" ? `${packageData.nameVi}` : `${packageData.nameEn}`}
                        </span>
                      </li>

                      <li className="appointment-info-item">
                        <span className="appointment-info-item__label">
                          <HiArrowSmRight />
                          {t("med-appoint-history.clinic")}
                        </span>
                        <span className="appointment-info-item__data">
                          :{" "}
                          {language === "vi"
                            ? `${packageData.clinicData.nameVi}`
                            : `${packageData.clinicData.nameEn}`}
                        </span>
                      </li>
                    </>
                  )}

                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.day-exam")}
                    </span>
                    <span className="appointment-info-item__data">: {book.dateBooked}</span>
                  </li>

                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.reason")}
                    </span>
                    <span className="appointment-info-item__data">: {book.reason ? book.reason : ""}</span>
                  </li>

                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.status")}
                    </span>
                    <span className="appointment-info-item__data">
                      : {handleDisplayStatus(book.statusId)}
                    </span>
                  </li>

                  <li className="appointment-info-item">
                    <span className="appointment-info-item__label">
                      <HiArrowSmRight />
                      {t("med-appoint-history.booking-code")}
                    </span>
                    <span className="appointment-info-item__data">: {book.token}</span>
                  </li>
                </ol>
              </div>
            );
          })}

        {!historyBooked.length && (
          <div className="appointment-history-list--empty">
            {language === "vi"
              ? "Hiện bạn chưa có lịch khám bệnh nào được đặt trước đó!"
              : "There are currently no scheduled appointments!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalAppointmentHistory;
