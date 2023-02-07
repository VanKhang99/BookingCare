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
import { getAllPackages, saveInfoPackage, getPackage } from "../slices/packageSlice";
import { checkData } from "../utils/helpers";
import "react-markdown-editor-lite/lib/index.css";
import "./styles/PackageManage.scss";

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
  // const { t } = useTranslation();
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
    <div className="package-manage-wrapper">
      <div className="package-manage-content">
        <div className="package-manage container">
          <div className="package-manage__title text-center mt-3 text-uppercase">
            Quản lý thông tin gói khám bệnh
          </div>

          <div className="package-created">
            <h2 className="package-created__title">PACKAGES CREATED</h2>

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
                      placeholder="Chọn gói khám bệnh"
                    />
                  ) : (
                    <p>Chưa có gói khám bệnh nào được tạo</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="package-inputs">
            <h2 className="package-inputs__title">INPUTS</h2>
            <div className="row mt-4">
              <Form.Group className="col-4" controlId="formNameEn">
                <div className="label">
                  <h4>Tên tiếng Anh</h4>
                </div>
                <Form.Control
                  ref={nameEnRef}
                  type="text"
                  value={state.nameEn}
                  className="package-inputs__input"
                  onChange={(e, id) => handleInputs(e, "nameEn")}
                />
              </Form.Group>

              <Form.Group className="col-4" controlId="formNameVi">
                <div className="label">
                  <h4>Tên tiếng Việt</h4>
                </div>
                <Form.Control
                  type="text"
                  value={state.nameVi}
                  className="package-inputs__input"
                  onChange={(e, id) => handleInputs(e, "nameVi")}
                />
              </Form.Group>

              <Form.Group className="col-4" controlId="formAddress">
                <div className="label">
                  <h4>Địa chỉ</h4>
                </div>
                <Form.Control
                  type="text"
                  value={state.address}
                  className="package-inputs__input"
                  onChange={(e, id) => handleInputs(e, "address")}
                />
              </Form.Group>
            </div>

            <div className="row mt-5">
              <div className="col-4">
                <div className="label">
                  <h4>Giá khám bệnh</h4>
                </div>

                <div className="select-price mt-3">
                  {priceArr && priceArr.length > 0 && (
                    <Select
                      value={state.selectedPrice}
                      onChange={(option) => handleInputs(option, "selectedPrice")}
                      options={handleInfoOptions("price", priceArr)}
                      placeholder="Chọn giá khám bệnh"
                    />
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="label">
                  <h4>Thành phố (Tỉnh)</h4>
                </div>

                <div className="select-province mt-3">
                  {provinceArr && provinceArr.length > 0 && (
                    <Select
                      value={state.selectedProvince}
                      onChange={(option) => handleInputs(option, "selectedProvince")}
                      options={handleInfoOptions("province", provinceArr)}
                      placeholder="Chọn thành phố (tỉnh)"
                    />
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="label">
                  <h4>Phương thức thanh toán</h4>
                </div>

                <div className="select-payment mt-3">
                  {paymentArr && paymentArr.length > 0 && (
                    <Select
                      value={state.selectedPayment}
                      onChange={(option) => handleInputs(option, "selectedPayment")}
                      options={handleInfoOptions("payment", paymentArr)}
                      placeholder="Chọn phương thức thanh toán"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-6">
                <div className="label">
                  <h4>Bệnh viện - Phòng khám</h4>
                </div>

                <div className="select-clinic mt-3">
                  {clinicArr && clinicArr.length > 0 && (
                    <Select
                      value={state.selectedClinic}
                      onChange={(option) => handleInputs(option, "selectedClinic")}
                      options={handleInfoOptions("clinic", clinicArr)}
                      placeholder="Chọn bệnh viện - phòng khám"
                    />
                  )}
                </div>
              </div>

              <div className="col-6">
                <div className="label">
                  <h4>Chuyên khoa</h4>
                </div>

                <div className="select-specialty mt-3">
                  {specialtyArr && specialtyArr.length > 0 && (
                    <Select
                      value={state.selectedSpecialty}
                      onChange={(option) => handleInputs(option, "selectedSpecialty")}
                      options={handleInfoOptions("specialty", specialtyArr)}
                      placeholder="Chọn chuyên khoa"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="package-markdowns">
            <h2 className="package-markdowns__title">MARKDOWN EDITOR</h2>
            <div className="package-markdowns__introduction">
              <div className="label mb-3">
                <h4>Giới thiệu</h4>
              </div>

              <MdEditor
                value={state.introductionMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "introduction")}
              />
            </div>

            <div className="package-markdowns__content  mt-5">
              <div className="label mb-3">
                <h4>Nội dung gói khám</h4>
              </div>

              <MdEditor
                value={state.contentMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "content")}
              />
            </div>

            <div className="package-markdowns__listExamination  mt-5">
              <div className="label mb-3">
                <h4>Đề mục cần khám</h4>
              </div>

              <MdEditor
                value={state.listExaminationMarkdown}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(value) => handleMarkdownChange(value, "listExamination")}
              />
            </div>
          </div>

          <div className="package-button mt-5 text-end">
            <Button variant="primary" onClick={() => handleSaveDataPackage()}>
              Lưu thông tin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageManage;
