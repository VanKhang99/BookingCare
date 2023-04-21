import React, { useState, useEffect } from "react";
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
import { getAllClinics } from "../slices/clinicSlice";
import { getAllSpecialties } from "../slices/specialtySlice";
import { getAllDoctors, postInfoDoctor, getDoctor, deleteDoctor } from "../slices/doctorSlice";
import { checkData } from "../utils/helpers";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  introductionHTML: "",
  introductionMarkdown: "",
  aboutHTML: "",
  aboutMarkdown: "",

  selectedDoctor: "",
  // selectedPrice: "",
  selectedPayment: "",
  selectedProvince: "",
  selectedSpecialty: "",
  selectedClinic: "",

  price: "",
  addressClinic: "",
  note: "",

  popular: false,
  remote: false,
  isHaveInfo: false,
  action: "create",
  oldIdDoctor: "",
};

const AddInfoDoctor = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { doctors } = useSelector((store) => store.doctor);
  const { paymentArr, provinceArr } = useSelector((store) => store.allcode);
  const { clinics, clinicsLength } = useSelector((store) => store.clinic);
  const { specialties } = useSelector((store) => store.specialty);

  const handleInfos = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleOptions = (typeInfo, data) => {
    if (!data) return;

    const objectOptions = data.map(
      ({ id, firstName, lastName, nameVi, nameEn, valueVi, valueEn, keyMap, moreData }) => {
        let label;
        let value;
        if (typeInfo === "doctor") {
          label =
            language === "vi"
              ? `${moreData.lastName} ${moreData.firstName}`
              : `${moreData.firstName} ${moreData.lastName}`;
          value = moreData.id;
        } else if (typeInfo === "specialty" || typeInfo === "clinic") {
          label = language === "vi" ? `${nameVi}` : `${nameEn}`;
          value = id;
        } else if (typeInfo === "province" || typeInfo === "payment") {
          label = language === "vi" ? `${valueVi}` : `${valueEn}`;
          value = keyMap;
        }

        return { value, label };
      }
    );
    return objectOptions;
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    return setState({ ...state, [`${type}HTML`]: html, [`${type}Markdown`]: text });
  };

  const findItemSelectedById = (type, arr, id) => {
    return handleOptions(type, arr).find((item) => item.value === id);
  };

  const handleSaveInfoDoctor = async () => {
    try {
      const propArrKey = [
        "selectedDoctor",
        "selectedPayment",
        "selectedProvince",
        "selectedSpecialty",
        "popular",
        "remote",
      ];
      const validate = checkData(state, propArrKey);
      if (!validate) throw new Error("Input data not enough");

      const dataSendToServer = {
        doctorId: state.selectedDoctor.value,
        paymentId: state.selectedPayment.value,
        provinceId: state.selectedProvince.value,
        specialtyId: state.selectedSpecialty.value,
        clinicId: state.selectedClinic?.value,

        price: state.price,
        addressClinic: state.addressClinic || "",
        popular: state.popular,
        remote: state.remote,
        note: state.note,
        action: state.action || "create",

        introductionHTML: state.introductionHTML,
        introductionMarkdown: state.introductionMarkdown,
        aboutHTML: state.aboutHTML,
        aboutMarkdown: state.aboutMarkdown,
      };

      const info = await dispatch(postInfoDoctor(dataSendToServer));

      if (info.payload.status === "success") {
        toast.success("Doctor's info is saved successfully!");
        setState({ ...initialState });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDoctor = async (selectedOption) => {
    try {
      const res = await dispatch(getDoctor(+selectedOption?.value || +state.oldIdDoctor));

      if (!res.payload.data) return toast.error("Get data doctor failed. Please check and try again!");
      const doctor = res.payload.data;
      const { paymentData, provinceData, specialtyData } = doctor;

      const doctorSelected = findItemSelectedById("doctor", doctors, doctor.doctorId);
      const paymentInDB = findItemSelectedById("payment", paymentArr, paymentData.keyMap);
      const provinceInDB = findItemSelectedById("province", provinceArr, provinceData.keyMap);
      const specialtyInDB = findItemSelectedById("specialty", specialties, specialtyData.id);
      const clinicInDB = findItemSelectedById("clinic", clinics, doctor.clinicId);

      return setState({
        ...state,
        selectedDoctor: doctorSelected,
        selectedPayment: paymentInDB,
        selectedProvince: provinceInDB,
        selectedSpecialty: specialtyInDB,
        selectedClinic: clinicInDB,
        isHaveInfo: true,
        action: "edit",
        oldIdDoctor: doctor.doctorId,
        ...doctor,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteInfoDoctor = async () => {
    try {
      if (!state.selectedDoctor) throw new Error("Doctor is not selected");
      alert("Are you sure you want to delete?");

      // console.log(state.selectedDoctor);

      const res = await dispatch(deleteDoctor(state.selectedDoctor.value));
      if (res.payload === "") {
        toast.success("Doctor is deleted successfully!");
        await dispatch(getAllDoctors("all"));
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!paymentArr.length) {
      dispatch(getAllCodes("PAYMENT"));
    }

    if (!provinceArr.length) {
      dispatch(getAllCodes("PROVINCE"));
    }

    if (!doctors.length) {
      dispatch(getAllDoctors("all"));
    }

    if (!clinics.length) {
      dispatch(getAllClinics());
    }

    if (!specialties.length) {
      dispatch(getAllSpecialties("all"));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleOptions();
    if (state.oldIdDoctor) {
      handleUpdateDoctor();
    }
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
          <div className="col-6">
            <label className="u-input-label">{t("doctor-manage.choose-doctor")}</label>

            <div className="mt-3">
              {doctors?.length > 0 && (
                <Select
                  value={state.selectedDoctor}
                  onChange={(option) => {
                    handleInfos(option, "selectedDoctor");
                    handleUpdateDoctor(option);
                  }}
                  options={handleOptions("doctor", doctors)}
                  placeholder={t("doctor-manage.placeholder-doctor")}
                />
              )}
            </div>
          </div>

          <div className="col-6">
            <label className="u-input-label">{t("common.choose-clinic")}</label>

            <div className="mt-3">
              {clinics?.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => handleInfos(option, "selectedClinic")}
                  options={handleOptions("clinic", clinics)}
                  placeholder={t("common.placeholder-clinic")}
                />
              )}
            </div>
          </div>

          <div className="col-4 mt-5">
            <label className="u-input-label">{t("common.choose-method-payment")}</label>

            <div className="mt-3">
              {paymentArr?.length > 0 && (
                <Select
                  value={state.selectedPayment}
                  onChange={(option) => handleInfos(option, "selectedPayment")}
                  options={handleOptions("payment", paymentArr)}
                  placeholder={t("common.placeholder-payment")}
                />
              )}
            </div>
          </div>

          <div className="col-4 mt-5">
            <label className="u-input-label">{t("common.choose-province")}</label>

            <div className="mt-3">
              {provinceArr?.length > 0 && (
                <Select
                  value={state.selectedProvince}
                  onChange={(option) => handleInfos(option, "selectedProvince")}
                  options={handleOptions("province", provinceArr)}
                  placeholder={t("common.placeholder-province")}
                />
              )}
            </div>
          </div>

          <div className="col-4 mt-5">
            <label className="u-input-label">{t("common.choose-specialty")}</label>

            <div className="select-specialty mt-3">
              {specialties?.length > 0 && (
                <Select
                  value={state.selectedSpecialty}
                  onChange={(option) => handleInfos(option, "selectedSpecialty")}
                  options={handleOptions("specialty", specialties)}
                  placeholder={t("common.placeholder-specialty")}
                />
              )}
            </div>
          </div>

          <Form.Group className="mt-5 col-4" controlId="formPrice">
            <label className="u-input-label">{t("common.choose-price")}</label>

            <Form.Control
              type="text"
              value={state.price}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "price")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-4" controlId="formClinicAddress">
            <label className="u-input-label">{t("doctor-manage.clinic-address")}</label>

            <Form.Control
              type="text"
              value={state.addressClinic}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "addressClinic")}
            />
          </Form.Group>

          <Form.Group className="mt-5 col-4" controlId="formNote">
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
