import React, { useState, useEffect, useCallback, useMemo } from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllCodes } from "../slices/allcodeSlice";
import { createBooking } from "../slices/bookingSlice";
import { IoClose } from "react-icons/io5";
import { DatePicker, Space } from "antd";
import { isValidEmail, isValidPhone, formatDate, formatterPrice, checkData } from "../utils/helpers";
import "../styles/ModalBooking.scss";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  birthday: null,
  address: "",
  phoneNumber: "",
  gender: "",
  reason: "",
  doctorId: "",
  packageId: "",
  dateBooked: "",

  errorInput: {
    show: false,
    message: "",
  },
};

const ModalBooking = ({
  show,
  onHide,
  doctorId,
  packageId,
  doctorData,
  packageData,
  hourClicked,
  remote,
}) => {
  const [state, setState] = useState({ ...initialState });
  const { t } = useTranslation();
  const { id } = useParams();
  const { language } = useSelector((store) => store.app);
  const { genderArr } = useSelector((store) => store.allcode);
  const dispatch = useDispatch();

  const handleHideModal = () => {
    onHide();
    setState({ ...initialState, gender: genderArr[0].keyMap });
  };

  const handleInputChange = (e, id) => {
    const stateCopy = { ...state };
    stateCopy[id] = e.target.value;
    setState({ ...stateCopy });
  };

  const checkValidateInput = () => {
    let arrInput = [
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
      "email",
      "birthday",
      "reason",
      "gender",
    ];

    const isValid = checkData(state, arrInput);
    return isValid;
  };

  const handleConfirmBooking = async () => {
    setState({ ...state, errorInput: { show: false, message: "" } });

    const result = checkValidateInput();
    if (!result) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: `Input field cannot be empty. Please fill out the form!`,
        },
      });
      return;
    }

    if (!isValidEmail(state.email)) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: "Invalid Email. Please try another email!",
        },
      });
      return;
    }

    if (!isValidPhone(state.phoneNumber)) {
      setState({
        ...state,
        errorInput: {
          show: true,
          message: "Phone must have 10 numbers. Please try again!",
        },
      });
      return;
    }

    try {
      console.log(doctorData);
      const { moreData } = doctorData;
      const { clinic, priceData } = moreData;
      let clinicName;
      let doctorName;
      let packageName;
      let dateBooked = hourClicked && `${formatDate(new Date(+hourClicked.date), language).split(" - ")[1]}`;
      let birthday = state.birthday.split("/");
      if (id || doctorId) {
        clinicName = language === "vi" ? clinic.nameVi : clinic.nameEn;
        doctorName =
          language === "vi"
            ? `${doctorData.lastName} ${doctorData.firstName}`
            : `${doctorData.firstName} ${doctorData.lastName}`;
      } else {
        clinicName = language === "vi" ? packageData?.clinicName?.valueVi : packageData?.clinicName?.valueEn;
        packageName = language === "vi" ? packageData?.nameVi : packageData?.nameEn;
      }

      dateBooked =
        language === "vi"
          ? `${new Date().getFullYear()}-${dateBooked.split("/")[1]}-${dateBooked.split("/")[0]}`
          : `${new Date().getFullYear()}-${dateBooked.split("/")[0]}-${dateBooked.split("/")[1]}`;

      birthday =
        language === "vi"
          ? `${birthday[2]}-${birthday[1]}-${birthday[0]}`
          : `${birthday[2]}-${birthday[0]}-${birthday[1]}`;

      const timeFrame =
        language === "vi" ? hourClicked?.timeTypeData?.valueVi : hourClicked?.timeTypeData?.valueEn;

      const dataSendServer = {
        ...state,
        doctorId: +doctorId || +id,
        timeType: hourClicked.timeType,
        birthday,
        language,
        timeFrame,
        dateBooked,
        doctorName,
        clinicName,
        packageName,
        packageId: +packageId,
        priceId: priceData.keyMap || packageData.priceId,
        remote: remote ?? false,
      };
      delete dataSendServer["errorInput"];

      const result = await dispatch(createBooking(dataSendServer));
      // console.log(result);

      if (result.payload.status === "error") {
        onHide(hourClicked, "full-booking");
        return toast.error(result.payload.message);
      }

      onHide();
      setState({ ...initialState, gender: genderArr[0].keyMap });
      return toast.success(
        language === "vi"
          ? "Đặt lịch khám bệnh thành công. Vui lòng xác nhận thông tin qua email!"
          : "Successfully booked a medical appointment. Please confirm the information via email!"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedDate = (date, dateString) => {
    setState({ ...state, birthday: dateString });
  };

  const handleDisplayInterface = () => {
    let name;
    let price;
    let timeFrame;
    let date;
    let image;

    if (!_.isEmpty(doctorData)) {
      const { imageUrl, firstName, lastName, positionId, positionData, roleData, moreData } = doctorData;
      const { clinic, priceData } = moreData;
      image = imageUrl;
      if (language === "vi") {
        name =
          positionId !== "P0"
            ? `${positionData.valueVi} - ${roleData.valueVi} - ${lastName} ${firstName}`
            : `${roleData.valueVi} - ${lastName} ${firstName}`;
        timeFrame = hourClicked?.timeTypeData?.valueVi;
        price = formatterPrice(language).format(priceData?.valueVi);
      } else {
        name =
          positionId !== "P0"
            ? `${positionData.valueEn} - ${roleData.valueEn} - ${firstName} ${lastName}`
            : `${roleData.valueEn} - ${firstName} ${lastName}`;
        timeFrame = hourClicked?.timeTypeData?.valueEn;
        price = formatterPrice(language).format(priceData?.valueEn);
      }
    }

    if (!_.isEmpty(packageData)) {
      image = packageData.image;
      if (language === "vi") {
        name = packageData.nameVi;
        timeFrame = hourClicked?.timeTypeData?.valueVi;
        price = formatterPrice(language).format(packageData?.price?.valueVi);
      } else {
        name = packageData.nameEn;
        timeFrame = hourClicked?.timeTypeData?.valueEn;
        price = formatterPrice(language).format(packageData?.price?.valueEn);
      }
    }

    date = hourClicked && formatDate(new Date(+hourClicked.date), language);

    return {
      name,
      timeFrame,
      price,
      date,
      image,
    };
  };

  const disabledDate = useCallback((current) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return current && current >= yesterday;
  }, []);

  useEffect(() => {
    dispatch(getAllCodes("GENDER"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (genderArr && genderArr.length > 0) {
      return setState({ ...state, gender: genderArr[0].keyMap });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderArr]);

  return (
    <Modal
      show={show}
      onHide={() => handleHideModal()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={true}
    >
      <Modal.Header className="modal-top">
        <div className="modal-top__title">
          <h2>{t("modal-booking.header")}</h2>
          <span>{t("modal-booking.header-note")}</span>
        </div>
        <span className="modal-top__icon" onClick={() => handleHideModal()}>
          <IoClose />
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="booking-info-container">
          <div className="booking-info">
            <div className="booking-info-left">
              <div
                className={`booking-info-left__image ${packageData?.image ? "package" : "doctor"}`}
                style={{
                  backgroundImage: `url(${handleDisplayInterface()?.image})`,
                }}
              ></div>
            </div>
            <div className="booking-info-right">
              <h2 className="booking-info-right__name">{handleDisplayInterface().name}</h2>

              <div className="booking-info-right__hour">
                <strong>{t("modal-booking.time-frame")}: </strong>
                <span>{handleDisplayInterface().timeFrame}</span>
              </div>

              <div className="booking-info-right__date">
                <strong>{t("modal-booking.date")}: </strong>
                <span>{handleDisplayInterface().date}</span>
              </div>

              <div className="booking-info-right__price">
                <strong>{t("modal-booking.price")}: </strong>
                <span>{handleDisplayInterface().price}</span>
              </div>

              <span className="date"></span>
            </div>
          </div>
        </div>

        <Form className="form-user">
          <div className="row">
            <Form.Group className="mb-4 col-4" controlId="formFirstName">
              <Form.Label>{t("modal-booking.firstname")}</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                value={state.firstName}
                onChange={(e, id) => handleInputChange(e, "firstName")}
              />
            </Form.Group>

            <Form.Group className="mb-4 col-4" controlId="formLastName">
              <Form.Label>{t("modal-booking.lastname")}</Form.Label>
              <Form.Control
                type="text"
                value={state.lastName}
                onChange={(e, id) => handleInputChange(e, "lastName")}
              />
            </Form.Group>

            <Form.Group className="mb-4 col-4" controlId="formPhone">
              <Form.Label>{t("modal-booking.phone")}</Form.Label>
              <Form.Control
                type="text"
                value={state.phoneNumber}
                onChange={(e, id) => handleInputChange(e, "phoneNumber")}
              />
            </Form.Group>

            <Form.Group className="mb-4 col-4" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={state.email}
                onChange={(e, id) => handleInputChange(e, "email")}
              />
            </Form.Group>

            <Form.Group className="mb-4 col-4" controlId="formGender">
              <Form.Label>{t("modal-booking.gender")}</Form.Label>
              <Form.Select value={state.gender} onChange={(e, id) => handleInputChange(e, "gender")}>
                {genderArr &&
                  genderArr.length > 0 &&
                  genderArr.map((gender, index) => {
                    return (
                      <option key={gender.keyMap} value={gender.keyMap}>
                        {language === "vi" ? gender.valueVi : gender.valueEn}
                      </option>
                    );
                  })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4 col-4" controlId="formBirthday">
              <Form.Label>{t("modal-booking.birthday")}</Form.Label>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <DatePicker
                  size={state.sizeDatePicker}
                  format={language === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"}
                  disabledDate={disabledDate}
                  onChange={handleSelectedDate}
                  style={{
                    width: "100%",
                    padding: "5px 11px",
                    borderRadius: "4px",
                  }}
                  placeholder="Your birthday"
                  popupStyle={{ zIndex: "9999" }}
                  inputReadOnly={true}
                />
              </Space>
            </Form.Group>

            <Form.Group className="mb-4 col-12" controlId="formAddress">
              <Form.Label>{t("modal-booking.address")}</Form.Label>
              <Form.Control
                type="text"
                value={state.address}
                onChange={(e, id) => handleInputChange(e, "address")}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formReason">
              <Form.Label>{t("modal-booking.reason")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e, id) => handleInputChange(e, "reason")}
                value={state.reason}
              />
            </Form.Group>

            <div className="col-12 error-input">{state.errorInput.show && state.errorInput.message}</div>
          </div>
        </Form>

        <div className="modal-booking-note">
          <h4 className="modal-booking-note__title">LƯU Ý</h4>
          <ol className="modal-booking-note-list">
            <li className="note-item">
              {t("modal-booking.note-first")}
              <ul>
                <li>{HtmlReactParser(t("modal-booking.note-first-sub-1"))}</li>
                <li>{t("modal-booking.note-first-sub-3")}</li>
              </ul>
            </li>
            <li>{t("modal-booking.note-second")}</li>
            <li>{HtmlReactParser(t("modal-booking.note-third"))}</li>
          </ol>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-buttons">
        <div className="button-group">
          <Button variant="secondary" onClick={() => handleHideModal()}>
            {t("modal-booking.button-close")}
          </Button>
          <Button variant="primary" onClick={() => handleConfirmBooking()}>
            {t("modal-booking.button-confirm")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBooking;
