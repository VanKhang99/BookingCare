import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Space } from "antd";
import { getAllPatientsForDoctor, confirmExaminationComplete } from "../../slices/bookingSlice";
import "bootstrap/dist/css/bootstrap.css";
import "../../styles/PatientBooking.scss";
import "../../system/styles/Modal.scss";

const initialState = {
  sizeDatePicker: "medium",
  patients: [],
  dateBooked: "",
};

const PatientBooking = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { isLoadingConfirmExamComplete } = useSelector((store) => store.booking);
  const { userInfo } = useSelector((store) => store.user);

  const disabledDate = useCallback((current) => {
    // Can not select days before today
    return current < dayjs().startOf("day");
  }, []);

  const handleSelectedDate = (date, dateString) => {
    setState({ ...state, dateBooked: dateString });
  };

  const handleFetchPatients = async () => {
    try {
      const splitDateBooked = state.dateBooked.split("/");
      const formatDateBooked =
        language === "vi"
          ? `${splitDateBooked[2]}-${splitDateBooked[1]}-${splitDateBooked[0]}`
          : `${splitDateBooked[2]}-${splitDateBooked[0]}-${splitDateBooked[1]}`;

      const res = await dispatch(
        getAllPatientsForDoctor({ doctorId: userInfo.id, dateBooked: formatDateBooked })
      );
      if (res?.payload?.status === "error") {
        return setState({ ...state, patients: [] });
      }

      return setState({ ...state, patients: res.payload.data });
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmExamComplete = async (patient) => {
    const {
      patientData,
      doctorData: { clinic },
      timeFrameData,
      doctorName,
      dateBooked,
      patientId,
      token,
    } = patient;
    try {
      const dataSendToServer = {
        email: patientData.email,
        language,
        patientName:
          language === "vi"
            ? `${patientData.lastName} ${patientData.firstName}`
            : `${patientData.firstName} ${patientData.lastName}`,
        dateBooked,
        doctorName:
          language === "vi"
            ? `${doctorName.lastName} ${doctorName.firstName}`
            : `${doctorName.firstName} ${doctorName.lastName}`,
        clinicName: language === "vi" ? clinic.nameVi : clinic.nameEn,
        timeFrame: language === "vi" ? timeFrameData.valueVi : timeFrameData.valueEn,
        patientId,
        token,
      };
      const result = await dispatch(confirmExaminationComplete(dataSendToServer));
      if (result?.payload?.status === "success") {
        toast.success(
          language === "vi" ? "Gửi kết quả và hóa đơn thành công" : "Send result and invoice successfully!"
        );
        return await handleFetchPatients();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (state.dateBooked) {
      handleFetchPatients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dateBooked, state.patients?.length]);

  return (
    <>
      <div className="patient-booking container">
        <div className="profile-heading"> {t("profile.list-patient-appointment")}</div>

        <div className="patient-booking-content">
          <div className="patient-booking-date col-4 mt-5">
            <h3 className="label">{t("patients-booking-manage.choose-date")}</h3>
            <div className="mt-3">
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <DatePicker
                  size={state.sizeDatePicker}
                  format={language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
                  disabledDate={disabledDate}
                  onChange={handleSelectedDate}
                  style={{
                    width: "100%",
                    padding: "7px 11px",
                    borderRadius: "4px",
                  }}
                />
              </Space>
            </div>
          </div>

          <div className="patient-booking-list mt-5">
            <h3 className="label">{t("patients-booking-manage.list-patients")}</h3>

            <div className="table-container mt-4 px-0">
              {state.patients?.length > 0 ? (
                <table className="table table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">{t("patients-booking-manage.table-time")}</th>
                      <th scope="col">{t("patients-booking-manage.table-name")}n</th>
                      <th scope="col">{t("patients-booking-manage.table-time")}</th>
                      <th scope="col">{t("patients-booking-manage.table-gender")}</th>
                      <th scope="col">{t("patients-booking-manage.table-reason")}</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.patients.map((patient, index) => {
                      const { timeFrameData, patientData, reason } = patient;
                      return (
                        <tr key={patient.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{language === "vi" ? timeFrameData.valueVi : timeFrameData.valueEn}</td>
                          <td>
                            {language === "vi"
                              ? `${patientData.lastName} ${patientData.firstName}`
                              : `${patientData.firstName} ${patientData.lastName}`}
                          </td>
                          <td>{patientData.address}</td>
                          <td>
                            {language === "vi"
                              ? patientData.genderData.valueVi
                              : patientData.genderData.valueEn}
                          </td>
                          <td>{reason}</td>
                          <td>
                            <button
                              type="button"
                              className="table-button table-button-confirm me-4"
                              onClick={() => handleConfirmExamComplete(patient)}
                            >
                              {t("patients-booking-manage.button-confirm")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="table-empty">
                  <p className="table-empty__message">
                    {language === "vi"
                      ? "Hiện chưa có bệnh nhân nào đặt lịch khám bệnh. Vui lòng chọn một ngày khác!"
                      : "No patient has scheduled an appointment yet. Please choose another date!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLoadingConfirmExamComplete && (
        <div className="spinner">
          <RotatingLines
            strokeColor="#1a5296"
            strokeWidth="5"
            animationDuration="0.75"
            width="90"
            visible={true}
          />
        </div>
      )}
    </>
  );
};

export default PatientBooking;
