import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Lightbox from "react-image-lightbox";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Radio } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllCode } from "../slices/allcodeSlice";
import { getInfoClinic, saveInfoClinic, deleteClinic } from "../slices/clinicSlice";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { toBase64, checkData } from "../utils/helpers";

import "./styles/ClinicManage.scss";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  selectedClinic: "",

  address: "",
  keyWord: "",
  haveSpecialtyPage: false,
  popular: false,
  image: "",
  logo: "",
  previewImageUrl: "",
  previewLogoUrl: "",
  isOpenImagePreview: false,
  isOpenLogoPreview: false,
  action: "",
  isHaveInfo: false,
  oldSelectedClinic: "",

  noteHTML: "",
  noteMarkdown: "",
  bookingHTML: "",
  bookingMarkdown: "",
  introductionHTML: "",
  introductionMarkdown: "",
  strengthsHTML: "",
  strengthsMarkdown: "",
  equipmentHTML: "",
  equipmentMarkdown: "",
  locationHTML: "",
  locationMarkdown: "",
  processHTML: "",
  processMarkdown: "",
  priceHTML: "",
  priceMarkdown: "",
};

const ClinicManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { clinicArr } = useSelector((store) => store.allcode);
  const saveOldClinic = useRef(null);

  const handleInfos = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleOptionClinic = (data) => {
    if (!data) return;
    const objectOptions = data.map((item) => {
      const label = language === "vi" ? `${item.valueVi}` : `${item.valueEn}`;
      const value = item.keyMap;
      return { value, label };
    });

    return objectOptions;
  };

  const handleStateSelectClinic = async (selectedOption) => {
    try {
      const clinic = await dispatch(getInfoClinic(selectedOption?.value || state.oldSelectedClinic));

      const findClinicSelected = (id) => {
        return handleOptionClinic(clinicArr).find((item) => item.value === id);
      };

      if (clinic?.payload?.data && !_.isEmpty(clinic.payload.data)) {
        const clinicData = clinic.payload.data;
        const propsCheckArr = ["clinicId", "address", "haveSpecialtyPage", "popular", "image", "logo"];
        const checkClinicData = checkData(clinicData, propsCheckArr);
        const clinicSelected = findClinicSelected(clinicData.clinicId);

        if (!checkClinicData) {
          return toast.error(
            "Your data return from the server in not enough. Please check your data and try again!"
          );
        }

        return setState({
          ...state,
          selectedClinic: clinicSelected,
          address: clinicData.address,
          keyWord: clinicData.keyWord,
          haveSpecialtyPage: clinicData.haveSpecialtyPage,
          popular: clinicData.popular,
          image: clinicData.image,
          previewImageUrl: clinicData.image,
          logo: clinicData.logo,
          previewLogoUrl: clinicData.logo,
          isHaveInfo: true,
          action: "edit",
          oldSelectedClinic: clinicData.clinicId,

          noteHTML: clinicData?.noteHTML,
          noteMarkdown: clinicData?.noteMarkdown,
          bookingHTML: clinicData?.bookingHTML,
          bookingMarkdown: clinicData?.bookingMarkdown,
          introductionHTML: clinicData?.introductionHTML,
          introductionMarkdown: clinicData?.introductionMarkdown,
          strengthsHTML: clinicData?.strengthsHTML,
          strengthsMarkdown: clinicData?.strengthsMarkdown,
          equipmentHTML: clinicData?.equipmentHTML,
          equipmentMarkdown: clinicData?.equipmentMarkdown,
          locationHTML: clinicData?.locationHTML,
          locationMarkdown: clinicData?.locationMarkdown,
          processHTML: clinicData?.processHTML,
          processMarkdown: clinicData?.processMarkdown,
          priceHTML: clinicData?.priceHTML,
          priceMarkdown: clinicData?.priceMarkdown,
        });
      }

      const selectedClinic = findClinicSelected(state.selectedClinic.value);

      return setState({
        ...initialState,
        selectedClinic: selectedOption || selectedClinic,
        oldSelectedClinic: selectedOption?.value || selectedClinic.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  const handleOnChangeImage = async (e, type) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      const fileCovert = await toBase64(file);

      return setState({
        ...state,
        [`${type === "Image" ? "image" : "logo"}`]: fileCovert,
        [`preview${type === "Image" ? "Image" : "Logo"}Url`]: objectURL,
      });
    }
  };

  const handleOpenImagePreview = (type) => {
    if (!state[`preview${type === "Image" ? "Image" : "Logo"}Url`]) return;

    setState({ ...state, [`isOpen${type === "Image" ? "Image" : "Logo"}Preview`]: true });
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    stateCopy[`${type}HTML`] = html;
    stateCopy[`${type}Markdown`] = text;
    return setState({ ...stateCopy });
  };

  const handleSaveDataClinic = async () => {
    try {
      const propsCheckArr = ["selectedClinic", "address", "haveSpecialtyPage", "popular", "image", "logo"];
      const validate = checkData(state, propsCheckArr);
      if (!validate) throw new Error("Input data not enough");

      const clinicInfo = {
        ...state,
        clinicId: state.selectedClinic.value,
        action: state.action || "create",
      };

      const info = await dispatch(saveInfoClinic(clinicInfo));

      if (info?.payload?.status === "success") {
        toast.success("Doctor's info is saved successfully!");
        setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDeleteClinic = async () => {
    try {
      if (!state.selectedClinic) throw new Error("Doctor is not selected");
      alert("Are you sure you want to delete?");

      console.log(state.selectedClinic);

      const res = await dispatch(deleteClinic(state.selectedClinic.value));
      if (res.payload === "") {
        toast.success("Clinic information is deleted successfully!");
        await dispatch(getAllCode("CLINIC"));
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCode("CLINIC"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.previewImageUrl) return;
    if (!state.previewLogoUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImageUrl);
      URL.revokeObjectURL(state.previewLogoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image, state.logo]);

  useEffect(() => {
    if (clinicArr?.length > 0) {
      handleOptionClinic(clinicArr);
    }

    if (state.oldSelectedClinic) {
      handleStateSelectClinic();
    }
    saveOldClinic.current = state.oldSelectedClinic;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="clinic-manage container">
      <div className="u-main-title text-center mt-4">{t("clinic-manage.title")}</div>

      <div className="clinic-manage-inputs mt-5">
        <h2 className="u-sub-title d-flex justify-content-between">
          INPUTS
          <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
            <IoReload />
          </button>
        </h2>

        <div className="row">
          <div className="col-4">
            <h4 className="u-input-label">{t("clinic-manage.choose-hospital")}</h4>

            <div className="select-clinics mt-2">
              {clinicArr?.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => {
                    handleInfos(option, "selectedClinic");
                    handleStateSelectClinic(option);
                  }}
                  options={handleOptionClinic(clinicArr)}
                  placeholder={t("clinic-manage.placeholder-hospital")}
                />
              )}
            </div>
          </div>

          <Form.Group className="col-4" controlId="formClinicAddress">
            <h4 className="u-input-label">{t("clinic-manage.address")}</h4>

            <Form.Control
              type="text"
              value={state.address}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "address")}
            />
          </Form.Group>

          <Form.Group className="col-4" controlId="formKeyWord">
            <h4 className="u-input-label">Keyword (abbreviations)</h4>

            <Form.Control
              type="text"
              value={state.keyWord}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "keyWord")}
            />
          </Form.Group>
        </div>

        <div className="row">
          <div className="col-6 mt-5">
            <Form.Group className="form-group col-12 image-preview-container" controlId="formImage">
              <label htmlFor="image" className="u-input-label">
                {t("clinic-manage.image")}
              </label>
              <input
                type="file"
                id="image"
                className="form-control"
                onChange={(e) => handleOnChangeImage(e, "Image")}
                hidden
              />

              <div className="col-12 input-image-customize">
                <label htmlFor="image">
                  <FaUpload /> {t("clinic-manage.button-upload")}
                </label>
              </div>

              <div
                className={`col-12  ${state.previewImageUrl ? "image-preview open" : "image-preview"}`}
                onClick={() => handleOpenImagePreview("Image")}
                style={{
                  backgroundImage: `url(${state.previewImageUrl ? state.previewImageUrl : ""})`,
                }}
              ></div>
            </Form.Group>
          </div>

          <div className="col-6 mt-5">
            <Form.Group className="form-group col-12 logo-preview-container" controlId="formLogo">
              <label htmlFor="logo" className="u-input-label">
                Logo
              </label>
              <input
                type="file"
                id="logo"
                className="form-control"
                onChange={(e) => handleOnChangeImage(e, "Logo")}
                hidden
              />

              <div className="col-12 input-logo-customize">
                <label htmlFor="logo">
                  <FaUpload /> {t("clinic-manage.button-upload")}
                </label>
              </div>

              <div
                className={`col-12  ${state.previewLogoUrl ? "logo-preview open" : "logo-preview"}`}
                onClick={() => handleOpenImagePreview("Logo")}
                style={{
                  backgroundImage: `url(${state.previewLogoUrl ? state.previewLogoUrl : ""})`,
                }}
              ></div>
            </Form.Group>
          </div>
        </div>

        <div className="row">
          <div className="col-6 mt-5">
            <div className="col-12">
              <h4 className="u-input-label">{t("common.outstanding")}</h4>

              <Radio.Group onChange={(e) => handleCheckRadio(e, "popular")} value={state.popular}>
                <Radio value={false}>{language === "vi" ? "Không phổ biến" : "Unpopular"}</Radio>
                <Radio value={true}>{language === "vi" ? "Phổ biến" : "Popular"}</Radio>
              </Radio.Group>
            </div>

            <div className="col-12 mt-5">
              <h4 className="u-input-label">{t("clinic-manage.specialtyPage")}</h4>

              <Radio.Group
                onChange={(e) => handleCheckRadio(e, "haveSpecialtyPage")}
                value={state.haveSpecialtyPage}
              >
                <Radio value={false}>{language === "vi" ? "Không cần" : "No need"}</Radio>
                <Radio value={true}>{language === "vi" ? "Cần" : "Need"}</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
      </div>

      {/* MARKDOWNS */}
      <div className="clinic-manage-markdowns mt-5">
        <h2 className="u-sub-title">MARKDOWN EDITOR</h2>

        <div className="clinic-manage-markdown">
          <h4 className="u-input-label mt-3">{t("clinic-manage.markdown-benefit")}</h4>

          <MdEditor
            value={state.noteMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "note")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-booking")}</h4>

          <MdEditor
            value={state.bookingMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "booking")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-intro")}</h4>

          <MdEditor
            value={state.introductionMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "introduction")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-strengths")}</h4>

          <MdEditor
            value={state.strengthsMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "strengths")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-equipment")}</h4>

          <MdEditor
            value={state.equipmentMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "equipment")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-location")}</h4>

          <MdEditor
            value={state.locationMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "location")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-process")}</h4>

          <MdEditor
            value={state.processMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "process")}
          />
        </div>

        <div className="clinic-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-manage.markdown-price")}</h4>

          <MdEditor
            value={state.priceMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "price")}
          />
        </div>
      </div>

      <div className="u-system-button my-5 d-flex justify-content-end gap-3">
        <Button variant="danger" onClick={() => handleDeleteClinic()}>
          {t("button.delete")}
        </Button>
        <Button variant="primary" onClick={() => handleSaveDataClinic()}>
          {state.isHaveInfo ? `${t("button.update")}` : `${t("button.create")}`}
        </Button>
      </div>

      {state.isOpenImagePreview && (
        <Lightbox
          mainSrc={state.previewImageUrl}
          onCloseRequest={() => setState({ ...state, isOpenImagePreview: false })}
        />
      )}

      {state.isOpenLogoPreview && (
        <Lightbox
          mainSrc={state.previewLogoUrl}
          onCloseRequest={() => setState({ ...state, isOpenLogoPreview: false })}
        />
      )}
    </div>
  );
};

export default ClinicManage;
