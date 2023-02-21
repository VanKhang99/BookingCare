import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Radio } from "antd";
import { IoReload } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCodes } from "../slices/allcodeSlice";
import { getAllDoctors, postInfoDoctor, getDetailDoctor, deleteDoctor } from "../slices/doctorSlice";
import { checkData } from "../utils/helpers";
import "react-markdown-editor-lite/lib/index.css";

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

  popular: false,
  remote: false,
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

  const handleDeleteInfoDoctor = async () => {
    try {
      if (!state.selectedDoctor) throw new Error("Doctor is not selected");
      alert("Are you sure you want to delete?");

      console.log(state.selectedDoctor);

      const res = await dispatch(deleteDoctor(state.selectedDoctor.value));
      if (res.payload === "") {
        toast.success("Doctor is deleted successfully!");
        await dispatch(getAllDoctors());
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  useEffect(() => {
    dispatch(getAllDoctors());
    dispatch(getAllCodes("PRICE"));
    dispatch(getAllCodes("PAYMENT"));
    dispatch(getAllCodes("PROVINCE"));
    dispatch(getAllCodes("SPECIALTY"));
    dispatch(getAllCodes("CLINIC"));
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
    <div className="doctor-manage container">
      <div className="u-main-title text-center mt-3">{t("doctor-manage.title")}</div>

      <div className="doctor-manage-inputs mt-5">
        <h2 className="u-sub-title d-flex justify-content-between">
          INPUTS
          <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
            <IoReload />
          </button>
        </h2>
        <div className="row">
          <div className="col-4">
            <label className="u-input-label">{t("doctor-manage.choose-doctor")}</label>

            <div className="mt-3">
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
            <label className="u-input-label">{t("common.choose-price")}</label>

            <div className="mt-3">
              {priceArr && priceArr.length > 0 && (
                <Select
                  value={state.selectedPrice}
                  onChange={(option) => handleInfos(option, "selectedPrice")}
                  options={handleInfoOptions("price", priceArr)}
                  placeholder={t("common.placeholder-price")}
                />
              )}
            </div>
          </div>

          <div className="col-4">
            <label className="u-input-label">{t("common.choose-clinic")}</label>

            <div className="mt-3">
              {clinicArr?.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => handleInfos(option, "selectedClinic")}
                  options={handleInfoOptions("clinic", clinicArr)}
                  placeholder={t("common.placeholder-clinic")}
                />
              )}
            </div>
          </div>

          <div className="col-4 mt-5">
            <label className="u-input-label">{t("common.choose-method-payment")}</label>

            <div className="mt-3">
              {paymentArr && paymentArr.length > 0 && (
                <Select
                  value={state.selectedPayment}
                  onChange={(option) => handleInfos(option, "selectedPayment")}
                  options={handleInfoOptions("payment", paymentArr)}
                  placeholder={t("common.placeholder-payment")}
                />
              )}
            </div>
          </div>

          <div className="col-4 mt-5">
            <label className="u-input-label">{t("common.choose-province")}</label>

            <div className="mt-3">
              {provinceArr && provinceArr.length > 0 && (
                <Select
                  value={state.selectedProvince}
                  onChange={(option) => handleInfos(option, "selectedProvince")}
                  options={handleInfoOptions("province", provinceArr)}
                  placeholder={t("common.placeholder-province")}
                />
              )}
            </div>
          </div>

          <div className="col-4 mt-5">
            <label className="u-input-label">{t("common.choose-specialty")}</label>

            <div className="select-specialty mt-3">
              {specialtyArr && specialtyArr.length > 0 && (
                <Select
                  value={state.selectedSpecialty}
                  onChange={(option) => handleInfos(option, "selectedSpecialty")}
                  options={handleInfoOptions("specialty", specialtyArr)}
                  placeholder={t("common.placeholder-specialty")}
                />
              )}
            </div>
          </div>

          <Form.Group className="mt-5 col-6" controlId="formClinicAddress">
            <label className="u-input-label">{t("doctor-manage.clinic-address")}</label>

            <Form.Control
              type="text"
              value={state.addressClinic}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "addressClinic")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-6" controlId="formNote">
            <label className="u-input-label">{t("doctor-manage.note")}</label>

            <Form.Control
              type="text"
              value={state.note}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "note")}
            />
          </Form.Group>

          <div className="col-6 mt-5">
            <label className="u-input-label d-block ">{t("common.outstanding")}</label>

            <Radio.Group
              className="mt-2"
              onChange={(e) => handleCheckRadio(e, "popular")}
              value={state.popular}
            >
              <Radio value={false}>{language === "vi" ? "Không phổ biến" : "Unpopular"}</Radio>
              <Radio value={true}>{language === "vi" ? "Phổ biến" : "Popular"}</Radio>
            </Radio.Group>
          </div>

          <div className="col-12 mt-5">
            <label className="u-input-label d-block ">{t("common.consultant-remote")}</label>

            <Radio.Group
              className="mt-2"
              onChange={(e) => handleCheckRadio(e, "remote")}
              value={state.remote}
            >
              <Radio value={false}>{language === "vi" ? "Không" : "No"}</Radio>
              <Radio value={true}>{language === "vi" ? "Có" : "Yes"}</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>

      <div className="doctor-manage-markdowns mt-5">
        <h2 className="u-sub-title">MARKDOWNS</h2>
        <div className="doctor-manage-markdown">
          <label className="u-input-label">{t("doctor-manage.summary")}</label>

          <MdEditor
            value={state.introductionMarkdown}
            style={{
              height: 300,
              marginBottom: 24,
            }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "introduction")}
          />
        </div>

        <div className="doctor-manage-markdown">
          <label className="u-input-label">{t("doctor-manage.more-info")}</label>

          <MdEditor
            value={state.aboutMarkdown}
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "about")}
          />
        </div>
      </div>

      <div className="u-system-button my-5 d-flex gap-3 justify-content-end">
        <Button variant="danger" onClick={handleDeleteInfoDoctor}>
          {t("button.delete")}
        </Button>

        <Button variant="primary" onClick={handleSaveInfoDoctor}>
          {state.isHaveInfo ? t("button.update") : t("button.create")}
        </Button>
      </div>
    </div>
  );
};

export default AddInfoDoctor;
