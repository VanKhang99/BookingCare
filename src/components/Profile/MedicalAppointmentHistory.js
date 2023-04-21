import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowSmRight } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { RxReload } from "react-icons/rx";
import { Loading } from "../../components";
import { Modal } from "antd";
import { getAllHistoryBookedById, deleteBooking } from "../../slices/bookingSlice";
import "../../styles/MedicalAppointmentHistory.scss";

const initialState = {
  isModalOpen: false,
  idBooking: "",
  statusIdBooking: "",
};

const MedicalAppointmentHistory = () => {
  const [appointmentState, setAppointmentState] = useState(initialState);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { userInfo } = useSelector((store) => store.user);
  const { isLoadingAppointmentHistory, medicalAppointmentHistory } = useSelector((store) => store.booking);

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

  const handleDeleteBookingHistory = (id, statusId) => {
    setAppointmentState({ ...appointmentState, isModalOpen: true, idBooking: id, statusIdBooking: statusId });
  };

  const handleOk = async () => {
    try {
      await dispatch(deleteBooking(appointmentState.idBooking));
      toast.success(language === "vi" ? "Xóa thành công!" : "Delete successfully!");
      setAppointmentState({ ...initialState });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setAppointmentState({ ...appointmentState, isModalOpen: false });
  };

  const handleDisplayMessageModal = () => {
    if (appointmentState.statusIdBooking === "S1") {
      return <p>{t("med-appoint-history.delete-status-s1")}</p>;
    } else if (appointmentState.statusIdBooking === "S2") {
      return <p>{t("med-appoint-history.delete-status-s2")}</p>;
    } else {
      return <p>{t("med-appoint-history.delete-status-s3")}</p>;
    }
  };

  const handleReload = async () => {
    try {
      dispatch(getAllHistoryBookedById(userInfo.id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (medicalAppointmentHistory.length) return;

    const dispatchedThunk = dispatch(getAllHistoryBookedById(userInfo.id));

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalAppointmentHistory.length]);

  return (
    <div className="medical-appointment-history">
      <h2 className="profile-heading">
        <span>{t("profile.medical-appointment-history")}</span>
        <button className="medical-appointment-history__reload" onClick={handleReload}>
          <RxReload />
        </button>
      </h2>

      {!isLoadingAppointmentHistory ? (
        <>
          <div className="appointment-history-list">
            {medicalAppointmentHistory.length > 0 &&
              medicalAppointmentHistory.map((book) => {
                const { id, statusId, doctorData, packageData, timeFrameData } = book;
                return (
                  <div key={id} className="appointment-history-item">
                    <h3 className="appointment-history-item__title">
                      {t("med-appoint-history.booked-title")}
                    </h3>

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
                              {language === "vi"
                                ? `${doctorData.clinic.nameVi}`
                                : `${doctorData.clinic.nameEn}`}
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
                        <span className="appointment-info-item__data">
                          : {book.reason ? book.reason : ""}
                        </span>
                      </li>

                      <li className="appointment-info-item">
                        <span className="appointment-info-item__label">
                          <HiArrowSmRight />
                          {t("med-appoint-history.booking-code")}
                        </span>
                        <span className="appointment-info-item__data">: {book.token}</span>
                      </li>

                      <li className="appointment-info-item">
                        <strong className="appointment-info-item__label">
                          <HiArrowSmRight />
                          {t("med-appoint-history.status")}
                        </strong>
                        <strong className="appointment-info-item__data">
                          : {handleDisplayStatus(book.statusId)}
                        </strong>
                      </li>
                    </ol>

                    <button
                      className="button appointment-history-item__delete"
                      onClick={() => handleDeleteBookingHistory(id, statusId)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                );
              })}

            {!medicalAppointmentHistory.length && (
              <div className="appointment-history-list--empty">
                {language === "vi"
                  ? "Hiện bạn chưa có lịch khám bệnh nào được đặt trước đó!"
                  : "There are currently no scheduled appointments!"}
              </div>
            )}
          </div>

          {appointmentState.isModalOpen && (
            <div className="modal-delete-booking">
              <Modal
                title={t("med-appoint-history.delete-modal-title")}
                centered
                open={appointmentState.isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                {handleDisplayMessageModal()}
              </Modal>
            </div>
          )}
        </>
      ) : (
        <Loading notAllScreen={true} />
      )}
    </div>
  );
};

export default MedicalAppointmentHistory;
