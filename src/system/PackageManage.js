import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCode } from "../slices/allcodeSlice";
import { getAllPackages, saveInfoPackage, getPackage, deletePackage } from "../slices/packageSlice";
import { checkData } from "../utils/helpers";
import { IoReload } from "react-icons/io5";
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
  selectedPrice: "",
  selectedProvince: "",
  selectedPayment: "",

  address: "",
  nameEn: "",
  nameVi: "",

  isHaveInfo: false,
  action: "",
  oldSelectedPackage: "",
};

const mdParser = new MarkdownIt();

const PackageManage = () => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { packageArr } = useSelector((store) => store.package);
  const { priceArr, paymentArr, provinceArr, specialtyArr, clinicArr } = useSelector(
    (store) => store.allcode
  );
  const nameEnRef = useRef(null);

  const handleInputs = (e, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    if (type.startsWith("selected")) {
      stateCopy[type] = e;
    } else {
      stateCopy[type] = e.target.value;
    }
    setState({ ...stateCopy });
  };

  const handleInfoOptions = (typeInfo, data) => {
    if (!data) return;

    const formatterPrice = new Intl.NumberFormat(`${language === "vi" ? "vi-VN" : "en-US"}`, {
      style: "currency",
      currency: `${language === "vi" ? "VND" : "USD"}`,
    });

    const objectOptions = data.map((item) => {
      let label;
      let value;
      if (typeInfo === "package") {
        label = language === "vi" ? `${item.nameVi}` : `${item.nameEn}`;
        value = item.id;
      } else if (
        typeInfo === "province" ||
        typeInfo === "payment" ||
        typeInfo === "specialty" ||
        typeInfo === "clinic"
      ) {
        label = language === "vi" ? `${item.valueVi}` : `${item.valueEn}`;
        value = item.keyMap;
      } else if (typeInfo === "price") {
        label =
          language === "vi"
            ? `${formatterPrice.format(item.valueVi)}`
            : `${formatterPrice.format(item.valueEn)}`;
        value = item.keyMap;
      }

      return { value, label };
    });
    return objectOptions;
  };

  const handleMarkdownChange = ({ html, text }, type) => {
    const stateCopy = JSON.parse(JSON.stringify({ ...state }));
    stateCopy[`${type}HTML`] = html;
    stateCopy[`${type}Markdown`] = text;
    return setState({ ...stateCopy });
  };

  const handleStateSelectPackage = async (selectedOption) => {
    try {
      const res = await dispatch(getPackage(selectedOption?.value || state.oldSelectedClinic));
      const findInfoBaseId = (typeInfo, array, typeInfoId) => {
        return handleInfoOptions(typeInfo, array).find((item) => item.value === typeInfoId);
      };
      const packageData = res.payload.data;
      const price = findInfoBaseId("price", priceArr, packageData?.priceId);
      const payment = findInfoBaseId("payment", paymentArr, packageData?.paymentId);
      const province = findInfoBaseId("province", provinceArr, packageData?.provinceId);
      const specialty = findInfoBaseId("specialty", specialtyArr, packageData?.specialtyId);
      const clinic = findInfoBaseId("clinic", clinicArr, packageData?.clinicId);
      const packageSelected = findInfoBaseId("package", packageArr, packageData?.id);

      return setState({
        ...state,
        contentHTML: packageData.contentHTML,
        contentMarkdown: packageData.contentMarkdown,
        introductionHTML: packageData.introductionHTML,
        introductionMarkdown: packageData.introductionMarkdown,
        listExaminationHTML: packageData?.listExaminationHTML,
        listExaminationMarkdown: packageData?.listExaminationMarkdown,

        selectedPackage: packageSelected,
        selectedClinic: clinic,
        selectedSpecialty: specialty,
        selectedPrice: price,
        selectedProvince: province,
        selectedPayment: payment,
        address: packageData.address ?? "",
        nameEn: packageData.nameEn ?? "",
        nameVi: packageData.nameVi ?? "",
        isHaveInfo: true,
        action: "edit",
        oldSelectedPackage: packageData.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDataPackage = async () => {
    try {
      let propsCheckArr = [];
      let info;
      if (!state.selectedPackage) {
        propsCheckArr = Object.keys(state).filter(
          (key) =>
            key !== "selectedPackage" &&
            key !== "selectedSpecialty" &&
            key !== "listExaminationHTML" &&
            key !== "listExaminationMarkdown" &&
            key !== "isHaveInfo" &&
            key !== "action" &&
            key !== "oldSelectedPackage"
        );
      } else {
        propsCheckArr = Object.keys(state).filter(
          (key) =>
            key !== "selectedSpecialty" &&
            key !== "listExaminationHTML" &&
            key !== "listExaminationMarkdown" &&
            key !== "oldSelectedPackage"
        );
      }
      const validate = checkData(state, propsCheckArr);
      if (!validate) throw new Error("Input data not enough");

      const packageInfo = {
        ...state,
        clinicId: state.selectedClinic.value,
        specialtyId: state.selectedSpecialty?.value,
        priceId: state.selectedPrice.value,
        provinceId: state.selectedProvince.value,
        paymentId: state.selectedPayment.value,
        action: state.action || "create",
      };

      if (state.selectedPackage) {
        info = await dispatch(saveInfoPackage({ ...packageInfo, id: state.selectedPackage.value }));
      } else {
        info = await dispatch(saveInfoPackage(packageInfo));
        await dispatch(getAllPackages());
      }

      if (info?.payload?.status === "success") {
        toast.success("Package's info is saved successfully!");
        setState({ ...initialState });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDeletePackage = async () => {
    try {
      if (!state.selectedPackage) throw new Error("Package is not selected");
      alert("Are you sure you want to delete?");

      const res = await dispatch(deletePackage(state.selectedPackage.value));
      if (res.payload === "") {
        toast.success("Doctor is deleted successfully!");
        await dispatch(getAllPackages());
        return setState({ ...initialState });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllCode("PRICE"));
    dispatch(getAllCode("PAYMENT"));
    dispatch(getAllCode("PROVINCE"));
    dispatch(getAllCode("SPECIALTY"));
    dispatch(getAllCode("CLINIC"));
    dispatch(getAllPackages());
    nameEnRef.current.focus();
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
              {packageArr.length > 0 ? (
                <Select
                  value={state.selectedPackage}
                  onChange={(option) => {
                    handleInputs(option, "selectedClinic");
                    handleStateSelectPackage(option);
                  }}
                  options={handleInfoOptions("package", packageArr)}
                  placeholder={t("package-manage.place-holder")}
                />
              ) : (
                <p>Chưa có gói khám bệnh nào được tạo</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="package-inputs mt-5">
        <h2 className="u-sub-title">INPUTS</h2>
        <div className="row mt-4">
          <Form.Group className="col-4" controlId="formNameEn">
            <h4 className="u-input-label">{t("package-manage.name-en")}</h4>

            <Form.Control
              ref={nameEnRef}
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
          <div className="col-4">
            <h4 className="u-input-label">{t("common.choose-price")}</h4>

            <div className="select-price mt-3">
              {priceArr && priceArr.length > 0 && (
                <Select
                  value={state.selectedPrice}
                  onChange={(option) => handleInputs(option, "selectedPrice")}
                  options={handleInfoOptions("price", priceArr)}
                  placeholder={t("common.placeholder-price")}
                />
              )}
            </div>
          </div>

          <div className="col-4">
            <h4 className="u-input-label">{t("common.choose-province")}</h4>

            <div className="select-province mt-3">
              {provinceArr && provinceArr.length > 0 && (
                <Select
                  value={state.selectedProvince}
                  onChange={(option) => handleInputs(option, "selectedProvince")}
                  options={handleInfoOptions("province", provinceArr)}
                  placeholder={t("common.placeholder-province")}
                />
              )}
            </div>
          </div>

          <div className="col-4">
            <h4 className="u-input-label">{t("common.choose-method-payment")}</h4>

            <div className="select-payment mt-3">
              {paymentArr && paymentArr.length > 0 && (
                <Select
                  value={state.selectedPayment}
                  onChange={(option) => handleInputs(option, "selectedPayment")}
                  options={handleInfoOptions("payment", paymentArr)}
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
              {clinicArr && clinicArr.length > 0 && (
                <Select
                  value={state.selectedClinic}
                  onChange={(option) => handleInputs(option, "selectedClinic")}
                  options={handleInfoOptions("clinic", clinicArr)}
                  placeholder={t("common.placeholder-clinic")}
                />
              )}
            </div>
          </div>

          <div className="col-6">
            <h4 className="u-input-label">{t("common.choose-specialty")}</h4>

            <div className="select-specialty mt-3">
              {specialtyArr && specialtyArr.length > 0 && (
                <Select
                  value={state.selectedSpecialty}
                  onChange={(option) => handleInputs(option, "selectedSpecialty")}
                  options={handleInfoOptions("specialty", specialtyArr)}
                  placeholder={t("common.placeholder-specialty")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="package-markdowns mt-5">
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
