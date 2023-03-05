import React, { memo } from "react";
import _ from "lodash";
import HtmlReactParser from "html-react-parser";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { path } from "../../utils/constants";
import "../../styles/Introduce.scss";

const Introduce = ({ doctorData, id, small, buttonSeeMore, packageData, packageClinicSpecialty, remote }) => {
  const { language } = useSelector((store) => store.app);
  const { t } = useTranslation();

  const handleDisplayNameRolePosition = (doctor) => {
    const {
      moreData: { firstName, lastName, positionData, roleData },
    } = doctor;
    const position = language === "vi" ? positionData.valueVi : positionData.valueEn;
    const role = language === "vi" ? roleData.valueVi : roleData.valueEn;
    const nameDoctor = language === "vi" ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;
    const typeRemote = remote ? (language === "vi" ? "(Bác sĩ từ xa)" : "(Telemedicine)") : "";

    if (positionData.keyMap === "P0") {
      return `${role} - ${nameDoctor} ${typeRemote}`;
    }

    if (roleData.keyMap === "R8") {
      return `${position} - ${nameDoctor} ${typeRemote}`;
    }

    return `${position} - ${role} - ${nameDoctor} ${typeRemote}`;
  };

  if (!_.isEmpty(packageData)) {
    return (
      <>
        <div className={small ? "introduction introduction--small" : "introduction u-wrapper"}>
          <div className="introduction-left">
            <div
              className="introduction-left__image introduction-left__image--package"
              style={{
                backgroundImage: `url(${packageData.imageUrl})`,
              }}
            ></div>
            {buttonSeeMore && (
              <>
                {packageClinicSpecialty ? (
                  <Link
                    to={`/${path.CLINIC}/${packageData.clinicId}/specialties/${packageData.specialtyId}/package/${packageData.id}`}
                    className="info-left__button"
                  >
                    {t("button.see-more")}
                  </Link>
                ) : (
                  <Link to={`/package-clinic/${id}`} className="info-left__button">
                    {t("button.see-more")}
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="introduction-right">
            <h2 className="introduction-right__name">
              {language === "vi" ? packageData.nameVi : packageData.nameEn}
            </h2>
            <div className="introduction-right__summary">{HtmlReactParser(packageData.introductionHTML)}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={small ? "introduction introduction--small" : "introduction u-wrapper"}>
        <div className="introduction-left">
          <div
            className="introduction-left__image"
            style={{
              backgroundImage: `url(${doctorData?.moreData.imageUrl ? doctorData?.moreData.imageUrl : ""})`,
            }}
          ></div>
          {buttonSeeMore && (
            <>
              {remote ? (
                <Link to={`/doctor/remote/${id}`} className="info-left__button">
                  {t("button.see-more")}
                </Link>
              ) : (
                <Link to={`/doctor/${doctorData.doctorId}`} className="info-left__button">
                  {t("button.see-more")}
                </Link>
              )}
            </>
          )}
        </div>
        <div className="introduction-right">
          <h2 className="introduction-right__name">
            {doctorData?.moreData.positionData &&
              doctorData?.moreData.roleData &&
              handleDisplayNameRolePosition(doctorData)}
          </h2>
          <div className="introduction-right__summary">
            {doctorData?.introductionHTML && HtmlReactParser(doctorData.introductionHTML)}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Introduce);
