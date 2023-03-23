import React, { useState, useEffect } from "react";
import _ from "lodash";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Radio, Select as SelectAntd, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCodes } from "../slices/allcodeSlice";
import { getAllPackages, saveInfoPackage, getPackage, deletePackage } from "../slices/packageSlice";
import { getAllCategories } from "../slices/categorySlice";
import { getAllClinics } from "../slices/clinicSlice";
import { getAllSpecialties } from "../slices/specialtySlice";
import { checkData, formatterPrice, postImageToS3, deleteImageOnS3 } from "../utils/helpers";
import { IoReload } from "react-icons/io5";
import { FaUpload } from "react-icons/fa";
import "./styles/PackageManage.scss";
import "react-markdown-editor-lite/lib/index.css";

const initialState = {
  introductionHTML: "",
  introductionMarkdown: "",
  contentHTML: "",
  contentMarkdown: "",
  listExaminationHTML: "",
  listExaminationMarkdown: "",

  selectedPackage: "",
  selectedClinic: "",
  selectedSpecialty: "",
  selectedProvince: "",
  selectedPayment: "",
  selectedCategory: [],

  price: "",
  address: "",
  nameEn: "",
  nameVi: "",
  popular: false,
  image: "",
  fileImage: "",
  previewImageUrl: "",
  isOpenImagePreview: false,

  isHaveInfo: false,
  action: "create",
  oldSelectedPackage: "",

  test: [],
};

const mdParser = new MarkdownIt();

const PackageManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { packageArr } = useSelector((store) => store.package);
  const { paymentArr, provinceArr } = useSelector((store) => store.allcode);
  const { clinics } = useSelector((store) => store.clinic);
  const { specialties } = useSelector((store) => store.specialty);
  const { categories } = useSelector((store) => store.category);

  const handleInputs = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleOption = (typeInfo, data) => {
    if (!data) return;

    const objectOptions = data.map((item) => {
      let label;
      let value;
      if (
        typeInfo === "package" ||
        typeInfo === "specialty" ||
        typeInfo === "clinic" ||
        typeInfo === "category"
      ) {
        label = language === "vi" ? `${item.nameVi}` : `${item.nameEn}`;
        value = item.id;
      } else if (typeInfo === "province" || typeInfo === "payment") {
        label = language === "vi" ? `${item.valueVi}` : `${item.valueEn}`;
        value = item.keyMap;
      }

      return { value, label };
    });
    return objectOptions;
  };

  const handleOnChangeImage = async (e) => {
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
    if (!state[`preview${type}Url`]) return;

    setState({ ...state, [`isOpen${type}Preview`]: true });
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    return setState({ ...state, [`${type}HTML`]: html, [`${type}Markdown`]: text });
  };

  const handleCheckRadio = (e, type) => {
    return setState({ ...state, [type]: e.target.value });
  };

  const findItemSelectedById = (type, arr, id) => {
    return handleOption(type, arr).find((item) => item.value === id);
  };

  const handleSaveDataPackage = async () => {
    try {
      const propsCheckArr = [
        "nameEn",
        "nameVi",
        "popular",
        "address",
        "selectedProvince",
        "selectedPayment",
        "selectedClinic",
      ];

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

      const packageInfo = {
        ...state,
        clinicId: state.selectedClinic.value,
        specialtyId: state.selectedSpecialty?.value,
        provinceId: state.selectedProvince.value,
        paymentId: state.selectedPayment.value,
        categoryId: state.selectedCategory.join(", "),
        image: imageUploadToS3?.data?.data?.image,
        ...(state.action === "edit" && { id: state.selectedPackage?.value }),
        action: state.action || "create",
      };

      const res = await dispatch(saveInfoPackage(packageInfo));

      if (res?.payload?.status === "success") {
        toast.success("Package's info is saved successfully!");
        await dispatch(getAllPackages({ clinicId: null, specialId: null, getAll: true }));
        setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdatePackage = async (selectedOption) => {
    try {
      const res = await dispatch(getPackage(selectedOption?.value || state.oldSelectedClinic));
      if (_.isEmpty(res.payload.data)) return toast.error("Get data package failed!!!");
      const packageData = res.payload.data;
      console.log(packageData);
      const packageSelected = findItemSelectedById("package", packageArr, +packageData.id);
      const specialtyInDB = findItemSelectedById("specialty", specialties, +packageData?.specialtyId);
      const clinicInDB = findItemSelectedById("clinic", clinics, packageData.clinicId);
      const paymentInDB = findItemSelectedById("payment", paymentArr, packageData.paymentPackage.keyMap);
      const provinceInDB = findItemSelectedById("province", provinceArr, packageData.provincePackage.keyMap);
      const packageTypeInDB = !packageData.categoryId
        ? []
        : handleOption("category", categories).filter((cate) => {
            return packageData.categoryId
              .split(", ")
              .map((id) => +id)
              .includes(cate.value);
          });

      return setState({
        ...state,
        selectedPackage: packageSelected,
        selectedCategory: packageTypeInDB ?? [],
        selectedSpecialty: specialtyInDB ?? "",
        selectedClinic: clinicInDB,
        selectedPayment: paymentInDB,
        selectedProvince: provinceInDB,
        image: state.image,
        previewImageUrl: packageData.imageUrl,
        isHaveInfo: true,
        action: "edit",
        oldSelectedPackage: packageData.id,
        ...packageData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePackage = async () => {
    try {
      if (!state.selectedPackage) throw new Error("Package is not selected");
      alert("Are you sure you want to delete?");

      await deleteImageOnS3(state.image);

      const res = await dispatch(deletePackage(state.selectedPackage.value));
      if (res.payload === "") {
        toast.success("Package is deleted successfully!");
        await dispatch(getAllPackages({ clinicId: null, specialId: null, getAll: true }));
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectMultipleCategory = (value) => {
    setState({ ...state, selectedCategory: value });
  };

  useEffect(() => {
    dispatch(getAllCodes("PAYMENT"));
    dispatch(getAllCodes("PROVINCE"));
    dispatch(getAllSpecialties("all"));
    dispatch(getAllClinics("all"));
    dispatch(getAllCategories());
    dispatch(getAllPackages({ clinicId: null, specialId: null, getAll: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="package-manage container">
      <div className="u-main-title text-center mt-3 text-uppercase">{t("package-manage.main-title")}</div>

      <div className="package-created mt-5">
        <h2 className="u-sub-title d-flex justify-content-between">
          {t("package-manage.package-create")}
          <button className="u-system-button--refresh-data" onClick={() => setState({ ...initialState })}>
            <IoReload />
          </button>
        </h2>

        <div className="row mt-4">
          <div className="col-4">
            <div className="select-packages">
              {packageArr?.length > 0 ? (
                <Select
                  value={state.selectedPackage}
                  onChange={(option) => {
                    handleInputs(option, "selectedClinic");
                    handleUpdatePackage(option);
                  }}
                  options={handleOption("package", packageArr)}
                  placeholder={t("package-manage.place-holder")}
                />
              ) : (
                <p>Chưa có gói khám bệnh nào được tạo</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="package-manage-inputs mt-5">
        <h2 className="u-sub-title">INPUTS</h2>
        <div className="row mt-4">
          <Form.Group className="col-4" controlId="formNameEn">
            <h4 className="u-input-label">{t("package-manage.name-en")}</h4>

            <Form.Control
              type="text"
              value={state.nameEn}
              className="u-input"
              onChange={(e, id) => handleInputs(e, "nameEn")}
            />
          </Form.Group>

          <Form.Group className="col-4" controlId="formNameVi">
            <h4 className="u-input-label">{t("package-manage.name-vi")}</h4>

            <Form.Control
              type="text"
              value={state.nameVi}
              className="u-input"
              onChange={(e, id) => handleInputs(e, "nameVi")}
            />
          </Form.Group>

          <Form.Group className="col-4" controlId="formAddress">
            <h4 className="u-input-label">{t("package-manage.address")}</h4>

            <Form.Control
              type="text"
              value={state.address}
              className="u-input"
              onChange={(e, id) => handleInputs(e, "address")}
            />
          </Form.Group>
        </div>

        <div className="row mt-5">
          <Form.Group className="col-4" controlId="formPrice">
            <h4 className="u-input-label">{t("common.choose-price")}</h4>

            <Form.Control
              type="text"
              value={state.price}
              className="u-input mt-3"
              onChange={(e, id) => handleInputs(e, "price")}
            />
          </Form.Group>

          <div className="col-4">
            <h4 className="u-input-label">{t("common.choose-province")}</h4>

            <div className="select-province mt-3">
              {provinceArr?.length > 0 && (
                <Select
                  value={state.selectedProvince}
                  onChange={(option) => handleInputs(option, "selectedProvince")}
                  options={handleOption("province", provinceArr)}
                  placeholder={t("common.placeholder-province")}
                />
              )}
            </div>
          </div>

          <div className="col-4">
            <h4 className="u-input-label">{t("common.choose-method-payment")}</h4>

            <div className="select-payment mt-3">
              {paymentArr?.length > 0 && (
                <Select
                  value={state.selectedPayment}
                  onChange={(option) => handleInputs(option, "selectedPayment")}
                  options={handleOption("payment", paymentArr)}
                  placeholder={t("common.placeholder-payment")}
                />
              )}
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-6">
            <h4 className="u-input-label">{t("common.choose-clinic")}</h4>

            <div className="select-clinic mt-3">
              {clinics?.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => handleInputs(option, "selectedClinic")}
                  options={handleOption("clinic", clinics)}
                  placeholder={t("common.placeholder-clinic")}
                />
              )}
            </div>
          </div>

          <div className="col-6">
            <h4 className="u-input-label">{t("common.choose-specialty")}</h4>

            <div className="select-specialty mt-3">
              {specialties?.length > 0 && (
                <Select
                  value={state.selectedSpecialty}
                  onChange={(option) => handleInputs(option, "selectedSpecialty")}
                  options={handleOption("specialty", specialties)}
                  placeholder={t("common.placeholder-specialty")}
                />
              )}
            </div>
          </div>

          {/* <div className="col-4">
            <h4 className="u-input-label mb-3">{t("package-manage.category")}</h4>

            <div className="select-specialty mt-3">
              {categories?.length > 0 && (
                <Select
                  value={state.selectedCategory}
                  onChange={(option) => handleInputs(option, "selectedCategory")}
                  options={handleOption("category", categories)}
                  placeholder={t("package-manage.place-holder-package-type")}
                />
              )}
            </div>
          </div> */}
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h4 className="u-input-label mb-3">{t("package-manage.category")}</h4>

            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              <SelectAntd
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                // defaultValue={["a10", "c12"]}
                value={state.selectedCategory}
                onChange={handleSelectMultipleCategory}
                options={handleOption("category", categories)}
              />
            </Space>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-4">
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
          <div className="col-4">
            <h4 className="u-input-label">{t("common.outstanding")}</h4>

            <Radio.Group onChange={(e) => handleCheckRadio(e, "popular")} value={state.popular}>
              <Radio value={false}>{language === "vi" ? "Không phổ biến" : "Unpopular"}</Radio>
              <Radio value={true}>{language === "vi" ? "Phổ biến" : "Popular"}</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>

      <div className="package-manage-markdowns mt-5">
        <h2 className="u-sub-title">MARKDOWN EDITOR</h2>
        <div className="package-markdown mt-3">
          <h4 className="u-input-label">{t("package-manage.markdown-introduction")}</h4>

          <MdEditor
            value={state.introductionMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "introduction")}
          />
        </div>

        <div className="package-markdown  mt-5">
          <h4 className="u-input-label">{t("package-manage.markdown-package-content")}</h4>

          <MdEditor
            value={state.contentMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "content")}
          />
        </div>

        <div className="package-markdown  mt-5">
          <h4 className="u-input-label">{t("package-manage.markdown-package-list-exam")}</h4>

          <MdEditor
            value={state.listExaminationMarkdown}
            style={{ height: "400px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(value) => handleMarkdownChange(value, "listExamination")}
          />
        </div>
      </div>

      <div className="u-system-button my-5 d-flex gap-3 justify-content-end">
        <Button variant="danger" onClick={() => handleDeletePackage()}>
          {t("button.delete")}
        </Button>

        <Button variant="primary" onClick={() => handleSaveDataPackage()}>
          {state.isHaveInfo ? t("button.update") : t("button.create")}
        </Button>
      </div>
    </div>
  );
};

export default PackageManage;
