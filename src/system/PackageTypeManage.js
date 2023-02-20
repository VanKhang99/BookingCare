import React, { useState, useEffect } from "react";
import _ from "lodash";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Lightbox from "react-image-lightbox";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toBase64 } from "../utils/helpers";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { checkData } from "../utils/helpers";
import {
  saveInfoPackageType,
  getAllPackagesType,
  getPackageType,
  deletePackageType,
} from "../slices/packageTypeSlice";
import "react-image-lightbox/style.css";
import "./styles/PackageTypeManage.scss";

const initialState = {
  typesCreated: [],
  selectedType: "",

  typeEn: "",
  typeVi: "",
  image: "",
  previewImageUrl: "",
  isOpenImagePreview: false,

  isHaveInfo: false,
  action: "",
  oldSelectedType: "",
};

const PackageTypeManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { packagesType } = useSelector((store) => store.packageType);

  const handleInputs = (e, typeInput) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (typeInput.startsWith("selected")) {
      stateCopy[typeInput] = e;
    } else {
      stateCopy[typeInput] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleInfoOptions = (data) => {
    if (!data) return;

    const objectOptions = data.map((item) => {
      const label = language === "vi" ? `${item.typeVi}` : `${item.typeEn}`;
      const value = item.id;

      return { label, value };
    });

    return objectOptions;
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

  const handleSaveData = async () => {
    try {
      let propsCheckArr = [];
      if (!state.selectedType) {
        propsCheckArr = ["image", "typeEn", "typeVi"];
      } else {
        propsCheckArr = ["selectedType", "typeEn", "typeVi", "image"];
      }
      const validate = checkData(state, propsCheckArr);
      if (!validate) throw new Error("Input data not enough");

      const packageTypeInfo = {
        ...state,
        id: state.selectedType?.value,
        action: state.action || "create",
        table: "package-type",
      };

      const info = await dispatch(saveInfoPackageType(packageTypeInfo));

      if (info?.payload?.status === "success") {
        toast.success("Package type is saved successfully!");
        await dispatch(getAllPackagesType());
        return setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdatePackageType = async (selectedOption) => {
    try {
      const res = await dispatch(getPackageType(selectedOption?.value || state.oldSelectedClinic));
      const packageTypeData = res.payload.data.data;
      const packageTypeSelected = handleInfoOptions(packagesType).find(
        (item) => item.value === packageTypeData.id
      );

      return setState({
        ...state,
        selectedType: packageTypeSelected,
        typeEn: packageTypeData.typeEn ?? "",
        typeVi: packageTypeData.typeVi ?? "",
        image: packageTypeData.image,
        previewImageUrl: packageTypeData.image,
        isHaveInfo: true,
        action: "edit",
        oldSelectedPackage: packageTypeData.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePackageType = async () => {
    try {
      if (!state.selectedType) throw new Error("Package type is not selected");
      alert("Are you sure you want to delete?");

      const res = await dispatch(deletePackageType(state.selectedType.value));
      if (res.payload === "") {
        toast.success("Package type is deleted successfully!");
        await dispatch(getAllPackagesType());
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllPackagesType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesType.length]);

  useEffect(() => {
    if (!state.previewImageUrl) return;
    return () => {
      URL.revokeObjectURL(state.previewImageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.image]);

  return (
    <div className="package-type container">
      <div className="u-main-title mt-3">{t("package-type-manage.main-title")}</div>

      <div className="package-type-content">
        <div className="package-type-created">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6 col-sm-12">
              <h2 className="u-sub-title mt-5 d-flex justify-content-between">
                TYPES CREATED
                <button
                  className="u-system-button--refresh-data"
                  onClick={() => setState({ ...initialState })}
                >
                  <IoReload />
                </button>
              </h2>
              {packagesType.length > 0 ? (
                <Select
                  value={state.selectedType}
                  onChange={(option) => {
                    handleInputs(option, "selectedType");
                    handleUpdatePackageType(option);
                  }}
                  options={handleInfoOptions(packagesType)}
                  placeholder={t("package-type-manage.place-holder")}
                />
              ) : (
                <p>Chưa có loại gói khám nào được tạo</p>
              )}
            </div>
          </div>
        </div>

        <div className="package-type-inputs">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6 col-sm-12">
              <h2 className="u-sub-title mt-5">INPUTS</h2>
              <Form.Group className="" controlId="formTypeVi">
                <h4 className="u-input-label">{t("package-type-manage.type-vi")}</h4>
                <Form.Control
                  type="text"
                  value={state.typeVi}
                  className="u-input"
                  onChange={(e, id) => handleInputs(e, "typeVi")}
                />
              </Form.Group>

              <Form.Group className="mt-5" controlId="formTypeEn">
                <h4 className="u-input-label">{t("package-type-manage.type-eng")}</h4>
                <Form.Control
                  type="text"
                  value={state.typeEn}
                  className="u-input"
                  onChange={(e, id) => handleInputs(e, "typeEn")}
                />
              </Form.Group>

              <Form.Group className="form-group mt-5 image-preview-container" controlId="formImage">
                <label htmlFor="image" className="u-input-label">
                  {t("package-type-manage.image")}
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
          </div>
        </div>

        <div className="package-type-buttons mt-5">
          <div className="row justify-content-center gx-4">
            <div className="col-sm-12 col-lg-6 col-12 text-end">
              <div className="u-system-button">
                <Button className="me-4" variant="danger" onClick={() => handleDeletePackageType()}>
                  {t("button.delete")}
                </Button>
                <Button variant="primary" onClick={() => handleSaveData()}>
                  {state.isHaveInfo ? `${t("button.update")}` : `${t("button.create")}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
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

export default PackageTypeManage;
