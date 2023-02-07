import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Lightbox from "react-image-lightbox";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllCode } from "../slices/allcodeSlice";
import { addSpecialtyForClinic } from "../slices/clinicSpecialtySlice";
import { getSpecialtyOfClinic } from "../slices/clinicSpecialtySlice";
import { toBase64, checkData } from "../utils/helpers";
import { FaUpload } from "react-icons/fa";
import "./styles/ClinicAddSpecialty.scss";

const initialState = {
  selectedClinic: "",
  selectedSpecialty: "",
  address: "",
  image: "",
  previewImageUrl: "",
  isOpenImagePreview: false,
  action: "",
  oldSelectedClinic: "",
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

const ClinicAddSpecialty = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { clinicArr, specialtyArr } = useSelector((store) => store.allcode);
  const saveOldClinic = useRef(null);

  const handleInfos = (e, type) => {
    console.log(type, e);
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    return setState({ ...stateCopy });
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
      // selectedOption?.value || state.oldSelectedClinic
      const specialtyClinic = await dispatch(
        getSpecialtyOfClinic({
          clinicId: selectedOption?.value || state.oldSelectedClinic,
          specialtyId: state.selectedSpecialty.value,
        })
      );

      const findItemSelectedById = (arr, id) => {
        return handleOptionClinic(arr).find((item) => item.value === id);
      };

      if (specialtyClinic?.payload?.data && !_.isEmpty(specialtyClinic.payload.data)) {
        const specialtyClinicData = specialtyClinic.payload.data;
        const clinicSelected = findItemSelectedById(clinicArr, specialtyClinicData.clinicId);
        const specialtySelected = findItemSelectedById(specialtyArr, specialtyClinicData.specialtyId);
        const propsCheckArr = ["clinicId", "specialtyId", "address", "image"];
        const checkSpecialtyClinicData = checkData(specialtyClinicData, propsCheckArr);

        if (!checkSpecialtyClinicData) {
          return toast.error(
            "Your data return from the server in not enough. Please check your data and try again!"
          );
        }

        return setState({
          ...state,
          selectedClinic: clinicSelected,
          selectedSpecialty: specialtySelected,
          address: specialtyClinicData.address,
          image: specialtyClinicData.image,
          previewImageUrl: specialtyClinicData.image,
          isHaveInfo: true,
          action: "edit",
          oldSelectedClinic: specialtyClinicData.clinicId,

          bookingHTML: specialtyClinicData?.bookingHTML,
          bookingMarkdown: specialtyClinicData?.bookingMarkdown,
          introductionHTML: specialtyClinicData?.introductionHTML,
          introductionMarkdown: specialtyClinicData?.introductionMarkdown,
          examAndTreatmentHTML: specialtyClinicData?.examAndTreatmentHTML,
          examAndTreatmentMarkdown: specialtyClinicData?.examAndTreatmentMarkdown,
          strengthsHTML: specialtyClinicData?.strengthsHTML,
          strengthsMarkdown: specialtyClinicData?.strengthsMarkdown,
        });
      }

      const clinicSelected = findItemSelectedById(clinicArr, state.selectedClinic.value);
      const specialtySelected = findItemSelectedById(specialtyArr, state.selectedSpecialty.value);

      return setState({
        ...initialState,
        selectedClinic: selectedOption || clinicSelected,
        selectedSpecialty: specialtySelected,
        oldSelectedClinic: selectedOption?.value || clinicSelected.value,
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

  const handleOnChangeImage = async (e) => {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      const fileCovert = await toBase64(file);

      return setState({
        ...state,
        image: fileCovert,
        previewImageUrl: objectURL,
      });
    }
  };

  const handleOpenImagePreview = () => {
    if (!state.previewImageUrl) return;

    setState({ ...state, isOpenImagePreview: true });
  };

  const handleSaveDataClinic = async () => {
    try {
      const propsCheckArr = ["selectedClinic", "selectedSpecialty", "address"];
      const validate = checkData(state, propsCheckArr);
      if (!validate) throw new Error("Input data not enough");
      const dataSpecialty = {
        ...state,
        clinicId: state.selectedClinic.value,
        specialtyId: state.selectedSpecialty.value,
        action: state.action || "create",
      };
      const info = await dispatch(addSpecialtyForClinic(dataSpecialty));
      if (info?.payload?.status === "success") {
        toast.success("Specialty is added successfully!");
        setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCode("CLINIC"));
    dispatch(getAllCode("SPECIALTY"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (!state.previewImageUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image]);

  return (
    <div className="add-specialty-wrapper">
      <div className="add-specialty-content">
        <div className="add-specialty container">
          <div className="add-specialty__title text-center mt-4">{t("add-specialty-clinic.main-title")}</div>

          <div className="add-specialty-inputs">
            <h2 className="add-specialty-inputs__title mt-5">INPUTS</h2>
            <div className="row mt-3">
              <div className="col-4">
                <div className="title">
                  <h4>{t("add-specialty-clinic.add-specialty")}</h4>
                </div>

                <div className="select-specialties mt-3">
                  {specialtyArr?.length > 0 && (
                    <Select
                      value={state.selectedSpecialty}
                      onChange={(option) => {
                        handleInfos(option, "selectedSpecialty");
                        // handleStateSelectClinic(option);
                      }}
                      options={handleOptionClinic(specialtyArr)}
                      placeholder={t("add-specialty-clinic.placeholder-specialty")}
                    />
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="title">
                  <h4>{t("add-specialty-clinic.clinic")}</h4>
                </div>

                <div className="select-clinics mt-3">
                  {clinicArr?.length > 0 && (
                    <Select
                      value={state.selectedClinic}
                      onChange={(option) => {
                        handleInfos(option, "selectedClinic");
                        handleStateSelectClinic(option);
                      }}
                      options={handleOptionClinic(clinicArr)}
                      placeholder={t("add-specialty-clinic.placeholder-clinic")}
                    />
                  )}
                </div>
              </div>

              <Form.Group className="col-4" controlId="formAddress">
                <div className="title">
                  <h4>{t("add-specialty-clinic.address")}</h4>
                </div>
                <Form.Control
                  type="text"
                  value={state.address}
                  className="add-specialty-input__address"
                  onChange={(e, id) => handleInfos(e, "address")}
                />
              </Form.Group>
            </div>

            <div className="row">
              <div className="col-4 mt-5">
                <Form.Group className="form-group col-12 image-preview-container" controlId="formImage">
                  <label htmlFor="image" className="image-label">
                    {t("add-specialty-clinic.image")}
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
                      <FaUpload /> {t("add-specialty-clinic.button-upload")}
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

          <div className="add-specialty-markdowns">
            <h2 className="add-specialty-markdowns__title">MARKDOWNS</h2>

            <div className="add-specialty-markdowns__booking">
              <div className="label mb-3">
                <h4>{t("add-specialty-clinic.markdown-booking")}</h4>
              </div>

              <MdEditor
                value={state.bookingMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "booking")}
              />
            </div>

            <div className="add-specialty-markdowns__introduction mt-5">
              <div className="label mb-3">
                <h4>{t("add-specialty-clinic.markdown-introduction")}</h4>
              </div>

              <MdEditor
                value={state.introductionMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "introduction")}
              />
            </div>

            <div className="add-specialty-markdowns__examAndTreatment mt-5">
              <div className="label mb-3">
                <h4>{t("add-specialty-clinic.markdown-examAndTreatment")}</h4>
              </div>

              <MdEditor
                value={state.examAndTreatmentMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "examAndTreatment")}
              />
            </div>

            <div className="clinic-markdowns__strengths mt-5">
              <div className="label mb-3">
                <h4>{t("add-specialty-clinic.markdown-strengths")}</h4>
              </div>

              <MdEditor
                value={state.strengthsMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "strengths")}
              />
            </div>
          </div>

          <div className="add-specialty-button mt-5 text-end">
            <Button variant="primary" onClick={() => handleSaveDataClinic()}>
              {state.isHaveInfo
                ? `${t("add-specialty-clinic.button-update")}`
                : `${t("add-specialty-clinic.button-save")}`}
            </Button>
          </div>

          {state.isOpenImagePreview && (
            <Lightbox
              mainSrc={state.previewImageUrl}
              onCloseRequest={() => setState({ ...state, isOpenImagePreview: false })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicAddSpecialty;
