import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Lightbox from "react-image-lightbox";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaUpload } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { checkData, postImageToS3, deleteImageOnS3 } from "../utils/helpers";
import { saveInfoCategory, getAllCategories, getCategory, deleteCategory } from "../slices/categorySlice";
import "react-image-lightbox/style.css";
import "./styles/CategoryManage.scss";

const initialState = {
  typesCreated: [],
  selectedType: "",

  nameEn: "",
  nameVi: "",
  image: "",
  fileImage: "",
  previewImageUrl: "",
  isOpenImagePreview: false,

  isHaveInfo: false,
  action: "",
  oldSelectedType: "",
};

const CategoryManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { categories } = useSelector((store) => store.category);

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
      const label = language === "vi" ? `${item.nameVi}` : `${item.nameEn}`;
      const value = item.id;

      return { label, value };
    });

    return objectOptions;
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

  const handleOpenImagePreview = (type) => {
    if (!state[`preview${type === "Image" ? "Image" : "Logo"}Url`]) return;

    setState({ ...state, [`isOpen${type === "Image" ? "Image" : "Logo"}Preview`]: true });
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    try {
      const propsCheckArr = ["nameEn", "nameVi", "image"];
      const validate = checkData(state, propsCheckArr);
      if (!validate) return toast.error("Please fill in all information before saving");

      // upLoad file image to aws s3 bucket
      let imageUploadToS3;
      if (typeof state.fileImage !== "string") {
        if (state.action === "edit") {
          // Delete old image before update new image
          await deleteImageOnS3(state.image);
        }

        // update new image
        imageUploadToS3 = await postImageToS3(state.fileImage);
      }

      //Save image to db
      const packageTypeInfo = {
        id: state.selectedType?.value,
        nameEn: state.nameEn,
        nameVi: state.nameVi,
        image: imageUploadToS3?.data?.data?.image,
        action: state.action || "create",
        table: "package-type",
      };
      const info = await dispatch(saveInfoCategory(packageTypeInfo));

      if (info?.payload?.status === "success") {
        toast.success("Package type is saved successfully!");
        await dispatch(getAllCategories());
      }
      return setState({ ...initialState });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdatePackageType = async (selectedOption) => {
    try {
      const res = await dispatch(getCategory(selectedOption?.value || state.oldSelectedClinic));
      const packageTypeData = res.payload.data.data;
      const packageTypeSelected = handleInfoOptions(categories).find(
        (item) => item.value === packageTypeData.id
      );

      return setState({
        ...state,
        selectedType: packageTypeSelected,
        nameEn: packageTypeData.nameEn ?? "",
        nameVi: packageTypeData.nameVi ?? "",
        image: packageTypeData.image,
        previewImageUrl: packageTypeData.imageUrl,
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
      if (!state.selectedType) return toast.error("Package type is not selected");
      alert("Are you sure you want to delete?");

      await deleteImageOnS3(state.image);

      const res = await dispatch(deleteCategory(state.selectedType.value));
      if (res.payload === "") {
        toast.success("Package type is deleted successfully!");
        await dispatch(getAllCategories());
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

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
              <h2 className="u-sub-title mt-5 mb-3 d-flex justify-content-between align-items-center">
                TYPES CREATED
                <button
                  className="u-system-button--refresh-data"
                  onClick={() => setState({ ...initialState })}
                >
                  <IoReload />
                </button>
              </h2>
              {categories.length > 0 ? (
                <Select
                  value={state.selectedType}
                  onChange={(option) => {
                    handleInputs(option, "selectedType");
                    handleUpdatePackageType(option);
                  }}
                  options={handleInfoOptions(categories)}
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
              <Form onSubmit={handleSaveData}>
                <Form.Group className="" controlId="formTypeVi">
                  <h4 className="u-input-label">{t("package-type-manage.type-vi")}</h4>
                  <Form.Control
                    type="text"
                    value={state.nameVi}
                    className="u-input"
                    onChange={(e, id) => handleInputs(e, "nameVi")}
                  />
                </Form.Group>

                <Form.Group className="mt-5" controlId="formTypeEn">
                  <h4 className="u-input-label">{t("package-type-manage.type-eng")}</h4>
                  <Form.Control
                    type="text"
                    value={state.nameEn}
                    className="u-input"
                    onChange={(e, id) => handleInputs(e, "nameEn")}
                  />
                </Form.Group>

                <Form.Group className="form-group mt-5 image-preview-container" controlId="formImage">
                  <label htmlFor="image" className="u-input-label">
                    {t("package-type-manage.image")}
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="uploaded_file"
                    accept="image/*"
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

                <div className="u-system-button text-end my-4">
                  <Button className="me-4" variant="danger" onClick={() => handleDeletePackageType()}>
                    {t("button.delete")}
                  </Button>
                  <Button variant="primary" type="submit">
                    {state.isHaveInfo ? `${t("button.update")}` : `${t("button.create")}`}
                  </Button>
                </div>
              </Form>
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

export default CategoryManage;
