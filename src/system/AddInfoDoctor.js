import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Radio } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCode } from "../slices/allcodeSlice";
import { getAllDoctors, postInfoDoctor, getDetailDoctor } from "../slices/doctorSlice";
import { checkData } from "../utils/helpers";
import "react-markdown-editor-lite/lib/index.css";
import "./styles/AddInfoDoctor.scss";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  introductionHTML: "",
  introductionMarkdown: "",
  aboutHTML: "",
  aboutMarkdown: "",

  selectedDoctor: "",
  selectedPrice: "",
  selectedPayment: "",
  selectedProvince: "",
  selectedSpecialty: "",
  selectedClinic: "",

  addressClinic: "",
  note: "",

  popular: 0,
  remote: 0,
  isHaveInfo: false,
  action: "",
  oldIdDoctor: "",
};

const AddInfoDoctor = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { doctors } = useSelector((store) => store.doctor);
  const { priceArr, paymentArr, provinceArr, specialtyArr, clinicArr } = useSelector(
    (store) => store.allcode
  );
  const saveOldIdDoctor = useRef(null);

  const handleInfos = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleInfoOptions = (typeInfo, data) => {
    if (!data) return;

    const formatterPrice = new Intl.NumberFormat(`${language === "vi" ? "vi-VN" : "en-US"}`, {
      style: "currency",
      currency: `${language === "vi" ? "VND" : "USD"}`,
    });

    const objectOptions = data.map((item) => {
      let label;
      let value;
      if (typeInfo === "doctor") {
        label =
          language === "vi" ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
        value = item.id;
      } else if (
        typeInfo === "province" ||
        typeInfo === "payment" ||
        typeInfo === "specialty" ||
        typeInfo === "clinic"
      ) {
        label = language === "vi" ? `${item.valueVi}` : `${item.valueEn}`;
        value = item.keyMap;
      } else if (typeInfo === "price") {
        label =
          language === "vi"
            ? `${formatterPrice.format(item.valueVi)}`
            : `${formatterPrice.format(item.valueEn)}`;
        value = item.keyMap;
      }

      return { value, label };
    });
    return objectOptions;
  };

  const handleStateSelectDoctor = async (selectedOption) => {
    try {
      const doctor = await dispatch(getDetailDoctor(+selectedOption?.value || +state.oldIdDoctor));
      const findInfoBaseId = (typeInfo, array, typeInfoId) => {
        return handleInfoOptions(typeInfo, array).find((item) => item.value === typeInfoId);
      };

      const anotherInfoDoctor = doctor.payload.data.anotherInfo;
      const propsCheck = ["priceId", "paymentId", "provinceId", "specialtyId", "popular", "remote"];
      const checkAnotherInfoDoctor = checkData(anotherInfoDoctor, propsCheck);
      const doctorSelected = findInfoBaseId("doctor", doctors, doctor.payload.data.id);

      if (doctor?.payload?.data && !_.isEmpty(doctor.payload.data) && checkAnotherInfoDoctor) {
        const doctorData = doctor.payload.data;
        const price = findInfoBaseId("price", priceArr, doctorData.anotherInfo.priceId);
        const payment = findInfoBaseId("payment", paymentArr, doctorData.anotherInfo.paymentId);
        const province = findInfoBaseId("province", provinceArr, doctorData.anotherInfo.provinceId);
        const specialty = findInfoBaseId("specialty", specialtyArr, doctorData.anotherInfo.specialtyId);
        const clinic = findInfoBaseId("clinic", clinicArr, doctorData.anotherInfo.clinicId);

        return setState({
          ...state,
          introductionHTML: doctorData.anotherInfo.introductionHTML,
          introductionMarkdown: doctorData.anotherInfo.introductionMarkdown,
          aboutHTML: doctorData.anotherInfo.aboutHTML,
          aboutMarkdown: doctorData.anotherInfo.aboutMarkdown,

          selectedDoctor: doctorSelected,
          selectedPrice: price,
          selectedPayment: payment,
          selectedProvince: province,
          selectedSpecialty: specialty,
          selectedClinic: clinic,
          addressClinic: doctorData.anotherInfo.addressClinic ?? "",
          popular: doctorData.anotherInfo.popular ?? 0,
          remote: doctorData.anotherInfo.remote ?? 0,
          note: doctorData.anotherInfo.note ?? "",
          isHaveInfo: true,
          action: "EDIT",
          oldIdDoctor: doctorData.id,
        });
      }

      return setState({
        ...initialState,
        selectedDoctor: selectedOption || doctorSelected,
        oldIdDoctor: selectedOption?.value || doctorSelected.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    stateCopy[`${type}HTML`] = html;
    stateCopy[`${type}Markdown`] = text;
    return setState({ ...stateCopy });
  };

  const handleSaveInfoDoctor = async () => {
    try {
      const propArrKey = [
        "selectedDoctor",
        "selectedPrice",
        "selectedPayment",
        "selectedProvince",
        "selectedSpecialty",
        "popular",
        "remote",
      ];
      const validate = checkData(state, propArrKey);
      if (!validate) throw new Error("Input data not enough");

      const info = await dispatch(
        postInfoDoctor({
          doctorId: state.selectedDoctor.value,
          priceId: state.selectedPrice.value,
          paymentId: state.selectedPayment.value,
          provinceId: state.selectedProvince.value,
          specialtyId: state.selectedSpecialty.value,
          clinicId: state.selectedClinic?.value,
          addressClinic: state.addressClinic || "",
          popular: state.popular,
          remote: state.remote,
          note: state.note,
          action: state.action || "create",

          introductionHTML: state.introductionHTML,
          introductionMarkdown: state.introductionMarkdown,
          aboutHTML: state.aboutHTML,
          aboutMarkdown: state.aboutMarkdown,
        })
      );

      if (info.payload.status === "success") {
        toast.success("Doctor's info is saved successfully!");
        setState({ ...initialState });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  useEffect(() => {
    dispatch(getAllDoctors());
    dispatch(getAllCode("PRICE"));
    dispatch(getAllCode("PAYMENT"));
    dispatch(getAllCode("PROVINCE"));
    dispatch(getAllCode("SPECIALTY"));
    dispatch(getAllCode("CLINIC"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleInfoOptions();
    if (state.oldIdDoctor) {
      handleStateSelectDoctor();
    }
    saveOldIdDoctor.current = state.oldIdDoctor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="doctor-manage-wrapper">
      <div className="doctor-manage-content">
        <div className="doctor-manage container">
          <div className="doctor-manage-title text-center mt-3">{t("doctor-manage.title")}</div>

          <div className="content-top row">
            <div className="col-4">
              <div className="title">
                <h4>{t("doctor-manage.choose-doctor")}</h4>
              </div>

              <div className="select-doctors mt-3">
                {doctors && doctors.length > 0 && (
                  <Select
                    value={state.selectedDoctor}
                    onChange={(option) => {
                      handleInfos(option, "selectedDoctor");
                      handleStateSelectDoctor(option);
                    }}
                    options={handleInfoOptions("doctor", doctors)}
                    placeholder={t("doctor-manage.placeholder-doctor")}
                  />
                )}
              </div>
            </div>

            <div className="col-4">
              <div className="title">
                <h4>{t("doctor-manage.choose-price")}</h4>
              </div>

              <div className="select-price mt-3">
                {priceArr && priceArr.length > 0 && (
                  <Select
                    value={state.selectedPrice}
                    onChange={(option) => handleInfos(option, "selectedPrice")}
                    options={handleInfoOptions("price", priceArr)}
                    placeholder={t("doctor-manage.placeholder-price")}
                  />
                )}
              </div>
            </div>

            <div className="col-4">
              <div className="title">
                <h4>{t("doctor-manage.choose-clinic")}</h4>
              </div>

              <div className="select-clinic mt-3">
                {clinicArr?.length > 0 && (
                  <Select
                    value={state.selectedClinic}
                    onChange={(option) => handleInfos(option, "selectedClinic")}
                    options={handleInfoOptions("clinic", clinicArr)}
                    placeholder={t("doctor-manage.placeholder-clinic")}
                  />
                )}
              </div>
            </div>

            <div className="col-4 mt-5">
              <div className="title">
                <h4>{t("doctor-manage.choose-method-payment")}</h4>
              </div>

              <div className="select-method-payment mt-3">
                {paymentArr && paymentArr.length > 0 && (
                  <Select
                    value={state.selectedPayment}
                    onChange={(option) => handleInfos(option, "selectedPayment")}
                    options={handleInfoOptions("payment", paymentArr)}
                    placeholder={t("doctor-manage.placeholder-payment")}
                  />
                )}
              </div>
            </div>

            <div className="col-4 mt-5">
              <div className="title">
                <h4>{t("doctor-manage.choose-province")}</h4>
              </div>

              <div className="select-province mt-3">
                {provinceArr && provinceArr.length > 0 && (
                  <Select
                    value={state.selectedProvince}
                    onChange={(option) => handleInfos(option, "selectedProvince")}
                    options={handleInfoOptions("province", provinceArr)}
                    placeholder={t("doctor-manage.placeholder-province")}
                  />
                )}
              </div>
            </div>

            <div className="col-4 mt-5">
              <div className="title">
                <h4>{t("doctor-manage.choose-specialty")}</h4>
              </div>

              <div className="select-specialty mt-3">
                {specialtyArr && specialtyArr.length > 0 && (
                  <Select
                    value={state.selectedSpecialty}
                    onChange={(option) => handleInfos(option, "selectedSpecialty")}
                    options={handleInfoOptions("specialty", specialtyArr)}
                    placeholder={t("doctor-manage.placeholder-specialty")}
                  />
                )}
              </div>
            </div>

            <Form.Group className="mt-5 col-6" controlId="formClinicAddress">
              <div className="title">
                <h4>{t("doctor-manage.clinic-address")}</h4>
              </div>
              <Form.Control
                type="text"
                value={state.addressClinic}
                className="doctor-info-input"
                onChange={(e, id) => handleInfos(e, "addressClinic")}
              />
            </Form.Group>

            <Form.Group className="mt-5 col-6" controlId="formNote">
              <div className="title">
                <h4>{t("doctor-manage.note")}</h4>
              </div>
              <Form.Control
                type="text"
                value={state.note}
                className="doctor-info-input"
                onChange={(e, id) => handleInfos(e, "note")}
              />
            </Form.Group>

            <div className="col-6 mt-5">
              <div className="title">
                <h4>{t("doctor-manage.outstanding-doctor")}</h4>
              </div>
              <Radio.Group onChange={(e) => handleCheckRadio(e, "popular")} value={state.popular}>
                <Radio value={0}>{language === "vi" ? "Không phổ biến" : "Unpopular"}</Radio>
                <Radio value={1}>{language === "vi" ? "Phổ biến" : "Popular"}</Radio>
              </Radio.Group>
            </div>

            <div className="col-12 mt-5">
              <div className="title">
                <h4>Có tư vấn từ xa</h4>
              </div>
              <Radio.Group onChange={(e) => handleCheckRadio(e, "remote")} value={state.remote}>
                <Radio value={0}>{language === "vi" ? "Không" : "No"}</Radio>
                <Radio value={1}>{language === "vi" ? "Có" : "Yes"}</Radio>
              </Radio.Group>
            </div>

            <div className="col-12 mt-5">
              <div className="title">
                <h4>{t("doctor-manage.summary")}</h4>
              </div>

              <div className="introduce mt-3">
                <MdEditor
                  value={state.introductionMarkdown}
                  style={{
                    height: 180,
                    marginBottom: 24,
                  }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={(value) => handleMarkdownChange(value, "introduction")}
                />
              </div>
            </div>
          </div>

          <div className="more-info">
            <div className="title mb-3">
              <h4>{t("doctor-manage.more-info")}</h4>
            </div>

            <MdEditor
              value={state.aboutMarkdown}
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={(value) => handleMarkdownChange(value, "about")}
            />
          </div>

          <div className="row">
            <div className="doctor-manage-button mt-4 text-end">
              <Button variant="primary" onClick={handleSaveInfoDoctor}>
                {state.isHaveInfo ? t("doctor-manage.button-update") : t("doctor-manage.button-save")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInfoDoctor;
