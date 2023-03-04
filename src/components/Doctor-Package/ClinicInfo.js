import React, { useState, memo } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { GiMedicalPack } from "react-icons/gi";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import { formatterPrice } from "../../utils/helpers";

import "../../styles/ClinicInfo.scss";

const ClinicInfo = ({
  doctorData,
  id,
  small,
  packageData,
  needAddress,
  assurance,
  remote,
  packageOfClinic,
}) => {
  const [state, setState] = useState({
    showPrice: false,
    showInsurance: false,
  });
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleDisplayMoreInfo = (type) => {
    return setState({ ...state, [`show${type}`]: !state[`show${type}`] });
  };

  const handleDisplayInterface = () => {
    let name;
    let address;
    let price;
    let priceEn;
    let payment;
    if (!_.isEmpty(packageData)) {
      const { pricePackage, paymentPackage, specialty, clinicData } = packageData;
      address = packageData.address;
      if (packageOfClinic) {
        name = language === "vi" ? `${clinicData.nameVi}` : `${clinicData.nameEn}`;
      } else {
        name =
          language === "vi"
            ? `${specialty.nameVi} - ${clinicData.nameVi}`
            : `${specialty.nameEn} - ${clinicData.nameEn}`;
      }
      price =
        language === "vi"
          ? formatterPrice(language).format(pricePackage.valueVi)
          : formatterPrice(language).format(pricePackage.valueEn);
      priceEn = pricePackage.valueEn;
      payment = language === "vi" ? paymentPackage?.valueVi : paymentPackage?.valueEn;
    }

    if (!_.isEmpty(doctorData)) {
      const {
        moreData: { clinic, paymentData, priceData },
      } = doctorData;
      name = language === "vi" ? clinic.nameVi : clinic.nameEn;
      address = clinic.address;
      price =
        language === "vi"
          ? formatterPrice(language).format(priceData.valueVi)
          : formatterPrice(language).format(priceData.valueEn);
      priceEn = priceData.valueEn;
      payment = language === "vi" ? paymentData.valueVi : paymentData.valueEn;
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
        className={`${small ? "small" : "col-4"} clinic-info-container`}
        style={{ paddingTop: `${needAddress}` ? "0px" : "1rem" }}
      >
        <div className="clinic-info">
          {needAddress && !remote && (
            <div className="clinic-info-address">
              <div className="col-12 clinic-info-address__title">
                <FaMapMarkedAlt />
                <span>{t("detail-doctor.address-exam")}</span>
              </div>
              <h4 className="clinic-info-address__name">{handleDisplayInterface().name}</h4>
              <p className="clinic-info-address__address">{handleDisplayInterface().address}</p>
            </div>
          )}
          <div className="clinic-info-price-wrapper">
            <div className="clinic-info-price">
              <div className="clinic-info-price__title">
                <IoMdPricetag />
                <span>{t("detail-doctor.price")}: </span>
                <span className="clinic-info-price__price">
                  {state.showPrice ? "" : handleDisplayInterface().price}
                </span>
              </div>
              <button className="clinic-info-price__button" onClick={() => handleDisplayMoreInfo("Price")}>
                {state.showPrice ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
              </button>
            </div>

            <div
              className={`${
                state.showPrice ? "more-info more-info--price open" : "more-info more-info-price"
              }`}
            >
              <div style={{ padding: "1.2rem 1.8rem" }}>
                <div className="more-info-top">
                  <h5 className="more-info-top__heading">
                    {t("detail-doctor.price")}
                    <span>{handleDisplayInterface().price}</span>
                  </h5>
                  <p className="more-info-top__note">
                    {t("detail-doctor.price-note")} <span>{`$${handleDisplayInterface().priceEn}`}</span>
                  </p>
                </div>

                <div className="more-info-bottom">
                  <h5 className="more-info-bottom__heading">
                    {t("detail-doctor.payment-method")}
                    <span>{handleDisplayInterface().payment}</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {assurance && !remote && (
            <div className="clinic-info-insurance-wrapper">
              <div className="clinic-info-insurance">
                <div className="clinic-info-insurance__title">
                  <GiMedicalPack />
                  <span>{t("detail-doctor.insurance")}</span>
                </div>
                <button
                  className="clinic-info-insurance__button"
                  onClick={() => handleDisplayMoreInfo("Insurance")}
                >
                  {state.showInsurance ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
                </button>
              </div>

              <div
                className={
                  state.showInsurance
                    ? "more-info more-info--insurance open"
                    : "more-info more-info-insurance"
                }
              >
                <div style={{ padding: "1.2rem 1.8rem" }}>
                  <div className="more-info-top">
                    <h5 className="more-info-top__heading">{t("detail-doctor.state-insurance")}</h5>
                    <p className="more-info-top__note">{t("detail-doctor.not-apply")}</p>
                  </div>

                  <div className="more-info-bottom">
                    <h5 className="more-info-bottom__heading">{t("detail-doctor.direct-insurance")}</h5>

                    <p className="more-info-bottom__note">{t("detail-doctor.not-apply")}</p>
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

export default memo(ClinicInfo);
