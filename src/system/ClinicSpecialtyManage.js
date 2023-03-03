import React, { useState, useEffect } from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Lightbox from "react-image-lightbox";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpecialties } from "../slices/specialtySlice";
import { getAllClinics } from "../slices/clinicSlice";
import {
  getSpecialtyOfClinic,
  addSpecialtyForClinic,
  deleteSpecialtyForClinic,
} from "../slices/clinicSpecialtySlice";

import { checkData, postImageToS3, deleteImageOnS3 } from "../utils/helpers";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import "./styles/ClinicSpecialtyManage.scss";

const initialState = {
  selectedClinic: "",
  selectedSpecialty: "",

  address: "",
  image: "",
  fileImage: "",
  previewImageUrl: "",
  isOpenImagePreview: false,
  action: "create",
  oldSelectedClinic: "",
  oldSelectedSpecialty: "",
  isHaveInfo: false,

  bookingHTML: "",
  bookingMarkdown: "",
  introductionHTML: "",
  introductionMarkdown: "",
  examAndTreatmentHTML: "",
  examAndTreatmentMarkdown: "",
  strengthsHTML: "",
  strengthsMarkdown: "",
};

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ClinicSpecialtyManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { specialties } = useSelector((store) => store.specialty);
  const { clinics } = useSelector((store) => store.clinic);

  const handleInfos = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    return setState({ ...stateCopy });
  };

  const handleOption = (data) => {
    if (!data) return;
    const objectOptions = data.map((item) => {
      const label = language === "vi" ? `${item.nameVi}` : `${item.nameEn}`;
      const value = item.id;
      return { value, label };
    });

    return objectOptions;
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    return setState({ ...state, [`${type}HTML`]: html, [`${type}Markdown`]: text });
  };

  const handleOnChangeImage = (e, type) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      // const fileCovert = await toBase64(file);

      return setState({
        ...state,
        fileImage: file,
        image: state.image || file.name,
        previewImageUrl: objectURL,
      });
    }
  };

  const handleOpenImagePreview = () => {
    if (!state.previewImageUrl) return;

    setState({ ...state, isOpenImagePreview: true });
  };

  const findItemSelectedById = (arr, id) => {
    return handleOption(arr).find((item) => item.value === +id);
  };

  const handleSaveDataClinic = async () => {
    try {
      const propsCheckArr = ["selectedClinic", "selectedSpecialty", "address"];
      const validate = checkData(state, propsCheckArr);
      if (!validate) return toast.error("Please fill in all information before saving");

      let imageUploadToS3;
      if (typeof state.fileImage !== "string") {
        if (state.action === "edit") {
          // Delete old image before update new image
          await deleteImageOnS3(state.image);
        }

        // update new image
        imageUploadToS3 = await postImageToS3(state.fileImage);
      }

      const dataSpecialty = {
        ...state,
        image: imageUploadToS3?.data?.data?.image || state.image,
        clinicId: state.selectedClinic.value,
        specialtyId: state.selectedSpecialty.value,
        action: state.action,
      };

      const info = await dispatch(addSpecialtyForClinic(dataSpecialty));
      if (info?.payload?.status === "success") {
        toast.success("Specialty data of clinic is saved successfully!");
        setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdateSpecialtyClinic = async (selectedOption, selectOf = null) => {
    try {
      const res = await dispatch(
        getSpecialtyOfClinic({
          clinicId: selectOf === "Clinic" ? +selectedOption?.value : state.oldSelectedClinic,
          specialtyId: selectOf === "Specialty" ? +selectedOption?.value : state.oldSelectedSpecialty,
        })
      );

      if (res.payload.data) {
        const { clinicId, specialtyId, ...resSpecClinicData } = res.payload.data;
        const clinicSelected = findItemSelectedById(clinics, clinicId);
        const specialtySelected = findItemSelectedById(specialties, specialtyId);

        return setState({
          ...state,
          selectedClinic: clinicSelected,
          selectedSpecialty: specialtySelected,
          previewImageUrl: resSpecClinicData.imageUrl,
          isHaveInfo: true,
          action: "edit",
          oldSelectedClinic: clinicId,
          oldSelectedSpecialty: specialtyId,
          ...resSpecClinicData,
        });
      }

      if (selectOf) {
        const optionSelected = findItemSelectedById(
          selectOf === "Clinic" ? clinics : specialties,
          selectedOption.value
        );
        return setState({
          ...state,
          [`selected${selectOf}`]: optionSelected || "",
          [`oldSelected${selectOf}`]: optionSelected?.value,
        });
      } else {
        const specialtySelected = findItemSelectedById(specialties, state.selectedSpecialty?.value);
        const clinicSelected = findItemSelectedById(clinics, state.selectedClinic?.value);
        return setState({
          ...state,
          selectedClinic: clinicSelected || "",
          selectedSpecialty: specialtySelected || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSpecialOfClinic = async () => {
    try {
      if (!state.selectedClinic) throw new Error("Clinic is not selected");
      if (!state.selectedSpecialty) throw new Error("Specialty is not selected");
      alert("Are you sure you want to delete?");

      await deleteImageOnS3(state.image);

      const res = await dispatch(
        deleteSpecialtyForClinic({
          specialtyId: state.selectedSpecialty.value,
          clinicId: state.selectedClinic.value,
        })
      );
      if (res.payload === "") {
        toast.success("Specialty of clinic is deleted successfully!");
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllSpecialties("all"));
    dispatch(getAllClinics("all"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.oldSelectedClinic || state.oldSelectedSpecialty) {
      handleUpdateSpecialtyClinic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (!state.previewImageUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image]);

  return (
    <div className="clinic-specialty-manage container">
      <div className="u-main-title text-center mt-4">{t("clinic-specialty-manage.main-title")}</div>

      <div className="clinic-specialty-manage-inputs">
        <h2 className="u-sub-title mt-5 d-flex justify-content-between">
          INPUTS
          <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
            <IoReload />
          </button>
        </h2>
        <div className="row mt-3">
          <div className="col-4">
            <h4 className="u-input-label">{t("clinic-specialty-manage.clinic")}</h4>

            <div className="select-clinics mt-2">
              {clinics?.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => {
                    handleInfos(option, "selectedClinic");
                    handleUpdateSpecialtyClinic(option, "Clinic");
                  }}
                  options={handleOption(clinics)}
                  placeholder={t("clinic-specialty-manage.placeholder-clinic")}
                />
              )}
            </div>
          </div>

          <div className="col-4">
            <h4 className="u-input-label">{t("clinic-specialty-manage.add-specialty")}</h4>

            <div className="select-specialties mt-2">
              {specialties?.length > 0 && (
                <Select
                  value={state.selectedSpecialty}
                  onChange={(option) => {
                    handleInfos(option, "selectedSpecialty");
                    handleUpdateSpecialtyClinic(option, "Specialty");
                  }}
                  options={handleOption(specialties)}
                  placeholder={t("clinic-specialty-manage.placeholder-specialty")}
                />
              )}
            </div>
          </div>

          <Form.Group className="col-4" controlId="formAddress">
            <h4 className="u-input-label">{t("clinic-specialty-manage.address")}</h4>

            <Form.Control
              type="text"
              value={state.address}
              className="u-input"
              onChange={(e, id) => handleInfos(e, "address")}
            />
          </Form.Group>
        </div>

        <div className="row">
          <div className="col-4 mt-5">
            <Form.Group className="form-group col-12 image-preview-container" controlId="formImage">
              <label htmlFor="image" className="u-input-label">
                {t("clinic-specialty-manage.image")}
              </label>
              <input
                type="file"
                id="image"
                className="form-control"
                onChange={(e) => handleOnChangeImage(e)}
                hidden
              />

              <div className="col-12 input-image-customize">
                <label htmlFor="image">
                  <FaUpload /> {t("button.upload")}
                </label>
              </div>

              <div
                className={`col-12  ${state.previewImageUrl ? "image-preview open" : "image-preview"}`}
                onClick={() => handleOpenImagePreview()}
                style={{
                  backgroundImage: `url(${state.previewImageUrl ? state.previewImageUrl : ""})`,
                }}
              ></div>
            </Form.Group>
          </div>
        </div>
      </div>

      <div className="clinic-specialty-manage-markdowns mt-5">
        <h2 className="u-sub-title">MARKDOWNS</h2>

        <div className="clinic-specialty-manage-markdown mt-3">
          <h4 className="u-input-label">{t("clinic-specialty-manage.markdown-booking")}</h4>

          <MdEditor
            value={state.bookingMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "booking")}
          />
        </div>

        <div className="clinic-specialty-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-specialty-manage.markdown-introduction")}</h4>

          <MdEditor
            value={state.introductionMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "introduction")}
          />
        </div>

        <div className="clinic-specialty-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-specialty-manage.markdown-examAndTreatment")}</h4>

          <MdEditor
            value={state.examAndTreatmentMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "examAndTreatment")}
          />
        </div>

        <div className="clinic-specialty-manage-markdown mt-5">
          <h4 className="u-input-label">{t("clinic-specialty-manage.markdown-strengths")}</h4>

          <MdEditor
            value={state.strengthsMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "strengths")}
          />
        </div>
      </div>

      <div className="u-system-button my-5 d-flex justify-content-end gap-3">
        <Button variant="danger" onClick={handleDeleteSpecialOfClinic}>
          {t("button.delete")}
        </Button>
        <Button variant="primary" onClick={() => handleSaveDataClinic()}>
          {state.isHaveInfo ? `${t("button.update")}` : `${t("button.add")}`}
        </Button>
      </div>

      {state.isOpenImagePreview && (
        <Lightbox
          mainSrc={state.previewImageUrl}
          onCloseRequest={() => setState({ ...state, isOpenImagePreview: false })}
        />
      )}
    </div>
  );
};

export default ClinicSpecialtyManage;
