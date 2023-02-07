import React, { useState, memo } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// import { MdLocationOn } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { GiMedicalPack } from "react-icons/gi";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { useFetchDataBaseId } from "../../utils/CustomHook";
import { getInfoAddressPriceClinic } from "../../slices/doctorSlice";
import { formatterPrice } from "../../utils/helpers";

import "../../styles/MedicalAddress.scss";

const MedicalAddress = ({ id, small, packageData, needAddress, assurance, remote }) => {
  const [state, setState] = useState({
    showPrice: false,
    showInsurance: false,
  });
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const moreInfo = useFetchDataBaseId(id, "moreInfoDoctor", getInfoAddressPriceClinic);

  const handleDisplayMoreInfo = (type) => {
    if (type === "price") {
      return setState({ ...state, showPrice: !state.showPrice });
    }

    if (type === "insurance") {
      return setState({ ...state, showInsurance: !state.showInsurance });
    }
  };

  const handleDisplayInterface = () => {
    let name;
    let address;
    let price;
    let priceEn;
    let payment;
    if (!_.isEmpty(packageData)) {
      address = packageData.address;
      name = language === "vi" ? packageData.clinicName?.valueVi : packageData.clinicName?.valueEn;
      price =
        language === "vi"
          ? formatterPrice(language).format(packageData.pricePackage.valueVi)
          : formatterPrice(language).format(packageData.pricePackage.valueEn);
      priceEn = packageData.pricePackage.valueEn;
      payment = language === "vi" ? packageData.paymentPackage?.valueVi : packageData.paymentPackage?.valueEn;
    } else {
      name = language === "vi" ? moreInfo.clinicData?.valueVi : moreInfo.clinicData?.valueEn;
      address = moreInfo?.addressClinic;
      price =
        language === "vi"
          ? formatterPrice(language).format(moreInfo.priceData?.valueVi)
          : formatterPrice(language).format(moreInfo.priceData?.valueEn);
      priceEn = moreInfo?.priceData?.valueEn;
      payment = language === "vi" ? moreInfo.paymentData?.valueVi : moreInfo.paymentData?.valueEn;
    }
    return {
      name,
      address,
      price,
      priceEn,
      payment,
    };
  };

  return (
    <>
      <div
        className={`${small ? "small" : "col-4"} medical-address`}
        style={{ paddingTop: `${needAddress}` ? "0px" : "1rem" }}
      >
        <div className="medical-address-content">
          {needAddress && !remote && (
            <div className="clinic-info">
              <div className="col-12 title">
                <FaMapMarkedAlt />
                <span>{t("detail-doctor.address-exam")}</span>
              </div>
              <h4 className="clinic-name">{handleDisplayInterface().name}</h4>
              <p className="clinic-address">{handleDisplayInterface().address}</p>
            </div>
          )}
          <div className="medical-price-wrapper">
            <div className="medical-price">
              <div className="title">
                <IoMdPricetag />
                <span>{t("detail-doctor.price")}: </span>
                <span className="price">{state.showPrice ? "" : handleDisplayInterface().price}</span>
              </div>
              <button className="medical-price-button" onClick={() => handleDisplayMoreInfo("price")}>
                {state.showPrice ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
              </button>
            </div>

            <div
              className={`${
                state.showPrice ? "more-info more-info-price open" : "more-info more-info-price"
              }`}
            >
              <div style={{ padding: "1.2rem 1.8rem" }}>
                <div className="info-top">
                  <h5 className="heading">
                    {t("detail-doctor.price")}
                    <span>{handleDisplayInterface().price}</span>
                  </h5>
                  <p className="info-top-note">
                    {t("detail-doctor.price-note")} <span>{`$${handleDisplayInterface().priceEn}`}</span>
                  </p>
                </div>

                <div className="info-bottom">
                  <h5 className="heading">
                    {t("detail-doctor.payment-method")}
                    <span>{handleDisplayInterface().payment}</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {assurance && (
            <div className="medical-insurance-wrapper">
              <div className="medical-insurance">
                <div className="title">
                  <GiMedicalPack />
                  <span>{t("detail-doctor.insurance")}</span>
                </div>
                <button
                  className="medical-insurance-button"
                  onClick={() => handleDisplayMoreInfo("insurance")}
                >
                  {state.showInsurance ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
                </button>
              </div>

              <div
                className={`${
                  state.showInsurance ? "more-info more-info-insurance open" : "more-info more-info-insurance"
                }`}
              >
                <div style={{ padding: "1.2rem 1.8rem" }}>
                  <div className="info-top">
                    <h5 className="heading">{t("detail-doctor.state-insurance")}</h5>
                    <p className="info-top-note">{t("detail-doctor.not-apply")}</p>
                  </div>

                  <div className="info-bottom">
                    <h5 className="heading">{t("detail-doctor.direct-insurance")}</h5>

                    <p className="info-bottom-note">{t("detail-doctor.not-apply")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(MedicalAddress);
