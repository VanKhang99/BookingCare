import React, { useState, useEffect } from "react";
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
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import {
  getAllSpecialties,
  getInfoSpecialty,
  saveInfoSpecialty,
  deleteInfoSpecialty,
} from "../slices/specialtySlice";
import { checkData, postImageToS3, deleteImageOnS3 } from "../utils/helpers";

import "react-image-lightbox/style.css";
import "./styles/SpecialtyMange.scss";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  selectedSpecialty: "",

  nameVi: "",
  nameEn: "",
  popular: false,
  remote: false,

  image: "",
  fileImage: "",
  previewImageUrl: "",
  isOpenImagePreview: false,
  imageRemote: "",
  fileImageRemote: "",
  previewImageRemoteUrl: "",
  isOpenImageRemotePreview: false,

  descriptionHTML: "",
  descriptionMarkdown: "",
  descriptionRemoteHTML: "",
  descriptionRemoteMarkdown: "",

  isHaveInfo: false,
  action: "create",
  oldSelectedSpecialty: "",
};

const SpecialtyManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { specialties } = useSelector((store) => store.specialty);

  const handleInfoOptions = (data) => {
    if (!data) return;

    const arrOptions = data.map((item) => {
      const label = language === "vi" ? item.nameVi : item.nameEn;
      const value = item.id;
      return { label, value };
    });

    return arrOptions;
  };

  const handleInfos = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleOnChangeImage = (e, type) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      // const fileCovert = await toBase64(file);
      const nameImage = (type === "Image" ? state.image : state.imageRemote) || file.name;

      return setState({
        ...state,
        [`file${type}`]: file,
        [`${type === "Image" ? "image" : "imageRemote"}`]: nameImage,
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
    return setState({ ...state, [`${type}HTML`]: html, [`${type}Markdown`]: text });
  };

  const handleSaveDataSpecialty = async () => {
    try {
      const propArrKey = ["nameVi", "nameEn", "popular", "remote"];
      const validate = checkData(state, propArrKey);
      if (!validate) return toast.error("Please fill in all information before saving");

      let imageUploadToS3, imageRemoteUploadToS3;
      if (state.action === "edit") {
        if (typeof state.fileImage !== "string") {
          // Delete old image before update new image
          await deleteImageOnS3(state.image);
          imageUploadToS3 = await postImageToS3(state.fileImage);
        }
        if (typeof state.fileImageRemote !== "string") {
          await deleteImageOnS3(state.imageRemote);
          imageRemoteUploadToS3 = await postImageToS3(state.fileImageRemote);
        }
      } else {
        imageUploadToS3 = await postImageToS3(state.fileImage);
        imageRemoteUploadToS3 = await postImageToS3(state.fileImageRemote);
      }

      const specialtyInfo = {
        ...state,
        nameEn: state.nameEn,
        nameVi: state.nameVi,
        popular: state.popular,
        remote: state.remote,
        image: imageUploadToS3?.data?.data?.image,
        imageRemote: imageRemoteUploadToS3?.data?.data?.image,
        ...(state.action === "edit" && { id: state.selectedSpecialty?.value }),
        action: state.action,
      };

      const res = await dispatch(saveInfoSpecialty({ ...specialtyInfo }));

      if (res.payload?.status === "success") {
        toast.success("Specialty data is saved successfully!");
        await dispatch(getAllSpecialties("all"));
        return setState({ ...initialState });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSpecialty = async (selectedOption) => {
    try {
      const res = await dispatch(getInfoSpecialty(+selectedOption?.value || +state.oldSelectedSpecialty));
      const { id, ...restSpecialtyData } = res.payload.data;
      const specialtySelected = handleInfoOptions(specialties).find((item) => item.value === id);

      return setState({
        ...state,
        selectedSpecialty: specialtySelected,
        previewImageUrl: restSpecialtyData.imageUrl,
        previewImageRemoteUrl: restSpecialtyData.imageRemoteUrl,
        isHaveInfo: true,
        action: "edit",
        oldSelectedSpecialty: id,

        ...restSpecialtyData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDataSpecialty = async () => {
    try {
      if (!state.selectedSpecialty) return toast.error("Specialty is not selected");
      alert("Are you sure you want to delete?");

      await deleteImageOnS3(state.image);
      await deleteImageOnS3(state.imageRemote);

      const res = await dispatch(deleteInfoSpecialty(state.selectedSpecialty.value));
      if (res.payload === "") {
        toast.success("Specialty is deleted successfully!");
        await dispatch(getAllSpecialties("all"));
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllSpecialties("all"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.oldSelectedSpecialty) {
      handleUpdateSpecialty();
    }
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

  // console.log(state);
  return (
    <div className="specialty-manage container">
      <div className="u-main-title mt-3">{t("specialty-manage.title")}</div>

      <div className="package-type-created">
        <div className="row">
          <div className="col-12">
            <h2 className="u-sub-title mt-5 mb-3 d-flex justify-content-between align-items-center">
              {t("specialty-manage.specialty-created").toUpperCase()}
              <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
                <IoReload />
              </button>
            </h2>
            <div className="select-clinics mt-2">
              {specialties?.length > 0 && (
                <Select
                  value={state.selectedSpecialty}
                  onChange={(option) => {
                    handleInfos(option, "selectedClinic");
                    handleUpdateSpecialty(option);
                  }}
                  options={handleInfoOptions(specialties)}
                  placeholder={t("specialty-manage.choose-specialty")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="specialty-manage-inputs">
        <h2 className="u-sub-title mt-5 d-flex justify-content-between">INPUTS</h2>
        <div className="row">
          <Form.Group className="col-6" controlId="formNameVi">
            <h4 className="u-input-label">{t("common.name-vi")}</h4>

            <Form.Control
              type="text"
              value={state.nameVi}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "nameVi")}
            />
          </Form.Group>

          <Form.Group className="col-6" controlId="formNameEn">
            <h4 className="u-input-label">{t("common.name-en")}</h4>

            <Form.Control
              type="text"
              value={state.nameEn}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "nameEn")}
            />
          </Form.Group>
        </div>

        <div className="row">
          <div className="col-6 mt-5">
            <Form.Group className="form-group col-12 image-preview-container" controlId="formImage">
              <label htmlFor="image" className="u-input-label">
                {t("specialty-manage.image-specialty")}
              </label>
              <input
                type="file"
                id="image"
                className="form-control"
                // value={state.fileImage?.name}
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
                // value={state.fileImageRemote?.name}
                onChange={(e) => handleOnChangeImage(e, "ImageRemote")}
                hidden
              />

              <div className="col-12 input-image-remote-customize">
                <label htmlFor="imageRemote">
                  <FaUpload /> {t("button.upload")}
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

          <div className="col-12 mt-5">
            <h4 className="u-input-label">{t("common.outstanding")}</h4>

            <Radio.Group onChange={(e) => handleCheckRadio(e, "popular")} value={state.popular}>
              <Radio value={false}>{language === "vi" ? "Không phổ biến" : "Unpopular"}</Radio>
              <Radio value={true}>{language === "vi" ? "Phổ biến" : "Popular"}</Radio>
            </Radio.Group>
          </div>

          <div className="col-12 mt-5">
            <h4 className="u-input-label">{t("common.consultant-remote")}</h4>

            <Radio.Group onChange={(e) => handleCheckRadio(e, "remote")} value={state.remote}>
              <Radio value={false}>{language === "vi" ? "Không" : "No"}</Radio>
              <Radio value={true}>{language === "vi" ? "Có" : "Yes"}</Radio>
            </Radio.Group>
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
          <h4 className="u-input-label">Giới thiệu về chuyên khoa từ xa</h4>

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
        <Button variant="primary" className="u-system-button" onClick={handleSaveDataSpecialty}>
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
