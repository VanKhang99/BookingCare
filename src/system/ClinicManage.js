import React, { useState, useEffect, useRef } from "react";
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
import { getAllClinics, getClinic, saveDataClinic, deleteClinic } from "../slices/clinicSlice";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { checkData, postImageToS3, deleteImageOnS3 } from "../utils/helpers";

import "./styles/ClinicManage.scss";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  selectedClinic: "",

  nameVi: "",
  nameEn: "",
  address: "",
  keyWord: "",
  haveSpecialtyPage: false,
  popular: false,
  image: "",
  logo: "",
  fileImage: "",
  fileLogo: "",
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
  const { clinics } = useSelector((store) => store.clinic);

  const handleInfos = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleInfoOptions = (data) => {
    if (!data) return;
    const objectOptions = data.map((item) => {
      const label = language === "vi" ? `${item.nameVi}` : `${item.nameEn}`;
      const value = item.id;
      return { value, label };
    });

    return objectOptions;
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  const handleOnChangeImage = async (e, type) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      // const fileCovert = await toBase64(file);
      const nameImage = (type === "Image" ? state.image : state.logo) || file.name;

      return setState({
        ...state,
        [`file${type}`]: file,
        [`${type === "Image" ? "image" : "logo"}`]: nameImage,
        [`preview${type}Url`]: objectURL,
      });
    }
  };

  const handleOpenImagePreview = (type) => {
    if (!state[`preview${type}Url`]) return;

    setState({ ...state, [`isOpen${type}Preview`]: true });
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    return setState({ ...state, [`${type}HTML`]: html, [`${type}Markdown`]: text });
  };

  const handleSaveDataClinic = async (e) => {
    try {
      const propsCheckArr = ["nameVi", "nameEn", "address", "haveSpecialtyPage", "popular", "image", "logo"];
      const validate = checkData(state, propsCheckArr);
      if (!validate) return toast.error("Please fill in all information before saving");

      let imageCoverUploadToS3, logoUploadToS3;
      if (state.action === "edit") {
        if (typeof state.fileImage !== "string") {
          // Delete old image before update new image
          await deleteImageOnS3(state.image);
          imageCoverUploadToS3 = await postImageToS3(state.fileImage);
        }
        if (typeof state.fileLogo !== "string") {
          // Delete old image before update new image
          await deleteImageOnS3(state.logo);
          logoUploadToS3 = await postImageToS3(state.fileLogo);
        }
      } else {
        imageCoverUploadToS3 = await postImageToS3(state.fileImage);
        logoUploadToS3 = await postImageToS3(state.fileLogo);
      }

      const clinicInfo = {
        ...state,
        image: imageCoverUploadToS3?.data?.data?.image,
        logo: logoUploadToS3?.data?.data?.image,
        id: state.selectedClinic.value,
        action: state.action || "create",
      };

      const info = await dispatch(saveDataClinic(clinicInfo));
      if (info?.payload?.status === "success") {
        toast.success("Hospital (Clinic) data is saved successfully!");
        await dispatch(getAllClinics());
        setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdateClinic = async (selectedOption) => {
    try {
      const clinic = await dispatch(getClinic(selectedOption?.value || +state.oldSelectedClinic));
      const { id, ...restClinicData } = clinic.payload.data;
      const clinicSelected = handleInfoOptions(clinics).find((item) => item.value === id);

      return setState({
        ...state,
        selectedClinic: clinicSelected,
        previewImageUrl: restClinicData.imageUrl,
        previewLogoUrl: restClinicData.logoUrl,
        isHaveInfo: true,
        action: "edit",
        oldSelectedClinic: id,
        ...restClinicData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClinic = async () => {
    try {
      if (!state.selectedClinic) return toast.error("Hospital (clinic) is not selected");
      alert("Are you sure you want to delete?");

      await deleteImageOnS3(state.image);
      await deleteImageOnS3(state.logo);

      const res = await dispatch(deleteClinic(state.selectedClinic.value));
      if (res.payload === "") {
        toast.success("Hospital (Clinic) is deleted successfully!");
        await dispatch(getAllClinics());
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // dispatch(getAllCodes("CLINIC"));
    if (!clinics.length) {
      const dispatchedThunk = dispatch(getAllClinics());

      return () => {
        dispatchedThunk.abort();
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics.length]);

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
    if (state.oldSelectedClinic) {
      handleUpdateClinic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="clinic-manage container">
      <div className="u-main-title text-center mt-4">{t("clinic-manage.title")}</div>

      <div className="package-type-created">
        <div className="row">
          <div className="col-12">
            <h2 className="u-sub-title mt-5 mb-3 d-flex justify-content-between align-items-center">
              {t("clinic-manage.clinic-created").toUpperCase()}
              <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
                <IoReload />
              </button>
            </h2>
            <div className="select-clinics mt-2">
              {clinics?.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => {
                    handleInfos(option, "selectedClinic");
                    handleUpdateClinic(option);
                  }}
                  options={handleInfoOptions(clinics)}
                  placeholder={t("clinic-manage.placeholder-hospital")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="clinic-manage-inputs mt-5">
        <h2 className="u-sub-title d-flex justify-content-between">INPUTS</h2>

        <div className="row">
          <Form.Group className="col-3" controlId="formNameVi">
            <h4 className="u-input-label">{t("common.name-vi")}</h4>

            <Form.Control
              type="text"
              value={state.nameVi}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "nameVi")}
            />
          </Form.Group>

          <Form.Group className="col-3" controlId="formNameEn">
            <h4 className="u-input-label">{t("common.name-en")}</h4>

            <Form.Control
              type="text"
              value={state.nameEn}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "nameEn")}
            />
          </Form.Group>

          <Form.Group className="col-3" controlId="formClinicAddress">
            <h4 className="u-input-label">{t("clinic-manage.address")}</h4>

            <Form.Control
              type="text"
              value={state.address}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "address")}
            />
          </Form.Group>

          <Form.Group className="col-3" controlId="formKeyWord">
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
                  <FaUpload /> {t("button.upload")}
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
                  <FaUpload /> {t("button.upload")}
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
        <Button variant="primary" onClick={handleSaveDataClinic}>
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
