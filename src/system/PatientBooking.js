import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { v4 as uuidv4 } from "uuid";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Space } from "antd";
import { getAllPatientsForDoctor, confirmExaminationComplete } from "../slices/bookingSlice";
import { IoClose } from "react-icons/io5";
import { formatterPrice } from "../utils/helpers";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/PatientBooking.scss";
import "./styles/Modal.scss";

const initialState = {
  sizeDatePicker: "medium",
  patients: [],
  patientConfirmed: {},
  isModalOpen: false,

  email: "",
  patientName: "",
  dateBooked: "",
  doctorName: "",
  examinationResults: "",
  invoiceNumber: "",
  serviceUsed: "",
  totalFee: "",
  token: "",
  timeFrame: "",
  patientId: null,
  // remote: 0,
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
        return setState({ ...state, patients: [], isModalOpen: false });
        // return toast.error(res.payload.message);
      }

      return setState({ ...state, patients: res?.payload?.data });
    } catch (error) {
      console.error(error);
    }
  };

  const handleModal = (patientId = null) => {
    if (!patientId) return setState({ ...state, isModalOpen: !state.isModalOpen });

    const patientConfirmed = state.patients?.find((patient) => patient.patientId === patientId);
    const { patientData, doctorName, timeFrameData } = patientConfirmed;
    const dataSendToServer = {
      email: patientData.email,
      patientName:
        language === "vi"
          ? `${patientData.lastName} ${patientData.firstName}`
          : `${patientData.firstName} ${patientData.lastName}`,
      doctorName:
        language === "vi"
          ? `${doctorName.lastName} ${doctorName.firstName}`
          : `${doctorName.firstName} ${doctorName.lastName}`,
      examinationResults: "",
      invoiceNumber: uuidv4(),
      serviceUsed: "",
      totalFee: patientConfirmed.remoteDoctor.remote
        ? +patientConfirmed.priceId
        : +patientConfirmed.priceId + 150000,
      token: patientConfirmed.token,
      timeFrame: language === "vi" ? timeFrameData.valueVi : timeFrameData.valueEn,
      patientId,
      // remote: patientConfirmed.remoteDoctor.remote,
    };

    return setState({ ...state, isModalOpen: !state.isModalOpen, patientConfirmed, ...dataSendToServer });
  };

  const handleInputChange = (e, id) => {
    let stateCopy = { ...state };
    stateCopy[id] = e.target.value;
    setState({ ...stateCopy });
  };

  const handleConfirmExamComplete = async () => {
    try {
      const dataSendToServer = {
        email: state.email,
        language,
        patientName: state.patientName,
        dateBooked: state.dateBooked,
        doctorName: state.doctorName,
        examinationResults: state.examinationResults,
        invoiceNumber: state.invoiceNumber,
        serviceUsed: state.serviceUsed,
        totalFee: state.totalFee,
        token: state.token,
        timeFrame: state.timeFrame,
        patientId: state.patientId,
        // remote: state.remote,
      };

      const result = await dispatch(confirmExaminationComplete(dataSendToServer));

      if (result?.payload?.status === "success") {
        // console.log(state);
        setState({ ...state, isModalOpen: false });
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
  }, [state.dateBooked, state.patients.length]);

  return (
    <>
      <div className="patient-booking container">
        <div className="patient-booking__title mt-4">{t("patients-booking-manage.main-title")}</div>

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
                              onClick={() => handleModal(patient.patientId)}
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

        {!_.isEmpty(state.patientConfirmed) && (
          <Modal
            show={state.isModalOpen}
            onHide={() => handleModal()}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="top">
              <div className="title">{t("patients-booking-manage.modal-title")}</div>
              <span className="icon-close" onClick={() => handleModal()}>
                <IoClose />
              </span>
            </Modal.Header>
            <Modal.Body>
              <Form className="form-confirm">
                <div className="exam-report">
                  <h3 className="exam-report__title">{t("patients-booking-manage.title-report")}</h3>

                  <div className="exam-report__input">
                    <p>
                      {t("patients-booking-manage.patient-name")}: <span>{state.patientName}</span>
                    </p>
                  </div>

                  <div className="exam-report__input">
                    <p>
                      {t("patients-booking-manage.date-exam")}:{" "}
                      <span>{state.patientConfirmed.dateBooked}</span>
                    </p>
                  </div>

                  <div className="exam-report__input">
                    <p>
                      {t("patients-booking-manage.doctor-name")}: <span>{state.doctorName}</span>
                    </p>
                  </div>

                  <Form.Group className="mb-4 exam-report__input" controlId="formExaminationResults">
                    <Form.Label>{t("patients-booking-manage.exam-result")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.examinationResults}
                      as="textarea"
                      rows="3"
                      onChange={(e, id) => handleInputChange(e, "examinationResults")}
                    />
                  </Form.Group>
                </div>

                <div className="invoice">
                  <h3 className="invoice__title">{t("patients-booking-manage.title-invoice")}</h3>

                  <div className="invoice__input">
                    <p>
                      Email: <span>{state.email}</span>
                    </p>
                  </div>

                  <div className="invoice__input">
                    <p>
                      {t("patients-booking-manage.invoice-number")}: <span>{state.invoiceNumber}</span>
                    </p>
                  </div>

                  <div className="invoice__input">
                    <p>
                      {t("patients-booking-manage.patient-name")}: <span>{state.patientName}</span>
                    </p>
                  </div>

                  <Form.Group className="invoice__input mb-4" controlId="formServiceUsed">
                    <Form.Label>{t("patients-booking-manage.service-used")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={state.serviceUsed}
                      as="textarea"
                      rows="3"
                      onChange={(e, id) => handleInputChange(e, "serviceUsed")}
                    />
                  </Form.Group>
                </div>

                <div className="total-fee mb-3">
                  <h3>
                    {t("patients-booking-manage.total-fee")}:{" "}
                    <span>{`${formatterPrice("vi", state.totalFee)}`}</span>
                  </h3>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer className="footer">
              <div className="footer-actions">
                <Button variant="primary" onClick={handleConfirmExamComplete}>
                  Send
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        )}
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
