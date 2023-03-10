import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Lightbox from "react-image-lightbox";
import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Radio } from "antd";
import { toast } from "react-toastify";
import { toBase64 } from "../utils/helpers";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { getAllCodes } from "../slices/allcodeSlice";
import { getInfoSpecialty, saveInfoSpecialty, deleteInfoSpecialty } from "../slices/specialtySlice";
import { checkData } from "../utils/helpers";

import "react-image-lightbox/style.css";
import "./styles/SpecialtyMange.scss";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  selectedSpecialty: "",
  popular: false,
  remote: false,

  image: "",
  previewImageUrl: "",
  isOpenImagePreview: false,
  imageRemote: "",
  previewImageRemoteUrl: "",
  isOpenImageRemotePreview: false,

  descriptionHTML: "",
  descriptionMarkdown: "",
  descriptionRemoteHTML: "",
  descriptionRemoteMarkdown: "",

  isHaveInfo: false,
  action: "",
  oldSelectedSpecialty: "",

  // errorInput: {
  //   show: false,
  //   message: "",
  // },
};

const SpecialtyManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { specialtyArr } = useSelector((store) => store.allcode);
  const saveOldSpecialty = useRef(null);

  const handleInfoOptions = (data) => {
    if (!data) return;

    const arrOptions = data.map((item) => {
      const label = language === "vi" ? item.valueVi : item.valueEn;
      const value = item.keyMap;
      return { label, value };
    });

    return arrOptions;
  };

  const handleInfos = (selectedOption) => {
    return setState({ ...state, selectedSpecialty: selectedOption });
  };

  const handleStateSelectedSpecialty = async (selectedOption) => {
    try {
      const specialty = await dispatch(getInfoSpecialty(selectedOption?.value || state.oldSelectedSpecialty));

      const findSpecialtySelected = (id) => {
        return handleInfoOptions(specialtyArr).find((item) => item.value === id);
      };

      if (specialty?.payload?.specialty && !_.isEmpty(specialty.payload.specialty)) {
        const specialtyData = specialty.payload.specialty;
        const specialtySelected = findSpecialtySelected(specialtyData.specialtyId);

        return setState({
          ...state,
          selectedSpecialty: specialtySelected,
          image: specialtyData.image,
          previewImageUrl: specialtyData.image,
          imageRemote: specialtyData.imageRemote,
          previewImageRemoteUrl: specialtyData.imageRemote,
          descriptionHTML: specialtyData?.descriptionHTML,
          descriptionMarkdown: specialtyData?.descriptionMarkdown,
          descriptionRemoteHTML: specialtyData?.descriptionRemoteHTML,
          descriptionRemoteMarkdown: specialtyData?.descriptionRemoteMarkdown,
          popular: specialtyData?.popular,
          remote: specialtyData?.remote,
          isHaveInfo: true,
          action: "edit",
          oldSelectedSpecialty: specialtyData.specialtyId,
        });
      }

      const selectedSpecialty = findSpecialtySelected(state.selectedSpecialty.value);

      return setState({
        ...initialState,
        selectedSpecialty: selectedOption || selectedSpecialty,
        oldSelectedSpecialty: selectedOption?.value || selectedSpecialty.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChangeImage = async (e, type) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      const fileCovert = await toBase64(file);

      return setState({
        ...state,
        [`${type === "Image" ? "image" : "imageRemote"}`]: fileCovert,
        [`preview${type}Url`]: objectURL,
      });
    }
  };

  const handleOpenImagePreview = (type) => {
    if (!state[`preview${type}Url`]) return;

    setState({ ...state, [`isOpen${type}Preview`]: true });
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    stateCopy[`${type}HTML`] = html;
    stateCopy[`${type}Markdown`] = text;
    return setState({ ...stateCopy });
  };

  const handleSaveDataSpecialty = async () => {
    try {
      const propArrKey = [
        "selectedSpecialty",
        "descriptionHTML",
        "descriptionMarkdown",
        "descriptionRemoteHTML",
        "descriptionRemoteMarkdown",
        "image",
        "popular",
        "remote",
      ];
      const validate = checkData(state, propArrKey);
      if (!validate) throw new Error("Input data not enough");

      const res = await dispatch(
        saveInfoSpecialty({
          specialtyId: state.selectedSpecialty.value,
          image: state.image,
          imageRemote: state.imageRemote,
          popular: state.popular,
          remote: state.remote,
          descriptionHTML: state.descriptionHTML,
          descriptionMarkdown: state.descriptionMarkdown,
          descriptionRemoteHTML: state.descriptionRemoteHTML,
          descriptionRemoteMarkdown: state.descriptionRemoteMarkdown,
          action: state.action || "create",
        })
      );

      if (res?.payload?.status === "success") {
        toast.success("Specialty info is saved successfully!");
        return setState({ ...initialState });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDataSpecialty = async () => {
    try {
      if (!state.selectedSpecialty) throw new Error("Specialty is not selected");
      alert("Are you sure you want to delete?");

      console.log(state.selectedDoctor);

      const res = await dispatch(deleteInfoSpecialty(state.selectedSpecialty.value));
      if (res.payload === "") {
        toast.success("Specialty is deleted successfully!");
        await dispatch(getAllCodes("SPECIALTY"));
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCodes("SPECIALTY"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (specialtyArr?.length > 0) {
      handleInfoOptions(specialtyArr);
    }
    if (state.oldSelectedSpecialty) {
      handleStateSelectedSpecialty();
    }
    saveOldSpecialty.current = state.oldSelectedSpecialty;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (!state.previewImageUrl) return;
    if (!state.previewImageRemoteUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImageUrl);
      URL.revokeObjectURL(state.previewImageRemoteUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image, state.imageRemote]);

  return (
    <div className="specialty-manage container">
      <div className="u-main-title mt-3">{t("specialty-manage.title")}</div>

      <div className="specialty-manage-inputs">
        <h2 className="u-sub-title mt-5 d-flex justify-content-between">
          INPUTS
          <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
            <IoReload />
          </button>
        </h2>
        <div className="row">
          <Form.Group className="mt-2 col-4" controlId="formClinicAddress">
            <h4 className="u-input-label">{t("common.choose-specialty")}</h4>

            {specialtyArr && specialtyArr.length > 0 && (
              <Select
                value={state.selectedSpecialty}
                onChange={(option) => {
                  handleInfos(option);
                  handleStateSelectedSpecialty(option);
                }}
                options={handleInfoOptions(specialtyArr)}
                placeholder={t("common.placeholder-specialty")}
              />
            )}
          </Form.Group>
        </div>

        <div className="row">
          <div className="col-12 mt-5">
            <h4 className="u-input-label">{t("common.outstanding")}</h4>

            <Radio.Group onChange={(e) => handleCheckRadio(e, "popular")} value={state.popular}>
              <Radio value={false}>{language === "vi" ? "Kh??ng ph??? bi???n" : "Unpopular"}</Radio>
              <Radio value={true}>{language === "vi" ? "Ph??? bi???n" : "Popular"}</Radio>
            </Radio.Group>
          </div>

          <div className="col-12 mt-5">
            <h4 className="u-input-label">{t("common.consultant-remote")}</h4>

            <Radio.Group onChange={(e) => handleCheckRadio(e, "remote")} value={state.remote}>
              <Radio value={false}>{language === "vi" ? "Kh??ng" : "No"}</Radio>
              <Radio value={true}>{language === "vi" ? "C??" : "Yes"}</Radio>
            </Radio.Group>
          </div>

          <div className="col-4 mt-5">
            <Form.Group className="form-group col-12 image-preview-container" controlId="formImage">
              <label htmlFor="image" className="u-input-label">
                {t("specialty-manage.image-specialty")}
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
                  <FaUpload /> {t("specialty-manage.button-upload")}
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

          <div className="col-4 mt-5">
            <Form.Group
              className="form-group col-12 image-remote-preview-container"
              controlId="formImageRemote"
            >
              <label htmlFor="imageRemote" className="u-input-label">
                {t("specialty-manage.image-specialty-remote")}
              </label>
              <input
                type="file"
                id="imageRemote"
                className="form-control"
                onChange={(e) => handleOnChangeImage(e, "ImageRemote")}
                hidden
              />

              <div className="col-12 input-image-remote-customize">
                <label htmlFor="imageRemote">
                  <FaUpload /> {t("specialty-manage.button-upload")}
                </label>
              </div>

              <div
                className={`col-12  ${
                  state.previewImageRemoteUrl ? "image-remote-preview open" : "image-remote-preview"
                }`}
                onClick={() => handleOpenImagePreview("ImageRemote")}
                style={{
                  backgroundImage: `url(${state.previewImageRemoteUrl ? state.previewImageRemoteUrl : ""})`,
                }}
              ></div>
            </Form.Group>
          </div>
        </div>
      </div>

      <div className="specialty-manage-markdowns mt-5">
        <h2 className="u-sub-title">MARKDOWNS</h2>

        <div className="specialty-manage-markdown mt-3">
          <h4 className="u-input-label">{t("specialty-manage.introduction-specialty")}</h4>

          <MdEditor
            value={state.descriptionMarkdown}
            style={{ height: "350px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "description")}
          />
        </div>

        <div className="specialty-manage-markdown mt-5">
          <h4 className="u-input-label">Gi???i thi???u v??? chuy??n khoa t??? xa</h4>

          <MdEditor
            value={state.descriptionRemoteMarkdown}
            style={{ height: "350px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "descriptionRemote")}
          />
        </div>
      </div>

      <div className="u-system-button d-flex gap-3 justify-content-end my-5 text-end">
        <Button variant="danger" className="u-system-button" onClick={() => handleDeleteDataSpecialty()}>
          {t("button.delete")}
        </Button>
        <Button variant="primary" className="u-system-button" onClick={() => handleSaveDataSpecialty()}>
          {state.isHaveInfo ? `${t("button.update")}` : `${t("button.create")}`}
        </Button>
      </div>

      {state.isOpenImagePreview && (
        <Lightbox
          mainSrc={state.previewImageUrl}
          onCloseRequest={() => setState({ ...state, isOpenImagePreview: false })}
        />
      )}
      {state.isOpenImageRemotePreview && (
        <Lightbox
          mainSrc={state.previewImageRemoteUrl}
          onCloseRequest={() => setState({ ...state, isOpenImageRemotePreview: false })}
        />
      )}
    </div>
  );
};

export default SpecialtyManage;
